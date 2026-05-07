type StatusBannerProps = {
  status?: string;
  detail?: string;
};

type StatusTone = "error" | "warning" | "success";

type ClassifiedStatus = {
  label: string;
  tone: StatusTone;
};

export function classifyAdminStatus(status: string): ClassifiedStatus {
  const normalized = status.trim().toLowerCase();
  const tone: StatusTone = normalized.includes("error")
    ? "error"
    : normalized.includes("dry-run")
      ? "warning"
      : "success";

  const label = status
    .trim()
    .toLowerCase()
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());

  return { label, tone };
}

export function StatusBanner({ status, detail }: StatusBannerProps) {
  if (!status) {
    return null;
  }

  const { label, tone } = classifyAdminStatus(status);
  const isError = tone === "error";
  const isWarning = tone === "warning";

  return (
    <div
      className={`mb-6 rounded-[1.4rem] border px-4 py-3 text-sm ${
        isError
          ? "border-red-300 bg-red-50 text-red-700"
          : isWarning
            ? "border-amber-300 bg-amber-50 text-amber-800"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
      role={isError ? "alert" : "status"}
      aria-live={isError ? "assertive" : "polite"}
    >
      <strong className="font-semibold">{label}</strong>
      {detail ? <span className="ml-2">{detail}</span> : null}
    </div>
  );
}
