import Link from "next/link";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const locations = [
  ["Thane Station","pg-near-railway-station-thane"],
  ["Wagle Estate","pg-in-wagle-estate-thane"],
  ["Panchpakhadi","pg-in-panchpakhadi-thane"],
  ["Louiswadi","pg-in-louiswadi-thane"],
  ["Teen Hath Naka","pg-in-teen-hath-naka-thane"],
  ["Naupada","pg-in-naupada-thane"],
  ["Khopat","pg-in-khopat-thane"],
  ["Majiwada","pg-in-majiwada-thane"],
  ["Castle Mill","pg-in-castle-mill-thane"],
  ["Kapurbawdi","pg-in-kapurbawdi-thane"],
  ["Manpada","pg-in-manpada-thane"],
  ["Bhramand","pg-in-bhramand-thane"],
  ["Kasarvadavali","pg-in-kasarvadavali-thane"],
  ["Hiranandani Estate","pg-in-hiranandani-estate-thane"],
  ["Vartak Nagar","pg-in-vartak-nagar-thane"],
  ["Balkum","pg-in-balkum-thane"],
  ["Ghodbunder Road","pg-in-ghodbunder-road-thane"],
  ["Lokmanya Nagar","pg-in-lokmanya-nagar-thane"],
  ["Kolshet","pg-in-kolshet-thane"],
  ["Vasant Vihar","pg-in-vasant-vihar-thane"],
  ["Pokhran Road","pg-in-pokhran-road-thane"]
];

export const metadata = {
  title: "PG in Thane | Paying Guest, Hostel & Shared Rooms",
  description: "Browse PG, Paying Guest, Hostel and shared-room accommodation locations across Thane.",
  alternates: { canonical: "https://www.pgthane.com/discover-pg-in-thane/" }
};

function LocationBuildingIcon() {
  return (
    <span className="directory-location-icon" aria-hidden="true">
      <svg viewBox="0 0 32 32" focusable="false">
        <path d="M5 28V9.5A2.5 2.5 0 0 1 7.5 7H17v21M17 13h7.5a2.5 2.5 0 0 1 2.5 2.5V28M2.5 28h27" />
        <path d="M10 11h3M10 15h3M10 19h3M10 23h3M20 17h3M20 21h3M20 25h3" />
      </svg>
    </span>
  );
}

export default function DirectoryPage() {
  return (
    <main>
      <SiteHeader />
      <section className="section directory-landing">
        <div className="eyebrow">THANE PG DIRECTORY</div>
        <h1>PG in Thane</h1>
        <div className="directory-actions"><Link className="header-cta" href="/search">Search PGs</Link></div>
        <p className="hero-copy">Browse PG, Paying Guest, Hostel and shared-room locations across Thane. Property-level listings are shown only when their information is verified.</p>
        <div className="location-grid directory-location-grid">
          {locations.map(([name, slug]) => (
            <Link className="location-card directory-location-card" key={slug} href={"/discover-pg-in-thane/" + slug}>
              <LocationBuildingIcon />
              <span className="directory-location-copy">
                <span className="directory-location-name">{name}</span>
                <span className="directory-location-category">PG · Paying Guest · Hostel</span>
              </span>
              <span className="directory-location-arrow" aria-hidden="true">›</span>
            </Link>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
