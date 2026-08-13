// crypto.randomUUID() n'existe que dans un contexte sécurisé (HTTPS ou localhost) —
// indisponible en HTTP simple (ex. accès direct par IP), d'où ce repli.
export function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
