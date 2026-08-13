import { useState } from "react";
import { usePatrouilles } from "../../shared/patrouillesContext";
import { PatrouillesTab } from "./PatrouillesTab";
import { InterventionsTab } from "./InterventionsTab";

type Onglet = "patrouilles" | "interventions";

const ONGLETS: { id: Onglet; label: string }[] = [
  { id: "patrouilles", label: "Patrouilles" },
  { id: "interventions", label: "Interventions" },
];

export function DispatchPage() {
  const [onglet, setOnglet] = useState<Onglet>("patrouilles");
  const { patrouilles, setPatrouilles } = usePatrouilles();

  return (
    <div className="flex h-[calc(100vh-9.5rem)] flex-col gap-3">
      <div className="flex shrink-0 gap-1 border-b border-panel-border">
        {ONGLETS.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setOnglet(o.id)}
            className={`border-b-2 px-3 py-2 text-sm font-medium outline-none transition-colors ${
              onglet === o.id
                ? "border-panel-accent text-panel-text"
                : "border-transparent text-panel-muted hover:text-panel-text"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {onglet === "patrouilles" && (
          <PatrouillesTab patrouilles={patrouilles} setPatrouilles={setPatrouilles} />
        )}
        {onglet === "interventions" && <InterventionsTab patrouilles={patrouilles} />}
      </div>
    </div>
  );
}
