"use client";

import { useRef, useState } from "react";

type ContactFormProps = {
  locale: "en" | "fr";
  submitLabel: string;
  successMessage: string;
};

const copy = {
  en: {
    name: "Your name",
    email: "Email address",
    company: "Company or product",
    brief: "Project brief",
    error: "Something failed. Send Ahmed an email directly instead.",
    sending: "Sending...",
  },
  fr: {
    name: "Votre nom",
    email: "Adresse e-mail",
    company: "Entreprise ou produit",
    brief: "Brief du projet",
    error: "Une erreur est survenue. Contactez Ahmed directement par e-mail.",
    sending: "Envoi...",
  },
} as const;

export function ContactForm({
  locale,
  submitLabel,
  successMessage,
}: ContactFormProps) {
  const labels = copy[locale];
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setStatus("loading");
    setMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          locale,
          name: formData.get("name"),
          email: formData.get("email"),
          company: formData.get("company"),
          brief: formData.get("brief"),
          website: formData.get("website"),
        }),
      });

      const body = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !body.ok) {
        throw new Error(body.error || labels.error);
      }

      setStatus("success");
      setMessage(successMessage);
      formRef.current?.reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : labels.error);
    }
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="glass-panel rounded-[2rem] p-6 md:p-8"
      aria-busy={status === "loading"}
    >
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        className="sr-only"
        aria-hidden
      />
      <div className="grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">{labels.name}</span>
          <input
            required
            name="name"
            autoComplete="name"
            maxLength={120}
            className="w-full rounded-full border border-[var(--border)] bg-white/80 px-4 py-3"
          />
        </label>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold">{labels.email}</span>
          <input
            required
            type="email"
            name="email"
            autoComplete="email"
            maxLength={120}
            className="w-full rounded-full border border-[var(--border)] bg-white/80 px-4 py-3"
          />
        </label>
      </div>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold">{labels.company}</span>
        <input
          name="company"
          autoComplete="organization"
          maxLength={160}
          className="w-full rounded-full border border-[var(--border)] bg-white/80 px-4 py-3"
        />
      </label>
      <label className="mt-4 block">
        <span className="mb-2 block text-sm font-semibold">{labels.brief}</span>
        <textarea
          required
          name="brief"
          rows={6}
          maxLength={5000}
          className="w-full rounded-[1.5rem] border border-[var(--border)] bg-white/80 px-4 py-3"
        />
      </label>
      <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={status === "loading"}
          className="on-ink inline-flex items-center justify-center rounded-full bg-[var(--foreground)] px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {status === "loading" ? labels.sending : submitLabel}
        </button>
        {status !== "idle" ? (
          <p
            role="status"
            aria-live="polite"
            className={`text-sm ${
              status === "success" ? "text-[var(--success)]" : "text-[var(--danger)]"
            }`}
          >
            {message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
