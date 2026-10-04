import type { Metadata } from "next";
import Link from "next/link";
import { listings, locationIndex, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";

const types = ["All", "Location", "Microlocation", "Workplace", "Keyword"];

function locationHref(value: string) {
  if (value === "Thane Station") return "/discover-pg-in-thane/pg-near-railway-station-thane";
  return "/discover-pg-in-thane/pg-in-" + value.toLowerCase().replaceAll(" ", "-") + "-thane";
}



export const metadata: Metadata = { title: "Search PGs in Thane | PG Thane", description: "Search PG, Paying Guest, Hostel and shared-room options in Thane by location, microlocation and workplace.", robots: { index: false, follow: true } };

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; budget?: string; gender?: string; sharing?: string; food?: string; room?: string; amenity?: string }> }) {
  const params = await searchParams;
  const rawQuery = (params.q || "").trim();
  const q = rawQuery.toLowerCase();
  const type = types.includes(params.type || "") ? (params.type || "All") : "All";
  const allowed = {
    budget: new Set(["Any budget", "Under ₹10,000", "₹10,000 – ₹15,000", "₹15,000 – ₹20,000", "₹20,000+"]),
    gender: new Set(["Any", "Male", "Female", "Unisex"]),
    sharing: new Set(["Any", "Single", "Double sharing", "Triple sharing", "4 Sharing+"]),
    food: new Set(["Any", "With food", "Without food"]),
    room: new Set(["Any", "Private room", "Shared room"]),
    amenity: new Set(["Any", "Wi-Fi", "Fully Furnished", "Housekeeping", "Washing Machine", "Parking"])
  };
  const budget = allowed.budget.has(params.budget || "") ? params.budget! : "Any budget";
  const gender = allowed.gender.has(params.gender || "") ? params.gender! : "Any";
  const sharing = allowed.sharing.has(params.sharing || "") ? params.sharing! : "Any";
  const food = allowed.food.has(params.food || "") ? params.food! : "Any";
  const room = allowed.room.has(params.room || "") ? params.room! : "Any";
  const amenity = allowed.amenity.has(params.amenity || "") ? params.amenity! : "Any";

  const locations = locationIndex.filter(x => !q || x.toLowerCase().includes(q));
  const micros = verifiedMicrolocationIndex.filter(x => !q || (x.name + " " + x.location).toLowerCase().includes(q));
  const workplaces = verifiedWorkplaceIndex.filter(x => !q || (x.name + " " + x.location + " " + x.kind).toLowerCase().includes(q));
  const filterQuery = new URLSearchParams();
  if (budget !== "Any budget") filterQuery.set("budget", budget);
  if (gender !== "Any") filterQuery.set("gender", gender);
  if (sharing !== "Any") filterQuery.set("sharing", sharing);
  if (food !== "Any") filterQuery.set("food", food);
  if (room !== "Any") filterQuery.set("room", room);
  if (amenity !== "Any") filterQuery.set("amenity", amenity);
  const withCurrentFilters = (href: string) => {
    const suffix = filterQuery.toString();
    return suffix ? href + (href.includes("?") ? "&" : "?") + suffix : href;
  };
  const keywordMatches = [
    ...locations.map(x => ({ label: x, meta: "Location", href: withCurrentFilters(locationHref(x)) })),
    ...micros.map(x => ({ label: x.name, meta: "Microlocation · " + x.location, href: withCurrentFilters("/search?q=" + encodeURIComponent(x.name) + "&type=Microlocation") })),
    ...workplaces.map(x => ({ label: x.name, meta: x.kind + " · " + x.location, href: withCurrentFilters("/search?q=" + encodeURIComponent(x.name) + "&type=Workplace") }))
  ];
  const directoryLocations = type === "All" || type === "Location" ? locations : [];
  const directoryMicros = type === "All" || type === "Microlocation" ? micros : [];
  const directoryWorkplaces = type === "All" || type === "Workplace" ? workplaces : [];
  const matchingListings = listings.filter(x => x.published === true && !x.photoOnly && (() => {
    const text = [x.name, x.type, x.location, x.microlocation, ...x.workplace, ...(x.amenities || [])].join(" ").toLowerCase();
    if (q) {
      if (type === "Location" && ![x.location, x.microlocation].join(" ").toLowerCase().includes(q)) return false;
      if (type === "Microlocation" && !x.microlocation.toLowerCase().includes(q)) return false;
      if (type === "Workplace" && !x.workplace.some(value => value.toLowerCase().includes(q))) return false;
      if (type === "Keyword" && !text.includes(q)) return false;
      if (type === "All" && !text.includes(q)) return false;
    }
    if (gender !== "Any" && x.gender !== gender) return false;
    if (food !== "Any" && (!x.food || (x.food !== "Both" && x.food !== food))) return false;
    if (room !== "Any" && (!x.roomType || (x.roomType !== "Both" && x.roomType !== room))) return false;
    if (amenity !== "Any" && (!x.amenities || !x.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase())))) return false;
    if (sharing !== "Any") {
      const wanted = sharing.toLowerCase().replace(" sharing", "");
      if (!x.sharing || !x.sharing.some(value => value.toLowerCase().replace(" sharing", "") === wanted)) return false;
    }
    if (budget !== "Any budget") {
      if (x.priceFrom === undefined) return false;
      if (budget === "Under ₹10,000" && x.priceFrom >= 10000) return false;
      if (budget === "₹10,000 – ₹15,000" && (x.priceFrom < 10000 || x.priceFrom > 15000)) return false;
      if (budget === "₹15,000 – ₹20,000" && (x.priceFrom < 15000 || x.priceFrom > 20000)) return false;
      if (budget === "₹20,000+" && x.priceFrom < 20000) return false;
    }
    return true;
  })());

  // A typed search should surface the matching verified listings as well as the
  // directory entity that matched. With no query, category browsing stays entity-only.
  const showListingResults = matchingListings.length > 0 && (type === "All" || Boolean(q) || budget !== "Any budget" || gender !== "Any" || sharing !== "Any" || food !== "Any" || room !== "Any" || amenity !== "Any");
  const resultCount =
    directoryLocations.length + directoryMicros.length + directoryWorkplaces.length +
    (type === "Keyword" ? keywordMatches.length : 0) +
    (showListingResults ? matchingListings.length : 0);
  const hasResults = resultCount > 0;

  return (
    <main>
      <header className="topbar"><Link className="brand" href="/">PG<span>Thane</span></Link><nav><Link href="/#locations">Locations</Link><Link href="/#how-it-works">How it works</Link></nav><a className="header-cta" href="tel:9892336705">Call</a></header>
      <section className="section search-page">
        <div className="eyebrow">DIRECTORY SEARCH</div>
        <h1>Search PGs in Thane</h1>

        <form className="search-page-form" role="search" aria-label="Search PGs in Thane">
          <input name="q" defaultValue={rawQuery} placeholder="Location, microlocation, workplace or keyword" autoComplete="off" />
          <select name="type" defaultValue={type} aria-label="Search category">{types.map(x => <option key={x}>{x}</option>)}</select>
          <select name="budget" defaultValue={budget} aria-label="Budget"><option>Any budget</option><option>Under ₹10,000</option><option>₹10,000 – ₹15,000</option><option>₹15,000 – ₹20,000</option><option>₹20,000+</option></select>
          <select name="gender" defaultValue={gender} aria-label="Gender"><option>Any</option><option>Male</option><option>Female</option><option>Unisex</option></select>
          <select name="sharing" defaultValue={sharing} aria-label="Sharing"><option>Any</option><option>Single</option><option>Double sharing</option><option>Triple sharing</option><option>4 Sharing+</option></select>
          <select name="food" defaultValue={food} aria-label="Food"><option>Any</option><option>With food</option><option>Without food</option></select>
          <select name="room" defaultValue={room} aria-label="Room type"><option>Any</option><option>Private room</option><option>Shared room</option></select>
          <select name="amenity" defaultValue={amenity} aria-label="Amenity"><option>Any</option><option>Wi-Fi</option><option>Fully Furnished</option><option>Housekeeping</option><option>Washing Machine</option><option>Parking</option></select>
          <button className="search-button" type="submit">Search</button>
        </form>

        <div className="search-toolbar">
          <span>{rawQuery ? <>Results for <strong>“{rawQuery}”</strong></> : <>Browse verified search categories</>} {hasResults && <span className="search-count"> · {resultCount} results</span>}</span>
          {(rawQuery || type !== "All" || budget !== "Any budget" || gender !== "Any" || sharing !== "Any" || food !== "Any" || room !== "Any" || amenity !== "Any") && <Link className="clear-search" href="/search">Clear all</Link>}
        </div>

        {!hasResults && <div className="search-empty">No verified results match this search yet. Try a broader location, workplace or keyword. Real PG listings will appear here only after their information is verified.</div>}

        <div className="search-groups">
          {directoryLocations.length > 0 && <section><h2>Locations</h2>{locations.map(x => <Link key={x} className="search-result" href={withCurrentFilters(locationHref(x))}><span>📍 {x}</span><small>PG · Paying Guest · Hostel</small></Link>)}</section>}
          {directoryMicros.length > 0 && <section><h2>Microlocations</h2>{micros.map(x => <Link key={x.name} className="search-result" href={withCurrentFilters("/search?q=" + encodeURIComponent(x.name) + "&type=Microlocation")}><span>📍 {x.name}</span><small>{x.location}</small></Link>)}</section>}
          {directoryWorkplaces.length > 0 && <section><h2>Workplaces</h2>{workplaces.map(x => <Link key={x.name} className="search-result" href={withCurrentFilters("/search?q=" + encodeURIComponent(x.name) + "&type=Workplace")}><span>🏢 {x.name}</span><small>{x.kind} · {x.location}</small></Link>)}</section>}
          {type === "Keyword" && keywordMatches.length > 0 && <section><h2>Keyword matches</h2>{keywordMatches.map(x => <Link key={x.label + x.meta} className="search-result" href={x.href}><span>{x.label}</span><small>{x.meta}</small></Link>)}</section>}
          {showListingResults && <section><h2>Real PG listings</h2>{matchingListings.map(x => <Link key={x.id} className="search-result" href={"/listing/" + x.slug}><span>{x.name}</span><small>{x.type} · {x.location}</small></Link>)}</section>}
        </div>
      </section>
    </main>
  );
}