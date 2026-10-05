import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LocationControls from "@/components/LocationControls";
import ListingResults from "@/components/LocationResults";
import { listings, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";
import SiteIcon from "@/components/SiteIcon";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = locations[slug];
  if (!name) notFound();
  const nearbyMicros = verifiedMicrolocationIndex.filter(x => x.location === name || x.name === name);
  const nearbyWorkplaces = verifiedWorkplaceIndex.filter(x => x.location === name);
  const publishedListings = listings.filter(x => x.published === true && !x.photoOnly && x.location.toLowerCase() === name.toLowerCase());
  const publishedCount = publishedListings.length;

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
    <SiteHeader />{ Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LocationControls from "@/components/LocationControls";
import ListingResults from "@/components/LocationResults";
import { listings, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";
import SiteIcon from "@/components/SiteIcon";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = locations[slug];
  if (!name) notFound();
  const nearbyMicros = verifiedMicrolocationIndex.filter(x => x.location === name || x.name === name);
  const nearbyWorkplaces = verifiedWorkplaceIndex.filter(x => x.location === name);
  const publishedListings = listings.filter(x => x.published === true && !x.photoOnly && x.location.toLowerCase() === name.toLowerCase());
  const publishedCount = publishedListings.length;

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
    <header className="topbar"><Link className="brand" href="/" aria-label="PGThane.com home"><img src="/logo.svg" alt="PGThane.com" className="brand-logo" width={240} height={60} /></Link><nav><Link href="/#locations">Locations</Link><Link href="/#how-it-works">How it works</Link><Link href="/#contact">Contact</Link></nav><a className="header-cta" href="tel:9930007113">Call</a></header>
    <section className="location-hero"><div className="location-hero-inner">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Thane</span><span>/</span><strong>{name}</strong></div>
      <div className="eyebrow">PG ACCOMMODATION IN THANE</div><h1>PG in {name}, Thane</h1><p>Paying Guest · Hostel · Shared Rooms</p>
      <div className="location-actions"><a className="header-cta" href="tel:9930007113">Call 9930007113</a><a className="outline-cta" href="https://wa.me/919930007113">WhatsApp</a></div>
    </div></section>

    <section className="location-main"><div className="location-content">
      <div className="section-heading compact"><div><div className="eyebrow">FIND YOUR STAY</div><h2>PG options in {name}</h2></div><p>{publishedCount > 0 ? publishedCount + " verified PG options available" : "Verified PG options are being added"}. Filter by budget, gender, sharing, food, room type and amenities.</p></div>
      <div id="filters"><Suspense fallback={<div className="filter-panel">Loading filters…</div>}><LocationControls /></Suspense></div>
      {nearbyMicros.length > 0 && <section className="directory-panel"><div className="eyebrow">MICROLOCATIONS</div><h3>Explore around {name}</h3><div className="chip-row">{nearbyMicros.map(x => <Link key={x.name} href={"/search?q=" + encodeURIComponent(x.name) + "&type=Microlocation"} className="directory-chip"><SiteIcon name="pin" size={15} /> {x.name}</Link>)}</div></section>}
      {nearbyWorkplaces.length > 0 && <section className="directory-panel"><div className="eyebrow">NEARBY WORKPLACES</div><h3>Workplaces around {name}</h3><div className="workplace-list">{nearbyWorkplaces.map(x => <Link key={x.name} href={"/search?q=" + encodeURIComponent(x.name) + "&type=Workplace"} className="workplace-item"><span><SiteIcon name="building" size={18} /></span><div><strong>{x.name}</strong><small>{x.kind}</small></div><span><SiteIcon name="arrow" size={16} /></span></Link>)}</div></section>}
      <div id="results"><Suspense fallback={<div className="listing-grid" aria-busy="true">Loading verified PGs…</div>}><ListingResults listings={publishedListings} /></Suspense></div>
      <div className="mobile-bottom-bar"><a href="#filters">Filters</a><a href="#results">Results</a><a href="tel:9930007113">Enquire Now</a></div>
      </div><aside className="location-aside"><div className="aside-card"><div className="eyebrow">SEARCH BY WORKPLACE</div><h3>Looking for a PG near your office?</h3><p>Search the directory by workplace or corporate location.</p><Link href="/search?type=Workplace">Search workplaces</Link></div><div className="aside-card"><div className="eyebrow">NEED HELP?</div><h3>Tell us where you work</h3><p>Call the PG Thane enquiry number for current availability.</p><a href="tel:9930007113">9930007113</a></div></aside></section>
    <SiteFooter /> Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LocationControls from "@/components/LocationControls";
import ListingResults from "@/components/LocationResults";
import { listings, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";
import SiteIcon from "@/components/SiteIcon";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = locations[slug];
  if (!name) notFound();
  const nearbyMicros = verifiedMicrolocationIndex.filter(x => x.location === name || x.name === name);
  const nearbyWorkplaces = verifiedWorkplaceIndex.filter(x => x.location === name);
  const publishedListings = listings.filter(x => x.published === true && !x.photoOnly && x.location.toLowerCase() === name.toLowerCase());
  const publishedCount = publishedListings.length;

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
    <SiteHeader />{ Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LocationControls from "@/components/LocationControls";
import ListingResults from "@/components/LocationResults";
import { listings, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";
import SiteIcon from "@/components/SiteIcon";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

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

export default async function LocationPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const name = locations[slug];
  if (!name) notFound();
  const nearbyMicros = verifiedMicrolocationIndex.filter(x => x.location === name || x.name === name);
  const nearbyWorkplaces = verifiedWorkplaceIndex.filter(x => x.location === name);
  const publishedListings = listings.filter(x => x.published === true && !x.photoOnly && x.location.toLowerCase() === name.toLowerCase());
  const publishedCount = publishedListings.length;

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
    <header className="topbar"><Link className="brand" href="/" aria-label="PGThane.com home"><img src="/logo.svg" alt="PGThane.com" className="brand-logo" width={240} height={60} /></Link><nav><Link href="/#locations">Locations</Link><Link href="/#how-it-works">How it works</Link><Link href="/#contact">Contact</Link></nav><a className="header-cta" href="tel:9930007113">Call</a></header>
    <section className="location-hero"><div className="location-hero-inner">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><span>Thane</span><span>/</span><strong>{name}</strong></div>
      <div className="eyebrow">PG ACCOMMODATION IN THANE</div><h1>PG in {name}, Thane</h1><p>Paying Guest · Hostel · Shared Rooms</p>
      <div className="location-actions"><a className="header-cta" href="tel:9930007113">Call 9930007113</a><a className="outline-cta" href="https://wa.me/919930007113">WhatsApp</a></div>
    </div></section>

    <section className="location-main"><div className="location-content">
      <div className="section-heading compact"><div><div className="eyebrow">FIND YOUR STAY</div><h2>PG options in {name}</h2></div><p>{publishedCount > 0 ? publishedCount + " verified PG options available" : "Verified PG options are being added"}. Filter by budget, gender, sharing, food, room type and amenities.</p></div>
      <div id="filters"><Suspense fallback={<div className="filter-panel">Loading filters…</div>}><LocationControls /></Suspense></div>
      {nearbyMicros.length > 0 && <section className="directory-panel"><div className="eyebrow">MICROLOCATIONS</div><h3>Explore around {name}</h3><div className="chip-row">{nearbyMicros.map(x => <Link key={x.name} href={"/search?q=" + encodeURIComponent(x.name) + "&type=Microlocation"} className="directory-chip"><SiteIcon name="pin" size={15} /> {x.name}</Link>)}</div></section>}
      {nearbyWorkplaces.length > 0 && <section className="directory-panel"><div className="eyebrow">NEARBY WORKPLACES</div><h3>Workplaces around {name}</h3><div className="workplace-list">{nearbyWorkplaces.map(x => <Link key={x.name} href={"/search?q=" + encodeURIComponent(x.name) + "&type=Workplace"} className="workplace-item"><span><SiteIcon name="building" size={18} /></span><div><strong>{x.name}</strong><small>{x.kind}</small></div><span><SiteIcon name="arrow" size={16} /></span></Link>)}</div></section>}
      <div id="results"><Suspense fallback={<div className="listing-grid" aria-busy="true">Loading verified PGs…</div>}><ListingResults listings={publishedListings} /></Suspense></div>
      <div className="mobile-bottom-bar"><a href="#filters">Filters</a><a href="#results">Results</a><a href="tel:9930007113">Enquire Now</a></div>
      </div><aside className="location-aside"><div className="aside-card"><div className="eyebrow">SEARCH BY WORKPLACE</div><h3>Looking for a PG near your office?</h3><p>Search the directory by workplace or corporate location.</p><Link href="/search?type=Workplace">Search workplaces</Link></div><div className="aside-card"><div className="eyebrow">NEED HELP?</div><h3>Tell us where you work</h3><p>Call the PG Thane enquiry number for current availability.</p><a href="tel:9930007113">9930007113</a></div></aside></section>
    <footer><div className="brand">PG<span>Thane</span></div><p>PG · Paying Guest · Hostel · Shared Rooms in Thane</p><small>© {new Date().getFullYear()} PG Thane</small></footer>
  </main>;
}
