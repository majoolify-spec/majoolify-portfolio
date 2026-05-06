import { Resend } from "resend";
import { z } from "zod";

const RATE_LIMIT_WINDOW_MS = 5 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

type RateLimitEntry = {
  count: number;
  windowStart: number;
};

const rateLimitStore = new Map<string, RateLimitEntry>();

const contactSchema = z.object({
  locale: z.enum(["en", "fr"]),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email(),
  company: z.string().trim().max(160).optional().default(""),
  brief: z.string().trim().min(10).max(5000),
  website: z.string().max(0).optional().default(""),
});

function getClientFingerprint(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for") || "";
  const firstIp = forwardedFor.split(",")[0]?.trim() || "unknown-ip";
  const userAgent = request.headers.get("user-agent")?.trim() || "unknown-ua";
  return `${firstIp}:${userAgent}`;
}

function isRateLimited(request: Request) {
  const now = Date.now();
  const fingerprint = getClientFingerprint(request);

  for (const [key, value] of rateLimitStore.entries()) {
    if (now - value.windowStart > RATE_LIMIT_WINDOW_MS) {
      rateLimitStore.delete(key);
    }
  }

  const current = rateLimitStore.get(fingerprint);

  if (!current) {
    rateLimitStore.set(fingerprint, { count: 1, windowStart: now });
    return false;
  }

  if (now - current.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitStore.set(fingerprint, { count: 1, windowStart: now });
    return false;
  }

  if (current.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  current.count += 1;
  rateLimitStore.set(fingerprint, current);
  return false;
}

export async function POST(request: Request) {
  if (isRateLimited(request)) {
    return Response.json(
      { ok: false, error: "Too many requests. Please try again in a few minutes." },
      { status: 429 },
    );
  }

  const payload = contactSchema.safeParse(await request.json().catch(() => null));

  if (!payload.success) {
    return Response.json(
      { ok: false, error: "Invalid contact request payload." },
      { status: 400 },
    );
  }

  const { locale, name, email, company, brief } = payload.data;
  const subject =
    locale === "en"
      ? `New Majoolify inquiry from ${name}`
      : `Nouvelle demande Majoolify de ${name}`;

  if (
    process.env.RESEND_API_KEY &&
    process.env.CONTACT_FROM_EMAIL &&
    process.env.CONTACT_TO_EMAIL
  ) {
    const resend = new Resend(process.env.RESEND_API_KEY);

    try {
      await resend.emails.send({
        from: process.env.CONTACT_FROM_EMAIL,
        to: process.env.CONTACT_TO_EMAIL,
        replyTo: email,
        subject,
        text: [
          `Name: ${name}`,
          `Email: ${email}`,
          `Company: ${company || "n/a"}`,
          "",
          brief,
        ].join("\n"),
      });
    } catch (error) {
      console.error("[contact] delivery failed", {
        message: error instanceof Error ? error.message : "Unknown error",
      });

      return Response.json(
        { ok: false, error: "Unable to submit your inquiry right now." },
        { status: 503 },
      );
    }
  } else {
    console.warn("[contact] delivery disabled: missing contact email configuration");
  }

  return Response.json({ ok: true });
}
