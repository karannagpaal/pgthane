import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listings } from "@/data/catalog";

export async function generateStaticParams() {
  return listings.filter(x => x.published === true && !x.photoOnly).map(x => ({ slug: x.slug }));
}
import Link from "next/link";
import EnquiryButton from "@/components/EnquiryButton";
import SiteIcon from "@/components/SiteIcon";
import SiteHeader from "@/components/SiteHeader";
import SiteFooter from "@/components/SiteFooter";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const listing = listings.find(x => x.slug === slug && x.published === true && !x.photoOnly);
  if (!listing) return { title: "PG Listing | PG Thane", robots: { index: false, follow: true } };
  return {
    title: listing.seoTitle || (listing.name + " | PG in " + listing.location + ", Thane"),
    description: listing.seoDescription || [listing.type, listing.microlocation, listing.location, listing.amenities?.join(", ")].filter(Boolean).join(" · "),
    alternates: { canonical: "https://www.pgthane.com/listing/" + listing.slug }
  };
}

function amenityIcon(amenity: string): "wifi" | "sofa" | "broom" | "snowflake" | "home" | "check" {
  const value = amenity.toLowerCase();
  if (value.includes("wi-fi") || value.includes("wifi") || value.includes("internet")) return "wifi";
  if (value.includes("furnish") || value.includes("wardrobe") || value.includes("bed")) return "sofa";
  if (value.includes("housekeeping") || value.includes("clean")) return "broom";
  if (value.includes("ac") || value.includes("air condition")) return "snowflake";
  if (value.includes("food") || value.includes("meal")) return "home";
  return "check";
}

