/**
 * Google Apps Script webhook for forms:
 * - validates payload
 * - stores rows in Google Sheets (append-only)
 * - sends Telegram notifications
 * - applies honeypot and rate-limit
 */

var ALLOWED_SOURCES = ["contact", "memento_mori", "interview_guest"];
var REQUIRED_FIELDS = {
  contact: ["source", "name", "email", "message", "pageUrl", "userAgent", "submittedAt"],
  memento_mori: ["source", "name", "phone", "pageUrl", "userAgent", "submittedAt"],
  interview_guest: ["source", "name", "contact", "guest", "pageUrl", "userAgent", "submittedAt"],
};

var SHEET_COLUMNS = [
  "created_at",
  "source",
  "name",
  "email",
  "phone",
  "contact",
  "message",
  "guest",
  "page_url",
  "user_agent",
  "client_ip",
  "status",
];

function doPost(e) {
  var now = new Date();
  try {
    var payload = parsePayload_(e);
    var source = String(payload.source || "");

    if (ALLOWED_SOURCES.indexOf(source) === -1) {
      return jsonResponse_(400, { ok: false, error: "Unsupported source." });
    }

    if (isHoneypotTriggered_(payload)) {
      logEvent_("honeypot", "Rejected by honeypot", payload, now);
      return jsonResponse_(200, { ok: true, message: "Accepted." });
    }

    var validationError = validatePayload_(source, payload);
    if (validationError) {
      logEvent_("validation", validationError, payload, now);
      return jsonResponse_(400, { ok: false, error: validationError });
    }

    var rateLimitResult = applyRateLimit_(payload, e);
    if (!rateLimitResult.ok) {
      logEvent_("rate_limit", rateLimitResult.error, payload, now);
      return jsonResponse_(429, { ok: false, error: rateLimitResult.error });
    }

    var normalized = normalizePayload_(payload);
    var storageResult = saveToSheet_(source, normalized, rateLimitResult.clientIp, now);
    if (!storageResult.ok) {
      logEvent_("storage", storageResult.error, normalized, now);
      return jsonResponse_(500, { ok: false, error: storageResult.error });
    }

    var notifyResult = notifyTelegram_(source, normalized, rateLimitResult.clientIp, now);
    if (!notifyResult.ok) {
      logEvent_("telegram", notifyResult.error, normalized, now);
      return jsonResponse_(200, {
        ok: true,
        message: "Saved, but Telegram delivery failed.",
      });
    }

    return jsonResponse_(200, { ok: true, message: "Saved." });
  } catch (err) {
    logEvent_("fatal", String(err), {}, now);
    return jsonResponse_(500, { ok: false, error: "Internal error." });
  }
}

function parsePayload_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new Error("Empty request body.");
  }
  var payload = JSON.parse(e.postData.contents);
  if (!payload || typeof payload !== "object") {
    throw new Error("Invalid JSON payload.");
  }
  return payload;
}

function validatePayload_(source, payload) {
  var required = REQUIRED_FIELDS[source] || [];
  for (var i = 0; i < required.length; i++) {
    var field = required[i];
    var value = payload[field];
    if (typeof value !== "string" || !value.trim()) {
      return "Missing required field: " + field;
    }
  }
  return null;
}

function isHoneypotTriggered_(payload) {
  var hp = String(payload.hp || payload.website || "").trim();
  return hp.length > 0;
}

function normalizePayload_(payload) {
  var result = {};
  var keys = [
    "source",
    "name",
    "email",
    "phone",
    "contact",
    "message",
    "guest",
    "pageUrl",
    "userAgent",
    "submittedAt",
  ];

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    var value = payload[key];
    result[key] = typeof value === "string" ? collapseWhitespace_(value).slice(0, 4000) : "";
  }

  return result;
}

function collapseWhitespace_(value) {
  return String(value).replace(/\s+/g, " ").trim();
}

function applyRateLimit_(payload, e) {
  var props = PropertiesService.getScriptProperties();
  var maxPerIp = parseInt(props.getProperty("RATE_LIMIT_MAX_PER_IP") || "3", 10);
  var windowSec = parseInt(props.getProperty("RATE_LIMIT_WINDOW_SEC") || "60", 10);
  var clientIp = getClientIp_(e);

  var fallbackKey = payload.userAgent + "|" + Math.floor(Date.now() / (windowSec * 1000));
  var identity = clientIp || fallbackKey;
  var key = "rl:" + Utilities.base64EncodeWebSafe(identity).slice(0, 80);

  var cache = CacheService.getScriptCache();
  var currentValue = cache.get(key);
  var currentCount = currentValue ? parseInt(currentValue, 10) : 0;
  var nextCount = currentCount + 1;

  if (nextCount > maxPerIp) {
    return { ok: false, error: "Too many requests. Try again later.", clientIp: clientIp || "" };
  }

  cache.put(key, String(nextCount), windowSec);
  return { ok: true, clientIp: clientIp || "" };
}

