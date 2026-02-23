import { afterEach, describe, expect, it, vi } from "vitest";
import { submitForm } from "@/lib/forms-api";

const basePayload = {
  source: "contact" as const,
  name: "  Ирина   Тест  ",
  email: "  test@example.com ",
  message: "  Привет,   мир! ",
  pageUrl: " https://example.com/landing ",
  userAgent: " test-agent ",
  submittedAt: new Date("2026-02-23T12:00:00.000Z").toISOString(),
};

afterEach(() => {
  vi.restoreAllMocks();
  delete (window as Window & { __FORMS_WEBHOOK_URL__?: string }).__FORMS_WEBHOOK_URL__;
});

describe("submitForm", () => {
  it("submits payload and returns ok=true", async () => {
    (window as Window & { __FORMS_WEBHOOK_URL__?: string }).__FORMS_WEBHOOK_URL__ =
      "https://example.com/webhook";

    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true, message: "Saved." }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitForm("contact", basePayload);

    expect(result.ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, request] = fetchMock.mock.calls[0];
    const body = JSON.parse((request as RequestInit).body as string);
    expect(body.name).toBe("Ирина Тест");
    expect(body.message).toBe("Привет, мир!");
  });

  it("returns error message from webhook payload", async () => {
    (window as Window & { __FORMS_WEBHOOK_URL__?: string }).__FORMS_WEBHOOK_URL__ =
      "https://example.com/webhook";

    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ ok: false, error: "Too many requests." }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        })
      )
    );

    const result = await submitForm("contact", basePayload);
    expect(result.ok).toBe(false);
    expect(result.message).toBe("Too many requests.");
  });

  it("returns network error on fetch failure", async () => {
    (window as Window & { __FORMS_WEBHOOK_URL__?: string }).__FORMS_WEBHOOK_URL__ =
      "https://example.com/webhook";
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network down")));

    const result = await submitForm("contact", basePayload);
    expect(result.ok).toBe(false);
    expect(result.message).toContain("Ошибка сети");
  });

  it("short-circuits honeypot submissions without fetch", async () => {
    (window as Window & { __FORMS_WEBHOOK_URL__?: string }).__FORMS_WEBHOOK_URL__ =
      "https://example.com/webhook";
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await submitForm("contact", {
      ...basePayload,
      hp: "spam",
    });

    expect(result.ok).toBe(true);
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

