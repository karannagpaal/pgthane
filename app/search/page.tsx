import Link from "next/link";
import { listings, locationIndex, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";

const types = ["All", "Location", "Microlocation", "Workplace", "Keyword"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string; budget?: string }> }) {
  const params = await searchParams;
  const rawQuery = (params.q || "").trim();
  const q = rawQuery.toLowerCase();
  const type = types.includes(params.type || "") ? (params.type || "All") : "All";
  const budget = params.budget || "Any budget";

  const locations = locationIndex.filter(x => !q || x.toLowerCase().includes(q));
  const micros = verifiedMicrolocationIndex.filter(x => !q || (x.name + " " + x.location).toLowerCase().includes(q));
  const workplaces = verifiedWorkplaceIndex.filter(x => !q || (x.name + " " + x.location + " " + x.kind).toLowerCase().includes(q));
  const keywordMatches = [
    ...locations.map(x => ({ label: x, meta: "Location", href: "/discover-pg-in-thane/pg-in-" + x.toLowerCase().replaceAll(" ", "-") + "-thane" })),
    ...micros.map(x => ({ label: x.name, meta: "Microlocation · " + x.location, href: "/search?q=" + encodeURIComponent(x.name) + "&type=Microlocation" })),
    ...workplaces.map(x => ({ label: x.name, meta: x.kind + " · " + x.location, href: "/search?q=" + encodeURIComponent(x.name) + "&type=Workplace" }))
  ];
  const matchingListings = listings.filter(x => x.published === true && !x.photoOnly && (() => {
    const text = [x.name, x.type, x.location, x.microlocation, ...x.workplace, ...(x.amenities || [])].join(" ").toLowerCase();
    if (q && !text.includes(q)) return false;
    if (budget !== "Any budget" && x.priceFrom) {
      if (budget === "Under ₹10,000" && x.priceFrom >= 10000) return false;
      if (budget === "₹10,000 – ₹15,000" && (x.priceFrom < 10000 || x.priceFrom > 15000)) return false;
      if (budget === "₹15,000 – ₹20,000" && (x.priceFrom < 15000 || x.priceFrom > 20000)) return false;
      if (budget === "₹20,000+" && x.priceFrom < 20000) return false;
    }
    return true;
  })());

  const resultCount = type === "All" ? locations.length + micros.length + workplaces.length + matchingListings.length : type === "Location" ? locations.length : type === "Microlocation" ? micros.length : type === "Workplace" ? workplaces.length : keywordMatches.length + matchingListings.length;
  const hasResults = resultCount > 0;

  return (
    <main>
      <header className="topbar"><Link className="brand" href="/">PG<span>Thane</span></Link><nav><Link href="/#locations">Locations</Link><Link href="/#how-it-works">How it works</Link></nav><a className="header-cta" href="tel:9892336705">Call</a></header>
      <section className="section search-page">
        <div className="eyebrow">DIRECTORY SEARCH</div>
        <h1>Search PGs in Thane</h1>

        <form className="search-page-form">
          <input name="q" defaultValue={rawQuery} placeholder="Location, microlocation, workplace or keyword" autoComplete="off" />
          <select name="type" defaultValue={type} aria-label="Search category">{types.map(x => <option key={x}>{x}</option>)}</select>
          <select name="budget" defaultValue={budget} aria-label="Budget"><option>Any budget</option><option>Under ₹10,000</option><option>₹10,000 – ₹15,000</option><option>₹15,000 – ₹20,000</option><option>₹20,000+</option></select>
          <button className="search-button" type="submit">Search</button>
        </form>

        <div className="search-toolbar">
          <span>{rawQuery ? <>Results for <strong>“{rawQuery}”</strong></> : <>Browse verified search categories</>} {hasResults && <span className="search-count"> · {resultCount} results</span>}</span>
          {(rawQuery || type !== "All" || budget !== "Any budget") && <Link className="clear-search" href="/search">Clear all</Link>}
        </div>

        {!hasResults && <div className="search-empty">No verified results match this search yet. Try a broader location, workplace or keyword. Real PG listings will appear here only after their information is verified.</div>}

        <div className="search-groups">
          {(type === "All" || type === "Location") && locations.length > 0 && <section><h2>Locations</h2>{locations.map(x => <Link key={x} className="search-result" href={"/discover-pg-in-thane/pg-in-" + x.toLowerCase().replaceAll(" ", "-") + "-thane"}><span>📍 {x}</span><small>PG · Paying Guest · Hostel</small></Link>)}</section>}
          {(type === "All" || type === "Microlocation") && micros.length > 0 && <section><h2>Microlocations</h2>{micros.map(x => <Link key={x.name} className="search-result" href={"/search?q=" + encodeURIComponent(x.name) + "&type=Microlocation"}><span>📍 {x.name}</span><small>{x.location}</small></Link>)}</section>}
          {(type === "All" || type === "Workplace") && workplaces.length > 0 && <section><h2>Workplaces</h2>{workplaces.map(x => <Link key={x.name} className="search-result" href={"/search?q=" + encodeURIComponent(x.name) + "&type=Workplace"}><span>🏢 {x.name}</span><small>{x.kind} · {x.location}</small></Link>)}</section>}
          {type === "Keyword" && keywordMatches.length > 0 && <section><h2>Keyword matches</h2>{keywordMatches.map(x => <Link key={x.label + x.meta} className="search-result" href={x.href}><span>{x.label}</span><small>{x.meta}</small></Link>)}</section>}
          {(type === "All" || type === "Keyword") && matchingListings.length > 0 && <section><h2>Real PG listings</h2>{matchingListings.map(x => <Link key={x.id} className="search-result" href={"/listing/" + x.slug}><span>{x.name}</span><small>{x.type} · {x.location}</small></Link>)}</section>}
        </div>
      </section>
    </main>
  );
}