import { createContext, useContext } from "react";

export type ToastVariant = "success" | "info" | "error";

export type Toast = {
  id: string;
  message: string;
  variant: ToastVariant;
};

export type ToastContextValue = {
  addToast: (message: string, variant?: ToastVariant) => void;
};

// Séparé de ToastProvider.tsx : un fichier qui mélange composant et hook casse le Fast Refresh
// de Vite (le contexte se recrée en double au hot-reload et les consommateurs se figent).
export const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast doit être utilisé dans un ToastProvider");
  return ctx;
}
