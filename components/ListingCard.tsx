"use client";

import type { Listing } from "@/data/catalog";
import EnquiryButton from "@/components/EnquiryButton";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="listing-card">
      <div className="listing-photo">
        {listing.photos[0] ? <img src={listing.photos[0]} alt={listing.imageAlt || listing.name} /> : <div className="photo-placeholder">Photo pending</div>}
        {listing.verified && <span className="verified-badge">Verified listing</span>}
      </div>
      <div className="listing-body">
        <div className="listing-kicker">{listing.type} · {listing.gender || "Gender not specified"}</div>
        <h3>{listing.name}</h3>
        <p className="listing-location">📍 {listing.microlocation}, {listing.location}</p>
        {listing.amenities?.length ? <p className="listing-amenities">{listing.amenities.slice(0, 4).join(" · ")}</p> : null}
      </div>
      <div className="listing-side">
        {listing.priceFrom && <strong className="listing-price">From ₹{listing.priceFrom.toLocaleString("en-IN")}/month</strong>}
        <div className="listing-actions">
          <EnquiryButton listingName={listing.name} location={listing.location} label="Enquire" className="listing-enquire" />
          <a href={"/listing/" + listing.slug}>View Details →</a>
        </div>
      </div>
    </article>
  );
}