function getClientIp_(e) {
  if (e && e.parameter && e.parameter.ip) return String(e.parameter.ip);
  if (e && e.headers) {
    var xff = e.headers["x-forwarded-for"] || e.headers["X-Forwarded-For"];
    if (xff) return String(xff).split(",")[0].trim();
  }
  return "";
}

function saveToSheet_(source, payload, clientIp, now) {
  try {
    var sheetId = getRequiredProperty_("SHEET_ID");
    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var sheet = ensureSheet_(spreadsheet, source);

    var row = [
      now.toISOString(),
      source,
      payload.name || "",
      payload.email || "",
      payload.phone || "",
      payload.contact || "",
      payload.message || "",
      payload.guest || "",
      payload.pageUrl || "",
      payload.userAgent || "",
      clientIp || "",
      "new",
    ];

    sheet.appendRow(row);
    return { ok: true };
  } catch (err) {
    return { ok: false, error: "Sheet write error: " + err };
  }
}

function ensureSheet_(spreadsheet, source) {
  var sheet = spreadsheet.getSheetByName(source);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(source);
  }

  var hasHeaders = sheet.getLastRow() > 0;
  if (!hasHeaders) {
    sheet.appendRow(SHEET_COLUMNS);
  }

  return sheet;
}

function notifyTelegram_(source, payload, clientIp, now) {
  try {
    var botToken = getRequiredProperty_("TELEGRAM_BOT_TOKEN");
    var chatId = getRequiredProperty_("TELEGRAM_CHAT_ID");
    var endpoint = "https://api.telegram.org/bot" + botToken + "/sendMessage";
    var text = buildTelegramMessage_(source, payload, clientIp, now);

    var options = {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
      muteHttpExceptions: true,
    };

    var firstResponse = UrlFetchApp.fetch(endpoint, options);
    var firstCode = firstResponse.getResponseCode();
    if (firstCode >= 200 && firstCode < 300) {
      return { ok: true };
    }

    Utilities.sleep(500);
    var secondResponse = UrlFetchApp.fetch(endpoint, options);
    var secondCode = secondResponse.getResponseCode();
    if (secondCode >= 200 && secondCode < 300) {
      return { ok: true };
    }

    return {
      ok: false,
      error:
        "Telegram error: " +
        secondCode +
        " " +
        String(secondResponse.getContentText() || "").slice(0, 500),
    };
  } catch (err) {
    return { ok: false, error: "Telegram exception: " + err };
  }
}

function buildTelegramMessage_(source, payload, clientIp, now) {
  var title = {
    contact: "Новая заявка: Contact",
    memento_mori: "Новая заявка: Memento Mori",
    interview_guest: "Новая заявка: Интервью",
  }[source];

  var lines = [
    "<b>" + escapeHtml_(title || "Новая заявка") + "</b>",
    "",
    "<b>Имя:</b> " + escapeHtml_(payload.name || "—"),
    payload.email ? "<b>Email:</b> " + escapeHtml_(payload.email) : "",
    payload.phone ? "<b>Телефон:</b> " + escapeHtml_(payload.phone) : "",
    payload.contact ? "<b>Контакт:</b> " + escapeHtml_(payload.contact) : "",
    payload.message ? "<b>Сообщение:</b> " + escapeHtml_(payload.message) : "",
    payload.guest ? "<b>Гость:</b> " + escapeHtml_(payload.guest) : "",
    "<b>Источник:</b> " + escapeHtml_(payload.source || source),
    "<b>Время клиента:</b> " + escapeHtml_(payload.submittedAt || "—"),
    "<b>Время сервера:</b> " + escapeHtml_(now.toISOString()),
    "<b>URL:</b> " + escapeHtml_(payload.pageUrl || "—"),
    "<b>IP:</b> " + escapeHtml_(clientIp || "n/a"),
  ];

  return lines.filter(function (line) {
    return Boolean(line);
  }).join("\n");
}

function escapeHtml_(input) {
  return String(input)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function getRequiredProperty_(key) {
  var value = PropertiesService.getScriptProperties().getProperty(key);
  if (!value) {
    throw new Error("Missing Script Property: " + key);
  }
  return value;
}

function logEvent_(category, message, payload, now) {
  try {
    var sheetId = PropertiesService.getScriptProperties().getProperty("SHEET_ID");
    if (!sheetId) return;

    var spreadsheet = SpreadsheetApp.openById(sheetId);
    var logsSheet = spreadsheet.getSheetByName("logs");
    if (!logsSheet) {
      logsSheet = spreadsheet.insertSheet("logs");
      logsSheet.appendRow(["created_at", "category", "message", "payload"]);
    }

    logsSheet.appendRow([
      now.toISOString(),
      category,
      String(message || "").slice(0, 1000),
      JSON.stringify(payload || {}).slice(0, 5000),
    ]);
  } catch (_err) {
    // ignore logging failures
  }
}

function jsonResponse_(statusCode, data) {
  // Apps Script does not support setting custom HTTP status directly for ContentService.
  // We include status in payload for easier client-side diagnostics.
  var payload = {
    ok: Boolean(data.ok),
    status: statusCode,
    message: data.message || "",
    error: data.error || "",
  };
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
