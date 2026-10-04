import type { Listing } from "@/data/catalog";

export default function ListingCard({ listing }: { listing: Listing }) {
  return (
    <article className="listing-card">
      <div className="listing-photo">
        {listing.photos[0] ? <img src={listing.photos[0]} alt={listing.name} /> : <div className="photo-placeholder">Photo pending</div>}
        {listing.verified && <span className="verified-badge">Verified</span>}
      </div>
      <div className="listing-body">
        <div className="listing-kicker">{listing.type} · {listing.gender || "Gender not specified"}</div>
        <h3>{listing.name}</h3>
        <p className="listing-location">📍 {listing.microlocation}, {listing.location}</p>
        {listing.priceFrom && <strong className="listing-price">From ₹{listing.priceFrom.toLocaleString("en-IN")}/month</strong>}
        {listing.amenities?.length ? <p className="listing-amenities">{listing.amenities.slice(0, 4).join(" · ")}</p> : null}
        <div className="listing-actions">
          <a href={"/listing/" + listing.slug}>View Details</a>
          {listing.phone && <a href={"tel:" + listing.phone}>Call</a>}
          {listing.whatsapp && <a href={"https://wa.me/" + listing.whatsapp}>WhatsApp</a>}
        </div>
      </div>
    </article>
  );
}