"use client";

import type { Listing } from "@/data/catalog";
import EnquiryButton from "@/components/EnquiryButton";
import SiteIcon from "@/components/SiteIcon";

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

function getFeatureItems(listing: Listing) {
  const features: { label: string; icon: string }[] = [];
  if (listing.sharing?.length) features.push({ label: listing.sharing.join(" / "), icon: "🛋️" });
  if (listing.gender) features.push({
    label: listing.gender === "Unisex" ? "Male & Female" : listing.gender,
    icon: listing.gender === "Female" ? "👩" : listing.gender === "Male" ? "👨" : "👥"
  });
  if (listing.roomType) features.push({ label: listing.roomType, icon: "🏠" });
  if (listing.food) features.push({ label: listing.food, icon: "🍽️" });
  for (const amenity of listing.amenities || []) {
    const lower = amenity.toLowerCase();
    const icon = lower.includes("wi-fi") || lower.includes("wifi") ? "📶"
      : lower.includes("housekeeping") ? "🧹"
      : lower.includes("furnish") ? "🛋️"
      : lower.includes("ac") ? "❄️"
      : "✓";
    if (!features.some(feature => feature.label.toLowerCase() === amenity.toLowerCase())) {
      features.push({ label: amenity, icon });
    }
  }
  return features.slice(0, 6);
}

function getPriceLabel(listing: Listing) {
  if (typeof listing.priceFrom === "number" && listing.priceFrom > 0) {
    return "From ₹" + listing.priceFrom.toLocaleString("en-IN") + "/month";
  }
  return "Confirm current rent";
}

export default function ListingCard({ listing }: { listing: Listing }) {
  const baseLocation = listing.microlocation && listing.microlocation !== listing.location
    ? listing.microlocation + ", " + listing.location
    : listing.location;
  const areaSuffix = locationAreas[listing.location] || "Thane";
  const location = !baseLocation || baseLocation === "Location pending" || /\bThane(?: West)?\b/i.test(baseLocation)
    ? baseLocation || "Thane"
    : baseLocation + ", " + areaSuffix;
  const features = getFeatureItems(listing);

  return (
    <article className="listing-card">
      <div className="listing-photo">
        {listing.photos[0]
          ? <img src={listing.photos[0]} alt={listing.imageAlt || listing.name} loading="lazy" />
          : <div className="photo-placeholder">Photo pending</div>}
        {listing.verified === true && <span className="verified-badge"><SiteIcon name="check" size={14} /> Verified Listing</span>}
      </div>

      <div className="listing-body">
        <h3>{listing.name}</h3>
        <p className="listing-location"><SiteIcon name="pin" size={16} /> {location}</p>
        {listing.verified !== true && <p className="listing-verification-status">Details not independently verified yet</p>}

        {features.length > 0
          ? <div className="listing-feature-grid" aria-label="Listing details">
              {features.map(feature => (
                <span key={feature.label}><span className="card-emoji" aria-hidden="true">{feature.icon}</span>{feature.label}</span>
              ))}
            </div>
          : <p className="listing-feature-empty">Confirm sharing, room type and facilities before booking.</p>}
      </div>

      <div className="listing-side">
        <div className="listing-price-range">
          <span>{listing.priceFrom ? "Listed monthly rent" : "Monthly rent"}</span>
          <strong>{getPriceLabel(listing)}</strong>
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
