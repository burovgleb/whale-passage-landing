export type FormSource = "contact" | "memento_mori" | "interview_guest";

type BasePayload = {
  source: FormSource;
  pageUrl: string;
  userAgent: string;
  submittedAt: string;
  hp?: string;
};

export type ContactPayload = BasePayload & {
  name: string;
  email: string;
  message: string;
};

export type MementoPayload = BasePayload & {
  name: string;
  phone: string;
};

export type InterviewPayload = BasePayload & {
  name: string;
  contact: string;
  guest: string;
};

export type FormPayloadMap = {
  contact: ContactPayload;
  memento_mori: MementoPayload;
  interview_guest: InterviewPayload;
};

export type SubmitResult = {
  ok: boolean;
  message?: string;
};

type FormResponse = {
  ok?: boolean;
  message?: string;
  error?: string;
};

const REQUIRED_FIELDS: Record<FormSource, Array<keyof FormPayloadMap[FormSource]>> = {
  contact: ["name", "email", "message", "source", "pageUrl", "userAgent", "submittedAt"],
  memento_mori: ["name", "phone", "source", "pageUrl", "userAgent", "submittedAt"],
  interview_guest: ["name", "contact", "guest", "source", "pageUrl", "userAgent", "submittedAt"],
};

const MAX_LENGTH: Record<string, number> = {
  name: 200,
  email: 200,
  phone: 80,
  contact: 200,
  message: 4000,
  guest: 4000,
  pageUrl: 1000,
  userAgent: 600,
  submittedAt: 80,
  source: 80,
  hp: 200,
};

const REQUEST_TIMEOUT_MS = 10_000;

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}

function normalizePayload<T extends Record<string, unknown>>(payload: T): T {
  const normalized = { ...payload };
  for (const [key, value] of Object.entries(normalized)) {
    if (typeof value !== "string") continue;
    const sanitized = normalizeWhitespace(value);
    const maxLength = MAX_LENGTH[key];
    normalized[key as keyof T] = (maxLength ? sanitized.slice(0, maxLength) : sanitized) as T[keyof T];
  }
  return normalized;
}

function validatePayload<T extends FormSource>(formType: T, payload: FormPayloadMap[T]): string | null {
  if (payload.source !== formType) {
    return "Некорректный тип формы.";
  }

  for (const field of REQUIRED_FIELDS[formType]) {
    const value = payload[field];
    if (typeof value !== "string" || value.length === 0) {
      return "Пожалуйста, заполните все обязательные поля.";
    }
  }

  return null;
}

function resolveWebhookUrl(): string {
  const fromEnv = import.meta.env.VITE_FORMS_WEBHOOK_URL as string | undefined;
  const fromWindow =
    typeof window !== "undefined"
      ? (window as Window & { __FORMS_WEBHOOK_URL__?: string }).__FORMS_WEBHOOK_URL__
      : undefined;

  return (fromEnv || fromWindow || "").trim();
}

function parseErrorMessage(response: FormResponse, fallback: string): string {
  return response.error || response.message || fallback;
}

export async function submitForm<T extends FormSource>(
  formType: T,
  payload: FormPayloadMap[T]
): Promise<SubmitResult> {
  if ((payload.hp || "").trim().length > 0) {
    return { ok: true };
  }

  const normalizedPayload = normalizePayload(payload);
  const validationError = validatePayload(formType, normalizedPayload);
  if (validationError) {
    return { ok: false, message: validationError };
  }

  const webhookUrl = resolveWebhookUrl();
  if (!webhookUrl) {
    return { ok: false, message: "Форма временно недоступна. Попробуйте позже." };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify(normalizedPayload),
      signal: controller.signal,
    });

    let responseData: FormResponse = {};
    try {
      responseData = (await response.json()) as FormResponse;
    } catch {
      responseData = {};
    }

    if (!response.ok || responseData.ok === false) {
      return {
        ok: false,
        message: parseErrorMessage(responseData, "Не удалось отправить форму. Попробуйте снова."),
      };
    }

    return { ok: true, message: responseData.message };
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      return { ok: false, message: "Превышено время ожидания. Попробуйте еще раз." };
    }
    return { ok: false, message: "Ошибка сети. Проверьте подключение и повторите отправку." };
  } finally {
    clearTimeout(timeoutId);
  }
}
