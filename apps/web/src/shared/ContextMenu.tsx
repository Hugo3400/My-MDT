import { useEffect, useLayoutEffect, useRef, useState } from "react";

export type ContextMenuItem =
  | { type: "action"; label: string; onSelect: () => void; danger?: boolean; disabled?: boolean }
  | { type: "submenu"; label: string; items: ContextMenuItem[]; disabled?: boolean }
  | { type: "separator" };

function useClampedPosition(anchorX: number, anchorY: number) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: anchorX, top: anchorY });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const margin = 4;
    const rect = el.getBoundingClientRect();
    let left = anchorX;
    let top = anchorY;
    if (left + rect.width > window.innerWidth - margin) {
      left = Math.max(margin, window.innerWidth - rect.width - margin);
    }
    if (top + rect.height > window.innerHeight - margin) {
      top = Math.max(margin, window.innerHeight - rect.height - margin);
    }
    setPosition({ left, top });
  }, [anchorX, anchorY]);

  return { ref, position };
}

function Flyout({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const { ref, position } = useClampedPosition(x, y);

  return (
    <div
      ref={ref}
      style={{ left: position.left, top: position.top }}
      className="fixed z-50 min-w-48 rounded-lg border border-panel-border bg-panel-surface shadow-xl shadow-black/40"
    >
      <MenuItems items={items} onClose={onClose} />
    </div>
  );
}

function SubmenuRow({
  item,
  isOpen,
  onEnter,
  onLeave,
  onClose,
}: {
  item: Extract<ContextMenuItem, { type: "submenu" }>;
  isOpen: boolean;
  onEnter: () => void;
  onLeave: () => void;
  onClose: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const rect = isOpen ? rowRef.current?.getBoundingClientRect() : null;

  return (
    <div
      ref={rowRef}
      className="relative"
      onMouseEnter={() => {
        if (!item.disabled) onEnter();
      }}
      onMouseLeave={onLeave}
    >
      <div
        className={`flex items-center justify-between gap-3 px-3 py-1.5 text-sm ${
          item.disabled
            ? "cursor-not-allowed text-panel-muted/50"
            : "cursor-default text-panel-text hover:bg-panel-bg"
        }`}
      >
        <span>{item.label}</span>
        <span className="text-panel-muted">›</span>
      </div>
      {rect && <Flyout x={rect.right} y={rect.top} items={item.items} onClose={onClose} />}
    </div>
  );
}

function MenuItems({ items, onClose }: { items: ContextMenuItem[]; onClose: () => void }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  if (items.length === 0) {
    return <div className="px-3 py-2 text-xs text-panel-muted">Aucune action disponible</div>;
  }

  return (
    <div className="flex flex-col py-1">
      {items.map((item, index) => {
        if (item.type === "separator") {
          return <div key={index} className="my-1 border-t border-panel-border" />;
        }

        if (item.type === "action") {
          return (
            <button
              key={index}
              type="button"
              disabled={item.disabled}
              onClick={() => {
                if (item.disabled) return;
                item.onSelect();
                onClose();
              }}
              className={`px-3 py-1.5 text-left text-sm outline-none transition-colors ${
                item.disabled
                  ? "cursor-not-allowed text-panel-muted/50"
                  : item.danger
                  ? "text-red-400 hover:bg-panel-bg"
                  : "text-panel-text hover:bg-panel-bg"
              }`}
            >
              {item.label}
            </button>
          );
        }

        return (
          <SubmenuRow
            key={index}
            item={item}
            isOpen={openIndex === index}
            onEnter={() => setOpenIndex(index)}
            onLeave={() => setOpenIndex((current) => (current === index ? null : current))}
            onClose={onClose}
          />
        );
      })}
    </div>
  );
}

export function ContextMenu({
  x,
  y,
  items,
  onClose,
}: {
  x: number;
  y: number;
  items: ContextMenuItem[];
  onClose: () => void;
}) {
  const { ref, position } = useClampedPosition(x, y);

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    }
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      ref={ref}
      style={{ left: position.left, top: position.top }}
      className="fixed z-50 min-w-48 rounded-lg border border-panel-border bg-panel-surface shadow-xl shadow-black/40"
    >
      <MenuItems items={items} onClose={onClose} />
    </div>
  );
}
