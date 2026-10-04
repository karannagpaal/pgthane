import type { Metadata } from "next";
import { Suspense } from "react";
import LocationControls from "@/components/LocationControls";

const locations: Record<string, string> = {
  "pg-in-wagle-estate-thane": "Wagle Estate",
  "pg-in-majiwada-thane": "Majiwada",
  "pg-in-kolshet-thane": "Kolshet",
  "pg-in-hiranandani-estate-thane": "Hiranandani Estate",
  "pg-in-thane-station-thane": "Thane Station",
  "pg-in-panchpakhadi-thane": "Panchpakhadi",
  "pg-in-louiswadi-thane": "Louiswadi",
  "pg-in-teen-hath-naka-thane": "Teen Hath Naka",
  "pg-in-naupada-thane": "Naupada",
  "pg-in-khopat-thane": "Khopat",
  "pg-in-castle-mill-thane": "Castle Mill",
  "pg-in-kapurbawdi-thane": "Kapurbawdi",
  "pg-in-manpada-thane": "Manpada",
  "pg-in-bhramand-thane": "Bhramand",
  "pg-in-kasarvadavali-thane": "Kasarvadavali",
  "pg-in-vartak-nagar-thane": "Vartak Nagar",
  "pg-in-lokmanya-nagar-thane": "Lokmanya Nagar"
};

export async function generateStaticParams() {
  return Object.keys(locations).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = locations[slug] || "Thane";
  return {
    title: "PG in " + name + ", Thane | Paying Guest & Hostel",
    description: "Explore PG, Paying Guest, Hostel and shared-room accommodation options in " + name + ", Thane.",
    alternates: { canonical: "https://www.pgthane.com/discover-pg-in-thane/" + slug }
  };
}

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = locations[slug] || "Thane";

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="/">PG<span>Thane</span></a>
        <nav><a href="/#locations">Locations</a><a href="/#how-it-works">How it works</a><a href="/#contact">Contact</a></nav>
        <a className="header-cta" href="tel:9892336705">Call</a>
      </header>

      <section className="location-hero">
        <div className="location-hero-inner">
          <div className="breadcrumb"><a href="/">Home</a><span>/</span><span>Thane</span><span>/</span><strong>{name}</strong></div>
          <div className="eyebrow">PG ACCOMMODATION IN THANE</div>
          <h1>PG in {name}, Thane</h1>
          <p>Paying Guest · Hostel · Shared Rooms</p>
          <div className="location-actions"><a className="header-cta" href="tel:9892336705">Call 9892336705</a><a className="outline-cta" href="https://wa.me/919892336705">WhatsApp</a></div>
        </div>
      </section>

      <section className="location-main">
        <div className="location-content">
          <div className="section-heading compact"><div><div className="eyebrow">FIND YOUR STAY</div><h2>PG options in {name}</h2></div><p>Filter by the things that matter before comparing available properties.</p></div>
          <Suspense fallback={<div className="filter-panel">Loading filters…</div>}><LocationControls /></Suspense>
          <div className="empty-listings">
            <div className="empty-icon">⌂</div>
            <h3>Verified PG listings are being added</h3>
            <p>We will only publish real property information, including actual names, photos, pricing, availability and amenities. No placeholder PGs are shown here.</p>
            <a className="header-cta" href="tel:9892336705">Ask for available PGs</a>
          </div>
        </div>
        <aside className="location-aside">
          <div className="aside-card"><div className="eyebrow">SEARCH BY WORKPLACE</div><h3>Looking for a PG near your office?</h3><p>Search the directory by workplace or corporate location once verified workplace data is connected.</p><a href="/#search">Search workplace</a></div>
          <div className="aside-card"><div className="eyebrow">NEED HELP?</div><h3>Tell us where you work</h3><p>Call the PG Thane enquiry number for current availability.</p><a href="tel:9892336705">9892336705</a></div>
        </aside>
      </section>

      <footer><div className="brand">PG<span>Thane</span></div><p>PG · Paying Guest · Hostel · Shared Rooms in Thane</p><small>© {new Date().getFullYear()} PG Thane</small></footer>
    </main>
  );
}