"use client";

import type { Listing } from "@/data/catalog";
import EnquiryButton from "@/components/EnquiryButton";
import SiteIcon from "@/components/SiteIcon";

const CARD_RENT_OPTIONS = [7499, 7799, 7999, 8499, 8799, 8999, 9499, 9999, 10999, 11999, 12999, 13999, 14999, 15999, 16999];

function getCardRent(slug: string) {
  const hash = Array.from(slug).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return CARD_RENT_OPTIONS[hash % CARD_RENT_OPTIONS.length];
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const location = listing.microlocation && listing.microlocation !== listing.location
    ? listing.microlocation + ", " + listing.location
    : listing.location;

  return (
    <article className="listing-card">
      <div className="listing-photo">
        {listing.photos[0]
          ? <img src={listing.photos[0]} alt={listing.imageAlt || listing.name} loading="lazy" />
          : <div className="photo-placeholder">Photo pending</div>}
        {listing.verified && (
          <span className="verified-badge">
            <SiteIcon name="check" size={14} />
            Verified Listing
          </span>
        )}
      </div>

      <div className="listing-body">
        <div className="listing-kicker">{listing.type}</div>
        <h3>{listing.name}</h3>
        <p className="listing-location"><SiteIcon name="pin" size={16} /> {location}</p>

        <div className="listing-feature-grid" aria-label="Property features">
          <span className="feature-ac"><span className="card-emoji" aria-hidden="true">❄️</span> AC &amp; Non-AC</span>
          <span className="feature-male"><span className="card-emoji" aria-hidden="true">👨</span> Male</span>
          <span className="feature-female"><span className="card-emoji" aria-hidden="true">👩</span> Female</span>
          <span className="feature-clean"><span className="card-emoji" aria-hidden="true">🧹</span> Daily Housekeeping</span>
          <span className="feature-wifi"><span className="card-emoji" aria-hidden="true">📶</span> Free High-Speed Wi-Fi</span>
          <span className="feature-furnished"><span className="card-emoji" aria-hidden="true">🛋️</span> Fully Furnished</span>
        </div>

        {listing.phone && (
          <div className="listing-contact-row">
            <span><SiteIcon name="phone" size={15} /> Contact No.</span>
            <strong>{listing.phone}</strong>
          </div>
        )}
      </div>

      <div className="listing-side">
        <div className="listing-price-range">
          <span>Indicative monthly rent*</span>
          <strong>₹7,499 – ₹16,999/month</strong>
        </div>

        <div className="zero-brokerage">ZERO BROKERAGE</div>

        <div className="listing-actions">
          <EnquiryButton
            listingName={listing.name}
            location={listing.location}
            label="Enquire"
            className="listing-enquire"
          />
          <a href={"/listing/" + listing.slug}>View Details →</a>
        </div>
      </div>
    </article>
  );
}
