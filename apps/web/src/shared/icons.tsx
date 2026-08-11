import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function IconDispatch(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 18v3M8.5 15.5a5 5 0 0 1 7 0M5.5 12.5a9 9 0 0 1 13 0" />
      <circle cx="12" cy="18" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function IconRapports(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z" />
      <path d="M14 3v4h4M9 12h6M9 16h6M9 8h2" />
    </svg>
  );
}

export function IconWarrants(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3 4 6.5V11c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V6.5L12 3Z" />
      <path d="m9.5 12 1.8 1.8L15 10" />
    </svg>
  );
}

export function IconRegistres(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <circle cx="8.5" cy="10.5" r="1.6" />
      <path d="M6 15c.6-1.4 1.6-2 2.5-2s1.9.6 2.5 2M14 9h5M14 13h5M14 17h3" />
    </svg>
  );
}

export function IconEnquetes(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="10.5" cy="10.5" r="5.5" />
      <path d="m19 19-4.3-4.3" />
    </svg>
  );
}

export function IconSaisies(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M3 7h18M4 7l1.2 12.1A2 2 0 0 0 7.2 21h9.6a2 2 0 0 0 2-1.9L20 7" />
      <path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M10 11v6M14 11v6" />
    </svg>
  );
}

export function IconCarte(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4 4 6v14l5-2 6 2 5-2V4l-5 2-6-2Z" />
      <path d="M9 4v14M15 6v14" />
    </svg>
  );
}

export function IconSpecialites(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="4" />
      <path d="m9.5 12.5-2 8 4.5-2.5 4.5 2.5-2-8" />
    </svg>
  );
}

export function IconAdministration(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6a7 7 0 0 0 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2Z" />
    </svg>
  );
}

export function IconHome(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="m4 11 8-7 8 7" />
      <path d="M6 10v9a1 1 0 0 0 1 1h3v-6h4v6h3a1 1 0 0 0 1-1v-9" />
    </svg>
  );
}

export function IconParametres(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6h10M17 6h3M4 12h4M11 12h9M4 18h13M20 18h0" />
      <circle cx="14" cy="6" r="2" />
      <circle cx="7" cy="12" r="2" />
      <circle cx="17" cy="18" r="2" />
    </svg>
  );
}

export function IconCamera(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13" r="3.2" />
    </svg>
  );
}

export function IconHistorique(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 8a8 8 0 1 1 1.7 9M4 4v4h4" />
      <path d="M12 8v4l3 2" />
    </svg>
  );
}

export function IconAbsence(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v4M16 3v4" />
      <path d="m9 14 2.2 2.2L15.5 12" />
    </svg>
  );
}

export function IconSecurite(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <path d="M12 15v2" />
    </svg>
  );
}

export function IconNotification(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 10a6 6 0 0 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 14 6 10Z" />
      <path d="M10 19a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconShield(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 2 4 5v6c0 5 3.4 8.9 8 10 4.6-1.1 8-5 8-10V5l-8-3Z" />
      <path d="m9.5 12 1.8 1.8L15 10" />
    </svg>
  );
}
