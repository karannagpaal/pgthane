import type { Metadata } from "next";
import { Suspense } from "react";
import SearchClient from "@/components/SearchClient";

export const metadata: Metadata = {
  title: "Search PGs in Thane | PG Thane",
  description: "Search PG, Paying Guest, Hostel and shared-room options in Thane by location, microlocation and workplace.",
  robots: { index: false, follow: true }
};

export default function SearchPage() {
  return (
    <Suspense fallback={<main><section className="section search-page"><div className="eyebrow">DIRECTORY SEARCH</div><h1>Search PGs in Thane</h1></section></main>}>
      <SearchClient />
    </Suspense>
  );
}
