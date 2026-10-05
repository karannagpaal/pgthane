import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer>
      <Link className="footer-brand" href="/" aria-label="PGThane.com home">
        <img src="/pgthane-exact-logo-4k.svg" alt="PGThane.com" className="footer-full-logo" width={280} height={93} />
      </Link>
      <p>PG · Paying Guest · Hostel · Shared Rooms in Thane</p>
      <small>© {new Date().getFullYear()} PG Thane</small>
    </footer>
  );
}
