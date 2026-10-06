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

      <div className="listing-detail-head">
        <div>
          <div className="eyebrow">{listing.type.toUpperCase()} LISTING</div>
          <h1>{listing.name}</h1>
          <p className="listing-location large">📍 {listing.microlocation && listing.microlocation !== listing.location ? listing.microlocation + ", " + listing.location + ", Thane" : listing.location + ", Thane"}</p>
        </div>
        <div className="listing-detail-actions">
          <a className="header-cta" href="tel:9930007113">Call</a><a className="outline-cta" href="https://wa.me/919930007113">WhatsApp</a>
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
          {listing.priceFrom && <div className="quick-price"><span>From</span><strong>₹{listing.priceFrom.toLocaleString("en-IN")} <em>/ month</em></strong></div>}
          <dl className="quick-details-list">
            <div><span className="quick-detail-icon"><SiteIcon name="pin" size={20} /></span><dt>Location</dt><dd>{listing.location}, Thane</dd></div>
            {listing.microlocation && <div><span className="quick-detail-icon"><SiteIcon name="building" size={20} /></span><dt>Microlocation</dt><dd>{listing.microlocation}</dd></div>}
            {listing.sharing?.length && <div><span className="quick-detail-icon"><SiteIcon name="sofa" size={20} /></span><dt>Sharing</dt><dd>{listing.sharing.join(" / ")}</dd></div>}
            {listing.roomType && <div><span className="quick-detail-icon"><SiteIcon name="home" size={20} /></span><dt>Room type</dt><dd>{listing.roomType}</dd></div>}
            {listing.food && <div><span className="quick-detail-icon"><SiteIcon name="home" size={20} /></span><dt>Food</dt><dd>{listing.food}</dd></div>}
            {listing.gender && <div><span className="quick-detail-icon"><SiteIcon name={listing.gender === "Female" ? "female" : "male"} size={20} /></span><dt>Gender</dt><dd>{listing.gender === "Unisex" ? "Male & Female" : listing.gender}</dd></div>}
            {listing.availability && <div><span className="quick-detail-icon"><SiteIcon name="check" size={20} /></span><dt>Availability</dt><dd>{listing.availability}</dd></div>}
          </dl>
          {listing.amenities?.length ? <div className="quick-amenities"><strong>Amenities</strong><div>{listing.amenities.map(a => <span key={a}>{a}</span>)}</div></div> : null}
          {listing.phone && <div className="listing-contact-detail"><strong>PGThane Enquiry</strong><a className="listing-contact-number" href={"tel:" + listing.phone}>{listing.phone}</a></div>}
          <EnquiryButton listingName={listing.name} location={listing.location} label="Enquire Now" className="detail-enquire" />
        </aside>
      </div>

      {listing.description && <section className="listing-description detail-description"><div className="eyebrow">ABOUT THIS PG</div><p>{listing.description}</p></section>}

      {listing.workplace?.length ? <section className="listing-workplaces"><div className="eyebrow">WORKPLACE SEARCH</div><div className="workplace-tags">{listing.workplace.map(x => <Link key={x} href={"/search?q=" + encodeURIComponent(x) + "&type=Workplace"}><SiteIcon name="building" size={16} /> {x}</Link>)}</div></section> : null}

      <section className="listing-related-links">
        <div className="eyebrow">EXPLORE MORE IN THANE</div>
        <div className="workplace-tags">
          <Link href={locationHref(listing.location)}><SiteIcon name="pin" size={16} /> More PGs in {listing.location}</Link>
          <Link href="/discover-pg-in-thane"><SiteIcon name="building" size={16} /> Browse PGs by location</Link>
          <Link href={"/search?q=" + encodeURIComponent(listing.microlocation) + "&type=Microlocation"}><SiteIcon name="search" size={16} /> Search {listing.microlocation}</Link>
        </div>
      </section>

      <Link className="back-directory" href={locationHref(listing.location)}><SiteIcon name="arrow" size={16} /> Back to {listing.location} PGs</Link>
      <div className="listing-mobile-cta" aria-label="Listing enquiry actions">
        <a href="tel:9930007113">Call</a>
        <a href="https://wa.me/919930007113">WhatsApp</a>
        <EnquiryButton listingName={listing.name} location={listing.location} label="Enquire" className="listing-mobile-enquire" />
      </div>
    </section>
    <SiteFooter />
  </main>;
}
