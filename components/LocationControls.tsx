"use client";

import { useRouter, useSearchParams } from "next/navigation";

const filters = [
  ["budget", "Budget", ["Any budget", "Under ₹10,000", "₹10,000 – ₹15,000", "₹15,000 – ₹20,000", "₹20,000+"]],
  ["gender", "Gender", ["Any", "Male", "Female", "Unisex"]],
  ["sharing", "Sharing", ["Any", "Single", "Double sharing", "Triple sharing", "4 Sharing+"]],
  ["food", "Food", ["Any", "With food", "Without food"]],
  ["room", "Room type", ["Any", "Private room", "Shared room"]],
  ["amenity", "Amenity", ["Any", "Wi-Fi", "Fully Furnished", "Housekeeping", "Washing Machine", "Parking"]]
] as const;

export default function LocationControls() {
  const router = useRouter();
  const params = useSearchParams();

  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value === "Any" || value === "Any budget") next.delete(key); else next.set(key, value);
    const query = next.toString();
    router.push(query ? "?" + query : "?", { scroll: false });
    requestAnimationFrame(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return <div className="filter-panel" aria-label="PG filters">
    {filters.map(([key, label, options]) => <label key={key}><span>{label}</span><select value={params.get(key) || options[0]} onChange={e => update(key, e.target.value)}>{options.map(option => <option key={option}>{option}</option>)}</select></label>)}
    <button type="button" onClick={() => { router.push("?"); requestAnimationFrame(() => document.getElementById("results")?.scrollIntoView({ behavior: "smooth", block: "start" })); }} className="clear-filter">Clear filters</button>
  </div>;
}