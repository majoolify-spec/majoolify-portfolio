const BUTTON_BASE =
  "inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold leading-tight transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-strong)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]";

const BUTTON_DISABLED = "disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:shadow-none";

export const BUTTON_PRIMARY =
  `${BUTTON_BASE} on-ink border border-transparent bg-[var(--foreground)] shadow-[0_10px_24px_rgba(15,23,36,0.24)] hover:shadow-[0_16px_30px_rgba(15,23,36,0.26)]`;

export const BUTTON_PRIMARY_DISABLED = `${BUTTON_PRIMARY} ${BUTTON_DISABLED}`;

export const BUTTON_SECONDARY =
  `${BUTTON_BASE} border border-[var(--border)] bg-white/72 text-[var(--foreground)] hover:border-[rgba(15,118,110,0.34)]`;

export const BUTTON_ACCENT =
  `${BUTTON_BASE} border border-[rgba(15,118,110,0.24)] bg-white/72 text-[var(--accent-strong)] hover:border-[rgba(15,118,110,0.34)]`;

export const PANEL_STANDARD = "glass-panel rounded-[1.8rem] p-6";

export const PANEL_SPACIOUS = "glass-panel rounded-[2rem] p-6 md:p-8";
