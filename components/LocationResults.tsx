"use client";

import { useEffect, useMemo, useState } from "react";
import type { Listing } from "@/data/catalog";
import ListingCard from "@/components/ListingCard";
import SiteIcon from "@/components/SiteIcon";

function matchesFilters(listing: Listing, params: URLSearchParams) {
  const gender = params.get("gender");
  const food = params.get("food");
  const room = params.get("room");
  const amenity = params.get("amenity");
  const sharing = params.get("sharing");
  const budget = params.get("budget");

  if (gender && listing.gender !== gender) return false;
  if (food && food !== "Any" && (!listing.food || (listing.food !== "Both" && listing.food !== food))) return false;
  if (room && room !== "Any" && (!listing.roomType || (listing.roomType !== "Both" && listing.roomType !== room))) return false;
  if (amenity && amenity !== "Any" && (!listing.amenities || !listing.amenities.some(value => value.toLowerCase().includes(amenity.toLowerCase())))) return false;
  if (sharing) {
    const wanted = sharing.toLowerCase().replace(" sharing", "");
    if (!listing.sharing || !listing.sharing.some(value => value.toLowerCase().replace(" sharing", "") === wanted)) return false;
  }
  if (budget) {
    if (listing.priceFrom === undefined) return false;
    if (budget === "Under ₹10,000" && listing.priceFrom >= 10000) return false;
    if (budget === "₹10,000 – ₹15,000" && (listing.priceFrom < 10000 || listing.priceFrom > 15000)) return false;
    if (budget === "₹15,000 – ₹20,000" && (listing.priceFrom < 15000 || listing.priceFrom > 20000)) return false;
    if (budget === "₹20,000+" && listing.priceFrom < 20000) return false;
  }
  return true;
}

export default function LocationResults({ listings }: { listings: Listing[] }) {
  // Start with every listing so static HTML contains the actual result cards.
  // Apply query-string filters after hydration without suspending the server render.
  const [filterSearch, setFilterSearch] = useState<string | null>(null);

  useEffect(() => {
    const syncFromUrl = () => setFilterSearch(window.location.search.replace(/^\?/, ""));
    const onFiltersUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setFilterSearch(customEvent.detail || "");
    };

    syncFromUrl();
    window.addEventListener("popstate", syncFromUrl);
    window.addEventListener("pgthane:filters-updated", onFiltersUpdated);
    return () => {
      window.removeEventListener("popstate", syncFromUrl);
      window.removeEventListener("pgthane:filters-updated", onFiltersUpdated);
    };
  }, []);

  const filtered = useMemo(() => {
    if (filterSearch === null || !filterSearch) return listings;
    const params = new URLSearchParams(filterSearch);
    return listings.filter(listing => matchesFilters(listing, params));
  }, [listings, filterSearch]);

  if (filtered.length === 0) {
    return <div className="empty-listings"><div className="empty-icon"><SiteIcon name="home" size={28} /></div><h3>No PG matches these filters</h3><p>Try clearing one or more filters to see the verified PG listings available in this location.</p></div>;
  }

  return <div className="listing-grid">{filtered.map(listing => <ListingCard key={listing.id} listing={listing} />)}</div>;
}