function locationHref(location: string) {
  if (location === "Thane Station") return "/discover-pg-in-thane/pg-near-railway-station-thane";
  return "/discover-pg-in-thane/pg-in-" + location.toLowerCase().replaceAll(" ", "-") + "-thane";
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = listings.find(x => x.slug === slug && x.published === true && !x.photoOnly);
  if (!listing) notFound();

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "PG Thane", item: "https://www.pgthane.com/" },
      { "@type": "ListItem", position: 2, name: "PG in Thane", item: "https://www.pgthane.com/discover-pg-in-thane" },
      { "@type": "ListItem", position: 3, name: listing.name, item: "https://www.pgthane.com/listing/" + listing.slug }
    ]
  };

  return <main>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
    <SiteHeader />

    <section className="section listing-detail">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/discover-pg-in-thane">PG in Thane</Link><span>/</span><strong>{listing.name}</strong></div>

      <div className="listing-detail-head listing-title-block">
        <div className="listing-title-copy">
          <h1>{listing.name}</h1>
          <p className="listing-location large"><span className="title-location-icon"><SiteIcon name="pin" size={17} /></span><span>{listing.location + ", Thane"}</span></p>
        </div>
        <div className="listing-detail-actions">
          <a className="header-cta" href={"tel:" + (listing.phone || "9930007113")}><SiteIcon name="phone" size={16} /> Call</a>
          <a className="outline-cta" href={"https://wa.me/" + (listing.whatsapp || "919930007113").replace(/\D/g, "")} target="_blank" rel="noreferrer"><SiteIcon name="phone" size={16} /> WhatsApp</a>
        </div>
      </div>

      <div className="listing-detail-grid">
        <div>
          <div className="listing-gallery">
            <div className="listing-main-photo">
              {listing.photos[0] ? <img src={listing.photos[0]} alt={listing.imageAlt || listing.name} /> : <div className="photo-placeholder">Photo pending</div>}
              {listing.verified && <span className="verified-badge"><SiteIcon name="check" size={15} /> Verified Listing</span>}
            </div>
            {listing.photos.length > 1 && <div className="listing-thumbs">{listing.photos.map((photo, i) => <img key={photo} src={photo} alt={(listing.imageAlt || listing.name) + " photo " + (i + 1)} />)}</div>}
          </div>
        </div>

        <aside className="listing-quick">
          <div className="eyebrow">QUICK DETAILS</div>
          <div className="rent-range-panel">
            <div className="rent-range-heading">Typical monthly rent</div>
            <div className="rent-range-row"><span><strong>Triple sharing</strong><small>Non-AC</small></span><b>₹7,000–₹12,000</b></div>
            <div className="rent-range-row"><span><strong>Double sharing</strong><small>AC</small></span><b>₹7,500–₹22,000</b></div>
            <div className="rent-range-row"><span><strong>Single room</strong><small>Private room</small></span><b>₹12,000–₹30,000</b></div>
            <p className="rent-range-note">Actual rent depends on room, facilities and availability. Please enquire to confirm.</p>
          </div>
          <dl className="quick-details-list">
            <div><span className="quick-detail-icon"><SiteIcon name="pin" size={20} /></span><dt>Location</dt><dd>{listing.location}, Thane</dd></div>
            <div><span className="quick-detail-icon"><SiteIcon name="sofa" size={20} /></span><dt>Sharing</dt><dd>{listing.sharing?.length ? listing.sharing.join(" / ") : "Please enquire"}</dd></div>
            <div><span className="quick-detail-icon"><SiteIcon name="home" size={20} /></span><dt>Room type</dt><dd>{listing.roomType || "Please enquire"}</dd></div>
            <div className="gender-detail-row"><span className="quick-detail-icon gender-main-icon"><SiteIcon name="male" size={20} /></span><dt>Gender</dt><dd className="gender-options">
              <span className={listing.gender === "Male" || listing.gender === "Unisex" ? "gender-chip gender-male is-available" : "gender-chip gender-male"}><SiteIcon name="male" size={15} /> Male</span>
              <span className={listing.gender === "Female" || listing.gender === "Unisex" ? "gender-chip gender-female is-available" : "gender-chip gender-female"}><SiteIcon name="female" size={15} /> Female</span>
              {(!listing.gender || listing.gender === "Unisex") && <small>{listing.gender === "Unisex" ? "Both options" : "Confirm availability"}</small>}
            </dd></div>
            <div><span className="quick-detail-icon"><SiteIcon name="check" size={20} /></span><dt>Availability</dt><dd>{listing.availability || "Please enquire"}</dd></div>
          </dl>
          {listing.amenities?.length ? <div className="quick-amenities"><strong>Amenities</strong><div>{listing.amenities.map(a => <span key={a}><SiteIcon name={amenityIcon(a)} size={15} /> {a}</span>)}</div></div> : null}
          {listing.phone && <div className="listing-contact-detail"><strong>PGThane Enquiry</strong><a className="listing-contact-number" href={"tel:" + listing.phone}>{listing.phone}</a></div>}
          <EnquiryButton listingName={listing.name} location={listing.location} label="Enquire Now" className="detail-enquire" />
        </aside>
      </div>

      <section className="listing-description detail-description"><div className="eyebrow">ABOUT THIS PG</div><p>{listing.description || `Explore this ${listing.type} option in ${listing.location}, Thane. Confirm the current room configuration, rent, deposit, included facilities and availability directly before making a decision.`}</p></section>

      {listing.workplace?.length ? <section className="listing-workplaces"><div className="eyebrow">WORKPLACE SEARCH</div><div className="workplace-tags">{listing.workplace.map(x => <Link key={x} href={"/search?q=" + encodeURIComponent(x) + "&type=Workplace"}><SiteIcon name="building" size={16} /> {x}</Link>)}</div></section> : null}

      <section className="listing-related-links">
        <div className="eyebrow">EXPLORE MORE IN THANE</div>
        <div className="workplace-tags">
          <Link href={locationHref(listing.location)}><SiteIcon name="pin" size={16} /> More PGs in {listing.location}</Link>
          <Link href="/discover-pg-in-thane"><SiteIcon name="building" size={16} /> Browse PGs by location</Link>
        </div>
      </section>

      <Link className="back-directory" href={locationHref(listing.location)}><SiteIcon name="arrow" size={16} /> Back to {listing.location} PGs</Link>
      <div className="listing-mobile-cta" aria-label="Listing enquiry actions">
        <a href={"tel:" + (listing.phone || "9930007113")}><SiteIcon name="phone" size={15} /> Call</a>
        <a href={"https://wa.me/" + (listing.whatsapp || "919930007113").replace(/\D/g, "")} target="_blank" rel="noreferrer"><SiteIcon name="phone" size={15} /> WhatsApp</a>
        <EnquiryButton listingName={listing.name} location={listing.location} label="Enquire" className="listing-mobile-enquire" />
      </div>
    </section>
    <SiteFooter />
  </main>;
}
