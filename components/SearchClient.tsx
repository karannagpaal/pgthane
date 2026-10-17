"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { listings, locationIndex, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

const types = ["All", "Location", "Microlocation", "Workplace", "Keyword"];

function locationHref(value: string) {
  if (value === "Thane Station") return "/discover-pg-in-thane/pg-near-railway-station-thane";
  return "/discover-pg-in-thane/pg-in-" + value.toLowerCase().replaceAll(" ", "-") + "-thane";
}

const allowed = {
  budget: new Set(["Any budget", "Under ₹10,000", "₹10,000 – ₹15,000", "₹15,000 – ₹20,000", "₹20,000+"]),
  gender: new Set(["Any", "Male", "Female", "Unisex", "Male & Female"]),
  sharing: new Set(["Any", "Single", "Double sharing", "Triple sharing", "4 Sharing+"]),
  room: new Set(["Any", "Private room", "Shared room"]),
  amenity: new Set(["Any", "Wi-Fi", "Fully Furnished", "Housekeeping", "Washing Machine", "Parking"])
};

export default function SearchClient() {
  const params = useSearchParams();
  const rawQuery = (params.get("q") || "").trim();
  const q = rawQuery.toLowerCase();
  const type = types.includes(params.get("type") || "") ? (params.get("type") || "All") : "All";
  const budget = allowed.budget.has(params.get("budget") || "") ? params.get("budget")! : "Any budget";
  const gender = allowed.gender.has(params.get("gender") || "") ? params.get("gender")! : "Any";
  const sharing = allowed.sharing.has(params.get("sharing") || "") ? params.get("sharing")! : "Any";
  const room = allowed.room.has(params.get("room") || "") ? params.get("room")! : "Any";
  const amenity = allowed.amenity.has(params.get("amenity") || "") ? params.get("amenity")! : "Any";

  const data = useMemo(() => {
    const locations = locationIndex.filter(x => !q || x.toLowerCase().includes(q));
    const micros = verifiedMicrolocationIndex.filter(x => !q || (x.name + " " + x.location).toLowerCase().includes(q));
    const workplaces = verifiedWorkplaceIndex.filter(x => !q || (x.name + " " + x.location + " " + x.kind).toLowerCase().includes(q));

    const filterQuery = new URLSearchParams();
    if (budget !== "Any budget") filterQuery.set("budget", budget);
    if (gender !== "Any") filterQuery.set("gender", gender === "Male & Female" ? "Unisex" : gender);
    if (sharing !== "Any") filterQuery.set("sharing", sharing);
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
      if (gender !== "Any" && x.gender !== (gender === "Male & Female" ? "Unisex" : gender)) return false;
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

    const showListingResults = matchingListings.length > 0 && (type === "All" || Boolean(q) || budget !== "Any budget" || gender !== "Any" || sharing !== "Any" || room !== "Any" || amenity !== "Any");
    const resultCount = directoryLocations.length + directoryMicros.length + directoryWorkplaces.length + (type === "Keyword" ? keywordMatches.length : 0) + (showListingResults ? matchingListings.length : 0);

    return { locations, micros, workplaces, keywordMatches, directoryLocations, directoryMicros, directoryWorkplaces, matchingListings, showListingResults, resultCount, withCurrentFilters };
  }, [q, type, budget, gender, sharing, room, amenity]);

  const hasResults = data.resultCount > 0;
  const withCurrentFilters = data.withCurrentFilters;
  const clearHref = "/search";
  const isFiltered = Boolean(rawQuery) || type !== "All" || budget !== "Any budget" || gender !== "Any" || sharing !== "Any" || room !== "Any" || amenity !== "Any";

  return (
    <main>
      <SiteHeader />
      <section className="section search-page">
        <div className="eyebrow">DIRECTORY SEARCH</div>
        <h1>Search PGs in Thane</h1>
        <form className="search-page-form" role="search" aria-label="Search PGs in Thane">
          <div className="search-primary-fields">
            <input name="q" defaultValue={rawQuery} placeholder="Location, microlocation, workplace or keyword" autoComplete="off" />
            <select name="type" defaultValue={type} aria-label="Search category">{types.map(x => <option key={x}>{x}</option>)}</select>
            <select name="budget" defaultValue={budget} aria-label="Budget"><option>Any budget</option><option>Under ₹10,000</option><option>₹10,000 – ₹15,000</option><option>₹15,000 – ₹20,000</option><option>₹20,000+</option></select>
          </div>
          <details className="search-advanced">
            <summary>More filters <span>Gender · Sharing · Room · Amenities</span></summary>
            <div className="search-advanced-grid">
              <select name="gender" defaultValue={gender === "Unisex" ? "Male & Female" : gender} aria-label="Gender"><option>Any</option><option>Male</option><option>Female</option><option>Male & Female</option></select>
              <select name="sharing" defaultValue={sharing} aria-label="Sharing"><option>Any</option><option>Single</option><option>Double sharing</option><option>Triple sharing</option><option>4 Sharing+</option></select>
              <select name="room" defaultValue={room} aria-label="Room type"><option>Any</option><option>Private room</option><option>Shared room</option></select>
              <select name="amenity" defaultValue={amenity} aria-label="Amenity"><option>Any</option><option>Wi-Fi</option><option>Fully Furnished</option><option>Housekeeping</option><option>Washing Machine</option><option>Parking</option></select>
            </div>
          </details>
          <button className="search-button" type="submit">Search PGs</button>
        </form>
        <div className="search-toolbar">
          <span>{rawQuery ? <>Results for <strong>“{rawQuery}”</strong></> : <>Browse search categories</>} {hasResults && <span className="search-count"> · {data.resultCount} results</span>}</span>
          {isFiltered && <Link className="clear-search" href={clearHref}>Clear all</Link>}
        </div>
        {!hasResults && <div className="search-empty">No results match this search yet. Try a broader location, workplace or keyword.</div>}
        <div className="search-groups">
          {data.directoryLocations.length > 0 && <section><h2>Locations</h2>{data.locations.map(x => <Link key={x} className="search-result" href={withCurrentFilters(locationHref(x))}><span>📍 {x}</span><small>PG · Paying Guest · Hostel</small></Link>)}</section>}
          {data.directoryMicros.length > 0 && <section><h2>Microlocations</h2>{data.micros.map(x => <Link key={x.name} className="search-result" href={withCurrentFilters("/search?q=" + encodeURIComponent(x.name) + "&type=Microlocation")}><span>📍 {x.name}</span><small>{x.location}</small></Link>)}</section>}
          {data.directoryWorkplaces.length > 0 && <section><h2>Workplaces</h2>{data.workplaces.map(x => <Link key={x.name} className="search-result" href={withCurrentFilters("/search?q=" + encodeURIComponent(x.name) + "&type=Workplace")}><span>🏢 {x.name}</span><small>{x.kind} · {x.location}</small></Link>)}</section>}
          {type === "Keyword" && data.keywordMatches.length > 0 && <section><h2>Keyword matches</h2>{data.keywordMatches.map(x => <Link key={x.label + x.meta} className="search-result" href={x.href}><span>{x.label}</span><small>{x.meta}</small></Link>)}</section>}
          {data.showListingResults && <section><h2>Real PG listings</h2>{data.matchingListings.map(x => <Link key={x.id} className="search-result" href={"/listing/" + x.slug}><span>{x.name}</span><small>{x.type} · {x.location}</small></Link>)}</section>}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}