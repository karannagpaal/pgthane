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
          <span><SiteIcon name="home" size={15} /> AC &amp; Non-AC</span>
          <span><SiteIcon name="home" size={15} /> Male</span>
          <span><SiteIcon name="home" size={15} /> Female</span>
          <span><SiteIcon name="broom" size={15} /> Daily Housekeeping</span>
          <span><SiteIcon name="wifi" size={15} /> Free High-Speed Wi-Fi</span>
          <span><SiteIcon name="sofa" size={15} /> Fully Furnished</span>
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
          <span>AC rooms</span>
          <strong>₹7,499 – ₹16,999/month</strong>
        </div>

        <div className="zero-brokerage">ZERO BROKERAGE</div>

        <div className="listing-current-price">
          <span>AC &amp; Non-AC</span>
          <strong>Male &amp; Female</strong>
        </div>

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
