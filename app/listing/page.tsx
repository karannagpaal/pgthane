import type { Metadata } from "next";
import Link from "next/link";
import { listings } from "@/data/catalog";
import ListingCard from "@/components/ListingCard";

export const metadata: Metadata = {
  title: "PG Listings in Thane | PG Thane",
  description: "Browse verified PG, Paying Guest, Hostel and shared-room listings in Thane.",
  alternates: { canonical: "https://www.pgthane.com/listing" }
};

export default function ListingsPage() {
  const publishedListings = listings.filter(x => x.published === true && !x.photoOnly);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="/">PG<span>Thane</span></a>
        <nav><a href="/discover-pg-in-thane">Locations</a><a href="/#how-it-works">How it works</a><a href="/#contact">Contact</a></nav>
        <a className="header-cta" href="/search">Find a PG</a>
      </header>

      <section className="section listings-index">
        <div className="eyebrow">PG LISTINGS</div>
        <h1>PG Listings in Thane</h1>
        <p className="section-lead">Browse real PG, Paying Guest, Hostel and shared-room options. Listings are shown here only after their property information has been verified.</p>

        {publishedListings.length > 0 ? (
          <div className="listing-grid">
            {publishedListings.map(listing => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        ) : (
          <div className="empty-state">
            <h2>Verified PG listings are being added</h2>
            <p>We are adding property details only after the name, location, pricing and other important information are verified. We do not publish placeholder properties.</p>
            <div className="empty-actions">
              <Link className="primary-button" href="/search">Search PGs</Link>
              <a className="secondary-button" href="tel:9892336705">Ask for available PGs</a>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}
