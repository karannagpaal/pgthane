import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LocationControls from "@/components/LocationControls";
import ListingCard from "@/components/ListingCard";
import { listings, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";

const locations: Record<string, string> = {
  "pg-in-wagle-estate-thane": "Wagle Estate","pg-in-majiwada-thane": "Majiwada","pg-in-kolshet-thane": "Kolshet",
  "pg-in-hiranandani-estate-thane": "Hiranandani Estate",
  "pg-in-panchpakhadi-thane": "Panchpakhadi","pg-in-louiswadi-thane": "Louiswadi","pg-in-teen-hath-naka-thane": "Teen Hath Naka",
  "pg-in-naupada-thane": "Naupada","pg-in-khopat-thane": "Khopat","pg-in-castle-mill-thane": "Castle Mill",
  "pg-in-kapurbawdi-thane": "Kapurbawdi","pg-in-manpada-thane": "Manpada","pg-in-bhramand-thane": "Bhramand",
  "pg-in-kasarvadavali-thane": "Kasarvadavali","pg-in-vartak-nagar-thane": "Vartak Nagar","pg-in-lokmanya-nagar-thane": "Lokmanya Nagar",
  "pg-near-railway-station-thane": "Thane Station","pg-in-vasant-vihar-thane": "Vasant Vihar","pg-in-pokhran-road-thane": "Pokhran Road"
};

export async function generateStaticParams() { return Object.keys(locations).map(slug => ({ slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = locations[slug];
  if (!name) return {};
  return {
    title: "PG in " + name + ", Thane | Paying Guest & Hostel",
    description: "Explore PG, Paying Guest, Hostel and shared-room accommodation options in " + name + ", Thane.",
    alternates: { canonical: "https://www.pgthane.com/discover-pg-in-thane/" + slug }
  };
}

export default async function LocationPage({ params, searchParams }: { params: Promise<{ slug: string }>; searchParams: Promise<Record<string, string | undefined>> }) {
  const { slug } = await params;
  const name = locations[slug];
  if (!name) notFound();
  const filters = await searchParams;
  const nearbyMicros = verifiedMicrolocationIndex.filter(x => x.location === name || x.name === name);
  const nearbyWorkplaces = verifiedWorkplaceIndex.filter(x => x.location === name);
  const matchingListings = listings.filter(x => x.published === true && !x.photoOnly && (() => {
    if (x.location.toLowerCase() !== name.toLowerCase()) return false;
    if (filters.gender && x.gender !== filters.gender) return false;
    if (filters.food && (!x.food || (x.food !== "Both" && x.food !== filters.food))) return false;
    if (filters.room && (!x.roomType || (x.roomType !== "Both" && x.roomType !== filters.room))) return false;
    if (filters.amenity && (!x.amenities || !x.amenities.some(a => a.toLowerCase().includes(filters.amenity!.toLowerCase())))) return false;
    if (filters.sharing && (!x.sharing || !x.sharing.includes(filters.sharing))) return false;
    if (filters.budget && !x.priceFrom) return false;
    if (filters.budget && x.priceFrom) {
      if (filters.budget === "Under ₹10,000" && x.priceFrom >= 10000) return false;
      if (filters.budget === "₹10,000 – ₹15,000" && (x.priceFrom < 10000 || x.priceFrom > 15000)) return false;
      if (filters.budget === "₹15,000 – ₹20,000" && (x.priceFrom < 15000 || x.priceFrom > 20000)) return false;
      if (filters.budget === "₹20,000+" && x.priceFrom < 20000) return false;
    }
    return true;
  })());

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "PG Thane", item: "https://www.pgthane.com/" },
      { "@type": "ListItem", position: 2, name: "PG in Thane", item: "https://www.pgthane.com/discover-pg-in-thane" },
      { "@type": "ListItem", position: 3, name: "PG in " + name + ", Thane", item: "https://www.pgthane.com/discover-pg-in-thane/" + slug }
    ]
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <header className="topbar"><Link className="brand" href="/">PG<span>Thane</span></Link><nav><Link href="/#locations">Locations</Link><Link href="/#how-it-works">How it works</Link><Link href="/#contact">Contact</Link></nav><a className="header-cta" href="tel:9892336705">Call</a></header>
    <section className="location-hero"><div className="location-hero-inner">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Thane</span><span>/</span><strong>{name}</strong></div>
      <div className="eyebrow">PG ACCOMMODATION IN THANE</div><h1>PG in {name}, Thane</h1><p>Paying Guest · Hostel · Shared Rooms</p>
      <div className="location-actions"><a className="header-cta" href="tel:9892336705">Call 9892336705</a><a className="outline-cta" href="https://wa.me/919892336705">WhatsApp</a></div>
    </div></section>

    <section className="location-main"><div className="location-content">
      <div className="section-heading compact"><div><div className="eyebrow">FIND YOUR STAY</div><h2>PG options in {name}</h2></div><p>Filter by budget, gender, sharing, food, room type and amenities.</p></div>
      <div id="filters"><Suspense fallback={<div className="filter-panel">Loading filters…</div>}><LocationControls /></Suspense></div>
      {nearbyMicros.length > 0 && <section className="directory-panel"><div className="eyebrow">MICROLOCATIONS</div><h3>Explore around {name}</h3><div className="chip-row">{nearbyMicros.map(x => <Link key={x.name} href={"/search?q=" + encodeURIComponent(x.name) + "&type=Microlocation"} className="directory-chip">📍 {x.name}</Link>)}</div></section>}
      {nearbyWorkplaces.length > 0 && <section className="directory-panel"><div className="eyebrow">NEARBY WORKPLACES</div><h3>Workplaces around {name}</h3><div className="workplace-list">{nearbyWorkplaces.map(x => <Link key={x.name} href={"/search?q=" + encodeURIComponent(x.name) + "&type=Workplace"} className="workplace-item"><span>🏢</span><div><strong>{x.name}</strong><small>{x.kind}</small></div><span>→</span></Link>)}</div></section>}
      <div id="results">{matchingListings.length > 0 ? <div className="listing-grid">{matchingListings.map(x => <ListingCard key={x.id} listing={x} />)}</div> : <div className="empty-listings"><div className="empty-icon">⌂</div><h3>Verified PG listings are being added</h3><p>No placeholder properties are shown. Real names, photos, pricing, availability and amenities will appear here only after verification.</p><a className="header-cta" href="tel:9892336705">Ask for available PGs</a></div>}</div>
      <div className="mobile-bottom-bar"><a href="#filters">Filters</a><a href="#results">Results</a><a href="tel:9892336705">Enquire Now</a></div>
      </div><aside className="location-aside"><div className="aside-card"><div className="eyebrow">SEARCH BY WORKPLACE</div><h3>Looking for a PG near your office?</h3><p>Search the directory by workplace or corporate location.</p><Link href="/search?type=Workplace">Search workplaces</Link></div><div className="aside-card"><div className="eyebrow">NEED HELP?</div><h3>Tell us where you work</h3><p>Call the PG Thane enquiry number for current availability.</p><a href="tel:9892336705">9892336705</a></div></aside></section>
    <footer><div className="brand">PG<span>Thane</span></div><p>PG · Paying Guest · Hostel · Shared Rooms in Thane</p><small>© {new Date().getFullYear()} PG Thane</small></footer>
  </main>;
}
