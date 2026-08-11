import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { IconShield } from "./icons";

export function StatusBar() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const time = now.toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <header className="flex h-11 shrink-0 items-center justify-between border-b border-panel-border bg-panel-surface px-4">
      <NavLink to="/dashboard" className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full border border-panel-accent/40 bg-panel-accent/10 text-panel-accent">
          <IconShield className="h-3.5 w-3.5" />
        </span>
        <span className="text-xs font-bold tracking-[0.2em] text-panel-text">
          PANEL DISPATCH
        </span>
        <span className="hidden text-[10px] uppercase tracking-widest text-panel-muted sm:inline">
          · Système de dispatch tactique
        </span>
      </NavLink>

      <div className="flex items-center gap-4 text-[11px] font-medium">
        <span className="flex items-center gap-1.5 text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          Sécurisé
        </span>
        <span className="flex items-center gap-1.5 text-sky-400">
          <span className="h-1.5 w-1.5 rounded-full bg-sky-400" aria-hidden="true" />
          Réseau OK
        </span>
        <span className="tabular-nums text-panel-muted">{time}</span>
      </div>
    </header>
  );
}
