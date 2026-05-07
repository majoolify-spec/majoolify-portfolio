import Link from "next/link";
import { BUTTON_PRIMARY } from "../lib/ui-classes";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-20">
      <div className="glass-panel max-w-xl rounded-[2rem] p-10 text-center">
        <p className="section-kicker">404</p>
        <h1 className="section-title mt-3 text-[3rem]">The route slipped out of scope.</h1>
        <p className="mt-4 text-pretty text-[var(--muted)]">
          The page you asked for does not exist in this portfolio build.
        </p>
        <Link
          href="/en"
          className={`${BUTTON_PRIMARY} mt-8`}
        >
          Back to Majoolify
        </Link>
      </div>
    </main>
  );
}
