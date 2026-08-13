import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { ToastContext, type Toast, type ToastContextValue, type ToastVariant } from "./toastContext";

const DUREE_AFFICHAGE_MS = 3500;

let compteurToastId = 0;

function genererToastId(): string {
  compteurToastId += 1;
  return `toast-${Date.now()}-${compteurToastId}`;
}

const STYLES_VARIANTE: Record<ToastVariant, { bordure: string; icone: string; texteIcone: string }> = {
  success: { bordure: "border-l-emerald-500", icone: "✓", texteIcone: "text-emerald-400" },
  info: { bordure: "border-l-panel-accent", icone: "ℹ", texteIcone: "text-panel-accent" },
  error: { bordure: "border-l-red-500", icone: "✕", texteIcone: "text-red-400" },
};

function ToastItem({ toast, onFermer }: { toast: Toast; onFermer: (id: string) => void }) {
  const [visible, setVisible] = useState(false);
  const styles = STYLES_VARIANTE[toast.variant];

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`flex items-start gap-2 rounded-lg border border-panel-border ${styles.bordure} border-l-4 bg-panel-surface px-4 py-3 shadow-lg shadow-black/30 transition-all duration-300 ${
        visible ? "translate-y-0 opacity-100" : "translate-y-1 opacity-0"
      }`}
    >
      <span className={`mt-0.5 text-sm font-semibold ${styles.texteIcone}`}>{styles.icone}</span>
      <p className="flex-1 text-sm text-panel-text">{toast.message}</p>
      <button
        type="button"
        onClick={() => onFermer(toast.id)}
        className="text-panel-muted transition-colors hover:text-panel-text"
        aria-label="Fermer la notification"
      >
        ×
      </button>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  useEffect(() => {
    const timeouts = timeoutsRef.current;
    return () => {
      timeouts.forEach((timeoutId) => clearTimeout(timeoutId));
      timeouts.clear();
    };
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
  }, []);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = "info") => {
      const id = genererToastId();
      setToasts((prev) => [...prev, { id, message, variant }]);
      const timeoutId = setTimeout(() => removeToast(id), DUREE_AFFICHAGE_MS);
      timeoutsRef.current.set(id, timeoutId);
    },
    [removeToast],
  );

  const value = useMemo<ToastContextValue>(() => ({ addToast }), [addToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onFermer={removeToast} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
