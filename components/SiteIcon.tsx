import type { SVGProps } from "react";

export type SiteIconName = "pin" | "search" | "building" | "wifi" | "sofa" | "broom" | "phone" | "arrow" | "check" | "home";

export default function SiteIcon({ name, size = 18, className = "" }: { name: SiteIconName; size?: number; className?: string }) {
  const common: SVGProps<SVGSVGElement> = {
    width: size, height: size, viewBox: "0 0 24 24", fill: "none",
    stroke: "currentColor", strokeWidth: 1.9, strokeLinecap: "round", strokeLinejoin: "round",
    "aria-hidden": true, className
  };

  const paths: Record<SiteIconName, React.ReactNode> = {
    pin: <><path d="M20 10.5c0 5.1-8 11-8 11s-8-5.9-8-11a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10.5" r="2.5"/></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/></>,
    building: <><path d="M4 21V5.5L13 3v18M13 8h7v13M7 8h2M7 12h2M7 16h2M16 11h2M16 15h2M16 19h2"/></>,
    wifi: <><path d="M3 9.5a14 14 0 0 1 18 0M6 13a9.5 9.5 0 0 1 12 0M9 16.5a5 5 0 0 1 6 0"/><circle cx="12" cy="20" r="1"/></>,
    sofa: <><path d="M5 13V9.5A2.5 2.5 0 0 1 7.5 7h9A2.5 2.5 0 0 1 19 9.5V13"/><path d="M4 13a2 2 0 0 0-2 2v2h20v-2a2 2 0 0 0-2-2"/><path d="M5 17v3M19 17v3M6 13h12"/></>,
    broom: <><path d="m4 20 9-9M12 4l2-2M14 7l3-3M16 10l3-3M3 21l2-2"/><path d="M13 11c2.2 1.5 4.4 2.1 6.8 1.8"/></>,
    phone: <><path d="M6.5 3.5 9 3l2 5-2.2 1.5a14.5 14.5 0 0 0 5.2 5.2l1.5-2.2 5 2 .5 2.5c.2 1.1-.7 2.1-1.8 2.2C10.2 19.8 4.2 13.8 3.3 5.8 3.2 4.7 4.4 3.7 6.5 3.5Z"/></>,
    arrow: <><path d="M4 12h15"/><path d="m13 6 6 6-6 6"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v10h14V10M9 20v-6h6v6"/></>
  };

  return <svg {...common}>{paths[name]}</svg>;
}
