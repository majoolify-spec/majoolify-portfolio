type StatusBannerProps = {
  status?: string;
  detail?: string;
};

export function StatusBanner({ status, detail }: StatusBannerProps) {
  if (!status) {
    return null;
  }

  const isError = status.includes("error");

  return (
    <div
      className={`mb-6 rounded-[1.4rem] border px-4 py-3 text-sm ${
        isError
          ? "border-red-300 bg-red-50 text-red-700"
          : "border-emerald-200 bg-emerald-50 text-emerald-700"
      }`}
    >
      <strong className="font-semibold">{status}</strong>
      {detail ? <span className="ml-2">{detail}</span> : null}
    </div>
  );
}
