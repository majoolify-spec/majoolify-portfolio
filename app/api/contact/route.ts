import { Resend } from "resend";
import { z } from "zod";

const contactSchema = z.object({
  locale: z.enum(["en", "fr"]),
  name: z.string().min(2),
  email: z.string().email(),
  company: z.string().optional().default(""),
  brief: z.string().min(10),
  website: z.string().max(0).optional().default(""),
});

export async function POST(request: Request) {
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
  } else {
    console.log("[contact]", {
      locale,
      name,
      email,
      company,
      brief,
    });
  }

  return Response.json({ ok: true });
}
