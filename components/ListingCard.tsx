"use client";

import type { Listing } from "@/data/catalog";
import EnquiryButton from "@/components/EnquiryButton";
import SiteIcon from "@/components/SiteIcon";

function getApprovedPricePattern(listing: Listing) {
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
  const location = /\\bThane(?: West)?\\b/i.test(baseLocation) || baseLocation === "Location pending"
    ? baseLocation
    : baseLocation + ", " + areaSuffix;

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
          <span className="feature-ac"><span className="card-emoji" aria-hidden="true">❄️</span> AC / Non-AC</span>
          <span className="feature-male"><span className="card-emoji" aria-hidden="true">👨</span> Male</span>
          <span className="feature-female"><span className="card-emoji" aria-hidden="true">👩</span> Female</span>
          <span className="feature-clean"><span className="card-emoji" aria-hidden="true">🧹</span> Daily housekeeping</span>
          <span className="feature-wifi"><span className="card-emoji" aria-hidden="true">📶</span> Free Wi-Fi</span>
          <span className="feature-furnished"><span className="card-emoji" aria-hidden="true">🛋️</span> Fully furnished</span>
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
          <a href={"/listing/" + listing.slug}>View details →</a>
        </div>
      </div>
    </article>
  );
}
