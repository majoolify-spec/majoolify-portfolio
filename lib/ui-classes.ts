const BUTTON_BASE =
  "inline-flex min-h-10 min-w-10 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold leading-tight transition hover:-translate-y-0.5";

const BUTTON_DISABLED = "disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none";

export const BUTTON_PRIMARY =
  `${BUTTON_BASE} on-ink border border-transparent bg-[var(--foreground)] shadow-[0_10px_24px_rgba(15,23,36,0.24)] hover:shadow-[0_16px_30px_rgba(15,23,36,0.26)]`;

export const BUTTON_PRIMARY_DISABLED = `${BUTTON_PRIMARY} ${BUTTON_DISABLED}`;

export const BUTTON_SECONDARY =
  `${BUTTON_BASE} border border-[var(--border)] bg-white/72 text-[var(--foreground)] hover:border-[rgba(15,118,110,0.34)]`;

export const BUTTON_ACCENT =
  `${BUTTON_BASE} border border-[rgba(15,118,110,0.24)] bg-white/72 text-[var(--accent-strong)] hover:border-[rgba(15,118,110,0.34)]`;
