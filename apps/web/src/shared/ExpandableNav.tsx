import type { ComponentType, SVGProps } from "react";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";

export type ExpandableNavItem =
  | {
      type: "link";
      to: string;
      label: string;
      end?: boolean;
      Icon: ComponentType<SVGProps<SVGSVGElement>>;
      activeClass?: string;
    }
  | { type: "separator" };

const pillVariants = {
  repos: { paddingLeft: "0.5rem", paddingRight: "0.5rem", gap: "0rem" },
  expanded: { paddingLeft: "0.75rem", paddingRight: "0.75rem", gap: "0.4rem" },
};

const labelVariants = {
  repos: { width: 0, opacity: 0 },
  expanded: { width: "auto", opacity: 1 },
};

const transition = { type: "spring" as const, bounce: 0, duration: 0.35 };

export function ExpandableNav({ items, className }: { items: ExpandableNavItem[]; className?: string }) {
  return (
    <nav className={`flex items-center gap-1 rounded-2xl border border-panel-border bg-panel-bg/60 p-1 ${className ?? ""}`}>
      {items.map((item, index) => {
        if (item.type === "separator") {
          return <div key={`sep-${index}`} className="mx-1 h-5 w-px bg-panel-border" aria-hidden="true" />;
        }

        const { to, label, end, Icon, activeClass } = item;

        return (
          <NavLink
            key={to}
            to={to}
            end={end}
            title={label}
            className="rounded-xl outline-none focus-visible:bg-panel-bg"
          >
            {({ isActive }) => (
              <motion.div
                initial="repos"
                animate={isActive ? "expanded" : "repos"}
                whileHover="expanded"
                variants={pillVariants}
                transition={transition}
                className={`flex items-center overflow-hidden rounded-xl py-2 text-sm font-medium ${
                  isActive
                    ? activeClass ?? "bg-panel-accent/15 text-panel-accent"
                    : "text-panel-muted hover:text-panel-text"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                <motion.span
                  variants={labelVariants}
                  transition={transition}
                  className="overflow-hidden whitespace-nowrap text-xs"
                >
                  {label}
                </motion.span>
              </motion.div>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
