import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listings } from "@/data/catalog";
import Link from "next/link";

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
    <header className="topbar"><Link className="brand" href="/">PG<span>Thane</span></Link><nav><Link href="/#locations">Locations</Link><Link href="/search">Search</Link></nav><a className="header-cta" href="tel:9892336705">Call</a></header>

    <section className="section listing-detail">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href="/discover-pg-in-thane">PG in Thane</Link><span>/</span><strong>{listing.name}</strong></div>

      <div className="listing-detail-head">
        <div>
          <div className="eyebrow">{listing.type.toUpperCase()} LISTING</div>
          <h1>{listing.name}</h1>
          <p className="listing-location large">📍 {listing.microlocation}, {listing.location}, Thane</p>
        </div>
        <div className="listing-detail-actions">
          {listing.phone && <a className="header-cta" href={"tel:" + listing.phone}>Call</a>}
          {listing.whatsapp && <a className="outline-cta" href={"https://wa.me/" + listing.whatsapp}>WhatsApp</a>}
        </div>
      </div>

      <div className="listing-detail-grid">
        <div>
          <div className="listing-gallery">
            <div className="listing-main-photo">
              {listing.photos[0] ? <img src={listing.photos[0]} alt={listing.imageAlt || listing.name} /> : <div className="photo-placeholder">Photo pending</div>}
              {listing.verified && <span className="verified-badge">✓ Verified Listing</span>}
            </div>
            {listing.photos.length > 1 && <div className="listing-thumbs">{listing.photos.map((photo, i) => <img key={photo} src={photo} alt={(listing.imageAlt || listing.name) + " photo " + (i + 1)} />)}</div>}
          </div>
        </div>

        <aside className="listing-quick">
          <div className="eyebrow">QUICK DETAILS</div>
          {listing.priceFrom && <div className="quick-price">From ₹{listing.priceFrom.toLocaleString("en-IN")} / month</div>}
          <dl>
            <div><dt>Location</dt><dd>{listing.location}, Thane</dd></div>
            {listing.microlocation && <div><dt>Microlocation</dt><dd>{listing.microlocation}</dd></div>}
            {listing.sharing?.length && <div><dt>Sharing</dt><dd>{listing.sharing.join(" / ")}</dd></div>}
            {listing.roomType && <div><dt>Room type</dt><dd>{listing.roomType}</dd></div>}
            {listing.food && <div><dt>Food</dt><dd>{listing.food}</dd></div>}
            {listing.gender && <div><dt>Gender</dt><dd>{listing.gender}</dd></div>}
            {listing.availability && <div><dt>Availability</dt><dd>{listing.availability}</dd></div>}
          </dl>
          {listing.amenities?.length ? <div className="quick-amenities"><strong>Amenities</strong><div>{listing.amenities.map(a => <span key={a}>{a}</span>)}</div></div> : null}
          {listing.phone && <a className="detail-enquire" href={"tel:" + listing.phone}>Enquire Now</a>}
        </aside>
      </div>

      {listing.description && <section className="listing-description detail-description"><div className="eyebrow">ABOUT THIS PG</div><p>{listing.description}</p></section>}

      {listing.workplace?.length ? <section className="listing-workplaces"><div className="eyebrow">NEARBY WORKPLACES</div><div className="workplace-tags">{listing.workplace.map(x => <span key={x}>🏢 {x}</span>)}</div></section> : null}

      <Link className="back-directory" href={locationHref(listing.location)}>← Back to {listing.location} PGs</Link>
    </section>
  </main>;
}
