import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { listings } from "@/data/catalog";
import ListingCard from "@/components/ListingCard";
import Link from "next/link";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const listing = listings.find(x => x.slug === slug && x.published === true && !x.photoOnly);
  if (!listing) return { title: "PG Listing | PG Thane" };
  return {
    title: listing.seoTitle || (listing.name + " | PG in " + listing.location + ", Thane"),
    description: listing.seoDescription || [listing.type, listing.microlocation, listing.location, listing.amenities?.join(", ")].filter(Boolean).join(" · "),
    alternates: { canonical: "https://www.pgthane.com/listing/" + listing.slug }
  };
}

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = listings.find(x => x.slug === slug && x.published === true && !x.photoOnly);
  if (!listing) notFound();

  return <main>
    <header className="topbar"><Link className="brand" href="/">PG<span>Thane</span></Link><nav><Link href="/#locations">Locations</Link><Link href="/search">Search</Link></nav><a className="header-cta" href="tel:9892336705">Call</a></header>
    <section className="section listing-detail">
      <div className="breadcrumb"><Link href="/">Home</Link><span>/</span><Link href={"/discover-pg-in-thane/pg-in-" + listing.location.toLowerCase().replaceAll(" ", "-") + "-thane"}>{listing.location}</Link><span>/</span><strong>{listing.name}</strong></div>
      <div className="eyebrow">PG LISTING</div>
      <h1>{listing.name}</h1>
      <p className="listing-detail-intro">{listing.type} in {listing.microlocation}, {listing.location}, Thane.</p>
      <ListingCard listing={listing} />
      <Link className="back-directory" href={"/discover-pg-in-thane/pg-in-" + listing.location.toLowerCase().replaceAll(" ", "-") + "-thane"}>← Back to {listing.location} PGs</Link>
    </section>
  </main>;
}