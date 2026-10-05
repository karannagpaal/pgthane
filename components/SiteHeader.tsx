import Link from "next/link";

type SiteHeaderProps = {
  ctaLabel?: string;
  ctaHref?: string;
};

export default function SiteHeader({ ctaLabel = "Call", ctaHref = "tel:9930007113" }: SiteHeaderProps) {
  return (
    <header className="topbar">
      <Link className="brand" href="/" aria-label="PGThane.com home">
        <img src="/pgthane-logo-transparent.svg" alt="PGThane.com" className="brand-logo" width={260} height={86} />
      </Link>
      <nav aria-label="Primary navigation">
        <Link href="/discover-pg-in-thane">Locations</Link>
        <Link href="/search">Search</Link>
        <Link href="/#how-it-works">How it works</Link>
        <Link href="/#contact">Contact</Link>
      </nav>
      <a className="header-cta" href={ctaHref}>{ctaLabel}</a>
    </header>
  );
}
