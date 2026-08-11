import type { ReactNode } from "react";
import { BrandBadge } from "./BrandBadge";

type AuthLayoutProps = {
  children: ReactNode;
};

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="flex h-screen items-center justify-center bg-panel-bg bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.12),transparent_55%)] px-4">
      <div className="grid w-full max-w-3xl grid-cols-1 overflow-hidden rounded-2xl border border-panel-border bg-panel-surface shadow-2xl shadow-black/40 md:grid-cols-[1fr_1.3fr]">
        <div className="relative flex flex-col items-center justify-center gap-4 overflow-hidden border-b border-panel-border bg-gradient-to-b from-indigo-500/10 via-panel-bg to-panel-surface px-8 py-12 md:border-b-0 md:border-r">
          <BrandBadge />
          <div className="text-center">
            <p className="text-lg font-bold tracking-[0.2em] text-panel-text">
              PANEL DISPATCH
            </p>
            <p className="mt-2 text-xs text-panel-muted">
              Système de gestion des opérations policières
            </p>
          </div>
          <span className="mt-4 rounded border border-panel-border bg-panel-bg px-3 py-1.5 text-center text-[10px] font-medium uppercase tracking-wide text-panel-muted">
            Accès restreint · Personnel autorisé uniquement
          </span>
        </div>

        <div className="flex flex-col justify-between px-8 py-10">
          <div>{children}</div>
          <div className="mt-8 flex items-center justify-between border-t border-panel-border pt-4 text-[11px] text-panel-muted">
            <span>Panel Dispatch · Système Web Interne</span>
            <span>v0.1 · MVP</span>
          </div>
        </div>
      </div>
    </div>
  );
}
