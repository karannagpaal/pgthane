"use client";

import type { Listing } from "@/data/catalog";
import EnquiryButton from "@/components/EnquiryButton";
import SiteIcon from "@/components/SiteIcon";

function getApprovedPricePattern(listing: Listing) {
  // Keep card pricing consistent with the rent shown on the matching detail page.
  if (typeof listing.priceFrom === "number" && Number.isFinite(listing.priceFrom)) {
    return "From ₹" + listing.priceFrom.toLocaleString("en-IN") + "/month";
  }

  const sharing = listing.sharing || [];
  const hasTriple = sharing.some(x => x.toLowerCase().includes("triple"));
  const hasDouble = sharing.some(x => x.toLowerCase().includes("double"));
  const hasSingle = sharing.some(x => x.toLowerCase().includes("single") || x.toLowerCase().includes("private"));

  if (hasSingle && !hasDouble && !hasTriple) return "₹12,000 – ₹30,000/month";
  if (hasDouble && !hasSingle && !hasTriple) return "From ₹7,500/month";
  if (hasTriple && !hasSingle && !hasDouble) return "₹7,000 – ₹12,000/month";
  if (hasSingle || (hasDouble && hasTriple)) return "₹7,000 – ₹30,000/month";
  return "From ₹7,000/month";
}

const locationAreas: Record<string, string> = {
  "Hiranandani Estate": "Thane West",
  "Hiranandani Business Park": "Thane West",
  "Wagle Estate": "Thane West",
  "Majiwada": "Thane West",
  "Balkum": "Thane West",
  "Ghodbunder Road": "Thane West",
  "Kasarvadavali": "Thane West",
  "Manpada": "Thane West",
  "Vartak Nagar": "Thane West",
  "Kolshet": "Thane West",
  "Kolshet Road": "Thane West",
  "Kapurbawdi": "Thane West",
  "Pokhran Road": "Thane West",
  "Vasant Vihar": "Thane West",
  "Bhramand": "Thane West",
  "Lokmanya Nagar": "Thane West",
  "Thane Station": "Thane",
  "Panchpakhadi": "Thane",
  "Louiswadi": "Thane",
  "Teen Hath Naka": "Thane",
  "Naupada": "Thane",
  "Khopat": "Thane",
  "Castle Mill": "Thane"
};

export default function ListingCard({ listing }: { listing: Listing }) {
  const baseLocation = listing.microlocation && listing.microlocation !== listing.location
    ? listing.microlocation + ", " + listing.location
    : listing.location;
  const areaSuffix = locationAreas[listing.location] || "Thane";
  const location = /\bThane(?: West)?\b/i.test(baseLocation) || baseLocation === "Location pending"
    ? baseLocation
    : baseLocation + ", " + areaSuffix;

  const featureItems = [
    ...(listing.amenities || []).map((amenity, index) => ({
      key: "amenity-" + index + "-" + amenity,
      label: amenity === "Air conditioning" ? "AC" : amenity,
      icon: amenity.toLowerCase().includes("wi-fi") || amenity.toLowerCase().includes("wifi")
        ? "📶"
        : amenity.toLowerCase().includes("housekeeping")
          ? "🧹"
          : amenity.toLowerCase().includes("furnish")
            ? "🛋️"
            : "❄️",
      className: amenity.toLowerCase().includes("wi-fi") || amenity.toLowerCase().includes("wifi")
        ? "feature-wifi"
        : amenity.toLowerCase().includes("housekeeping")
          ? "feature-clean"
          : amenity.toLowerCase().includes("furnish")
            ? "feature-furnished"
            : "feature-ac"
    })),
    ...(listing.gender ? [{
      key: "gender",
      label: listing.gender === "Unisex" ? "Male & Female" : listing.gender,
      icon: listing.gender === "Female" ? "👩" : listing.gender === "Male" ? "👨" : "👥",
      className: "feature-male"
    }] : []),
    ...(listing.sharing || []).map((sharing, index) => ({
      key: "sharing-" + index,
      label: sharing,
      icon: "🛏️",
      className: "feature-furnished"
    })),
    ...(listing.roomType ? [{
      key: "room-type",
      label: listing.roomType,
      icon: "🏠",
      className: "feature-clean"
    }] : [])
  ];

  return (
    <article className="listing-card">
      <div className="listing-photo">
        {listing.photos[0]
          ? <>
              <img src={listing.photos[0]} alt={listing.imageAlt || listing.name} loading="lazy" />
            </>
          : <div className="photo-placeholder">Photo pending</div>}
      </div>

      <div className="listing-body">
        <h3>{listing.name}</h3>
        <p className="listing-location"><SiteIcon name="pin" size={16} /> {location}</p>

        <div className="listing-feature-grid" aria-label="Property features">
          {featureItems.length > 0 ? featureItems.map(feature => (
            <span key={feature.key} className={feature.className}>
              <span className="card-emoji" aria-hidden="true">{feature.icon}</span> {feature.label}
            </span>
          )) : (
            <span className="feature-furnished"><span className="card-emoji" aria-hidden="true">🏠</span> PG accommodation</span>
          )}
        </div>
      </div>

      <div className="listing-side">
        <div className="listing-price-range">
          <span>Monthly rent*</span>
          <strong>{getApprovedPricePattern(listing)}</strong>
        </div>

        <div className="zero-brokerage">Zero brokerage</div>

        <div className="listing-actions">
          <EnquiryButton
            listingName={listing.name}
            location={listing.location}
            label="Enquire"
            className="listing-enquire"
          />
          <a href={"/listing/" + listing.slug + "/"}>View details →</a>
        </div>
      </div>
    </article>
  );
}
