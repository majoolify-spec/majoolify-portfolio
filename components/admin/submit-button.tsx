"use client";

import { useFormStatus } from "react-dom";
import { BUTTON_PRIMARY_DISABLED } from "../../lib/ui-classes";

export function SubmitButton({
  label,
  pendingLabel,
}: {
  label: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={BUTTON_PRIMARY_DISABLED}
    >
      {pending ? pendingLabel || "Saving..." : label}
    </button>
  );
}
