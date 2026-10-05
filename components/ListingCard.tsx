"use client";

import type { Listing } from "@/data/catalog";
import EnquiryButton from "@/components/EnquiryButton";
import SiteIcon from "@/components/SiteIcon";

function formatPrice(value?: number) {
  if (!value) return "Price on enquiry";
  return "₹" + value.toLocaleString("en-IN") + "/month*";
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
      </div>

      <div className="listing-body">
        <div className="listing-kicker">{listing.type}</div>
        <h3>{listing.name}</h3>
        <p className="listing-location"><SiteIcon name="pin" size={16} /> {location}</p>

        <div className="listing-feature-grid" aria-label="Property features">
          <span><SiteIcon name="wifi" size={15} /> Wi-Fi</span>
          <span><SiteIcon name="sofa" size={15} /> Fully Furnished</span>
          <span><SiteIcon name="broom" size={15} /> Daily Housekeeping</span>
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
          <strong>From {formatPrice(listing.priceFrom ?? listing.draftPriceFrom)}</strong>
        </div>

        <div className="zero-brokerage">ZERO BROKERAGE</div>

        <div className="listing-current-price">
          <span>Availability</span>
          <strong>{listing.gender || "Check with property"}</strong>
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
