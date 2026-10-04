import Link from "next/link";
import { listings, locationIndex, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; type?: string }> }) {
  const params = await searchParams;
  const q = (params.q || "").trim().toLowerCase();
  const type = params.type || "All";

  const locations = locationIndex.filter((x) => !q || x.toLowerCase().includes(q));
  const micros = verifiedMicrolocationIndex.filter((x) => !q || x.name.toLowerCase().includes(q));
  const workplaces = verifiedWorkplaceIndex.filter((x) => !q || x.name.toLowerCase().includes(q));
  const matchingListings = listings.filter((x) => {
    if (!q) return true;
    return [x.name, x.location, x.microlocation, ...x.workplace].join(" ").toLowerCase().includes(q);
  });

  return (
    <main>
      <header className="topbar"><a className="brand" href="/">PG<span>Thane</span></a><nav><a href="/#locations">Locations</a><a href="/#how-it-works">How it works</a></nav><a className="header-cta" href="tel:9892336705">Call</a></header>
      <section className="section search-page">
        <div className="eyebrow">DIRECTORY SEARCH</div>
        <h1>Search PGs in Thane</h1>
        <form className="search-page-form">
          <input name="q" defaultValue={params.q || ""} placeholder="Location, microlocation, workplace or keyword" />
          <select name="type" defaultValue={type}><option>All</option><option>Location</option><option>Microlocation</option><option>Workplace</option><option>Keyword</option></select>
          <button className="search-button">Search</button>
        </form>

        <div className="search-groups">
          {(type === "All" || type === "Location") && <section><h2>Locations</h2>{locations.map((x) => <Link key={x} className="search-result" href={"/discover-pg-in-thane/pg-in-" + x.toLowerCase().replaceAll(" ", "-") + "-thane"}>📍 {x}</Link>)}{!locations.length && <p>No matching location.</p>}</section>}
          {(type === "All" || type === "Microlocation") && <section><h2>Microlocations</h2>{micros.map((x) => <div key={x.name} className="search-result">📍 {x.name}<small>{x.location}</small></div>)}{!micros.length && <p>No verified microlocation match.</p>}</section>}
          {(type === "All" || type === "Workplace") && <section><h2>Workplaces</h2>{workplaces.map((x) => <div key={x.name} className="search-result">🏢 {x.name}<small>{x.location}</small></div>)}{!workplaces.length && <p>No verified workplace match.</p>}</section>}
          {(type === "All" || type === "Keyword") && <section><h2>PG listings</h2>{matchingListings.map((x) => <Link key={x.id} className="search-result" href={"/listing/" + x.slug}>{x.name}<small>{x.location}</small></Link>)}{!matchingListings.length && <p>No verified PG listing matches yet.</p>}</section>}
        </div>
      </section>
    </main>
  );
}