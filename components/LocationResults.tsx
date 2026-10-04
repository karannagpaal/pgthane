"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import type { Listing } from "@/data/catalog";
import ListingCard from "@/components/ListingCard";

export default function LocationResults({ listings }: { listings: Listing[] }) {
  const params = useSearchParams();

  const filtered = useMemo(() => listings.filter(x => {
    const gender = params.get("gender");
    const food = params.get("food");
    const room = params.get("room");
    const amenity = params.get("amenity");
    const sharing = params.get("sharing");
    const budget = params.get("budget");

    if (gender && x.gender !== gender) return false;
    if (food && food !== "Any" && (!x.food || (x.food !== "Both" && x.food !== food))) return false;
    if (room && room !== "Any" && (!x.roomType || (x.roomType !== "Both" && x.roomType !== room))) return false;
    if (amenity && amenity !== "Any" && (!x.amenities || !x.amenities.some(a => a.toLowerCase().includes(amenity.toLowerCase())))) return false;
    if (sharing) {
      const wanted = sharing.toLowerCase().replace(" sharing", "");
      if (!x.sharing || !x.sharing.some(value => value.toLowerCase().replace(" sharing", "") === wanted)) return false;
    }
    if (budget) {
      if (x.priceFrom === undefined) return false;
      if (budget === "Under ₹10,000" && x.priceFrom >= 10000) return false;
      if (budget === "₹10,000 – ₹15,000" && (x.priceFrom < 10000 || x.priceFrom > 15000)) return false;
      if (budget === "₹15,000 – ₹20,000" && (x.priceFrom < 15000 || x.priceFrom > 20000)) return false;
      if (budget === "₹20,000+" && x.priceFrom < 20000) return false;
    }
    return true;
  }), [listings, params]);

  if (filtered.length === 0) {
    return <div className="empty-listings"><div className="empty-icon">⌂</div><h3>No PG matches these filters</h3><p>Try clearing one or more filters to see the verified PG listings available in this location.</p></div>;
  }

  return <div className="listing-grid">{filtered.map(x => <ListingCard key={x.id} listing={x} />)}</div>;
}
