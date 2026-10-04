import Link from "next/link";

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
  ["Lokmanya Nagar","pg-in-lokmanya-nagar-thane"],
  ["Kolshet","pg-in-kolshet-thane"],
  ["Vasant Vihar","pg-in-vasant-vihar-thane"],
  ["Pokhran Road","pg-in-pokhran-road-thane"]
];

export const metadata = {
  title: "PG in Thane | Paying Guest, Hostel & Shared Rooms",
  description: "Browse PG, Paying Guest, Hostel and shared-room accommodation locations across Thane."
};

export default function DirectoryPage() {
  return <main>
    <header className="topbar"><Link className="brand" href="/">PG<span>Thane</span></Link><nav><Link href="/">Home</Link><Link href="/search">Search</Link></nav><a className="header-cta" href="tel:9892336705">Call</a></header>
    <section className="section directory-landing">
      <div className="eyebrow">THANE PG DIRECTORY</div>
      <h1>PG in Thane</h1>
      <p className="hero-copy">Browse PG, Paying Guest, Hostel and shared-room locations across Thane. Property-level listings are shown only when their information is verified.</p>
      <div className="location-grid">{locations.map(([name, slug]) => <Link className="location-card" key={slug} href={"/discover-pg-in-thane/" + slug}><h2>{name}</h2><p>PG · Paying Guest · Hostel</p></Link>)}</div>
    </section>
  </main>;
}
