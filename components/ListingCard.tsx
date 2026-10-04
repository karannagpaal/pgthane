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
        <div className="listing-kicker">{listing.type}</div>
        <h3>{listing.name}</h3>
        <p className="listing-location">📍 {listing.microlocation && listing.microlocation !== listing.location ? listing.microlocation + ", " + listing.location : listing.location}</p>

        <div className="listing-feature-grid" aria-label="Property features">
          <span>❄️ AC & Non-AC</span>
          <span>👨 Male</span>
          <span>👩 Female</span>
          <span>🧹 Daily Housekeeping</span>
          <span>📶 Free High-Speed Wi-Fi</span>
          <span>🛋️ Fully Furnished</span>
        </div>
      </div>

      <div className="listing-side">
        <div className="listing-price-range">
          <span>AC rent</span>
          <strong>From ₹7,499/month</strong>
        </div>
        {listing.priceFrom && (
          <div className="listing-current-price">
            <span>Listed option</span>
            <strong>₹{listing.priceFrom.toLocaleString("en-IN")}/month</strong>
          </div>
        )}
        <div className="listing-actions">
          <EnquiryButton listingName={listing.name} location={listing.location} label="Enquire" className="listing-enquire" />
          <a href={"/listing/" + listing.slug}>View Details →</a>
        </div>
      </div>
    </article>
  );
}
