"use client";

import type { Listing } from "@/data/catalog";
import EnquiryButton from "@/components/EnquiryButton";
import SiteIcon from "@/components/SiteIcon";

function getListingFeatures(listing: Listing) {
  const amenities = listing.amenities || [];
  const normalized = amenities.map((item) => item.toLowerCase());
  const features: { label: string; className: string; icon: string }[] = [];

  if (normalized.some((item) => item.includes("ac & non-ac") || item.includes("ac/non-ac"))) {
    features.push({ label: "AC / Non-AC", className: "feature-ac", icon: "❄️" });
  } else if (normalized.some((item) => item.includes("air conditioning") || item === "ac")) {
    features.push({ label: "Air conditioning", className: "feature-ac", icon: "❄️" });
  }

  if (listing.gender === "Male") {
    features.push({ label: "Male", className: "feature-male", icon: "👨" });
  } else if (listing.gender === "Female") {
    features.push({ label: "Female", className: "feature-female", icon: "👩" });
  } else if (listing.gender === "Unisex") {
    features.push({ label: "Male & Female", className: "feature-male", icon: "👥" });
  }

  if (normalized.some((item) => item.includes("housekeeping"))) {
    features.push({ label: "Daily housekeeping", className: "feature-clean", icon: "🧹" });
  }
  if (normalized.some((item) => item.includes("wi-fi") || item.includes("wifi"))) {
    features.push({ label: "Wi-Fi", className: "feature-wifi", icon: "📶" });
  }
  if (normalized.some((item) => item.includes("fully furnished"))) {
    features.push({ label: "Fully furnished", className: "feature-furnished", icon: "🛋️" });
  }

  return features;
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const location = listing.microlocation && listing.microlocation !== listing.location
    ? listing.microlocation + ", " + listing.location
    : listing.location;
  const features = getListingFeatures(listing);

  return (
    <article className="listing-card">
      <div className="listing-photo">
        {listing.photos[0]
          ? <img src={listing.photos[0]} alt={listing.imageAlt || listing.name} loading="lazy" />
          : <div className="photo-placeholder">Photo pending</div>}
      </div>

      <div className="listing-body">
        <h3>{listing.name}</h3>
        <p className="listing-location"><SiteIcon name="pin" size={16} /> {location}</p>

        {features.length > 0 && (
          <div className="listing-feature-grid" aria-label="Property features">
            {features.map((feature) => (
              <span key={feature.label} className={feature.className}>
                <span className="card-emoji" aria-hidden="true">{feature.icon}</span> {feature.label}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="listing-side">
        <div className="listing-price-range">
          <span>Monthly rent*</span>
          <strong>{listing.priceFrom !== undefined
            ? `From ₹${listing.priceFrom.toLocaleString("en-IN")}/month`
            : "Enquire for current rent"}</strong>
        </div>

        {listing.zeroBrokerage === true && <div className="zero-brokerage">Zero brokerage</div>}

        <div className="listing-actions">
          <EnquiryButton
            listingName={listing.name}
            location={listing.location}
            label="Enquire"
            className="listing-enquire"
          />
          <a href={"/listing/" + listing.slug}>View details →</a>
        </div>
      </div>
    </article>
  );
}
