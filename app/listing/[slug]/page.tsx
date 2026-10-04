import { notFound } from "next/navigation";
import { listings } from "@/data/catalog";
import ListingCard from "@/components/ListingCard";

export default async function ListingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const listing = listings.find((x) => x.slug === slug);
  if (!listing) notFound();

  return (
    <main>
      <header className="topbar"><a className="brand" href="/">PG<span>Thane</span></a><a className="header-cta" href="tel:9892336705">Call</a></header>
      <section className="section"><div className="eyebrow">PG LISTING</div><h1>{listing.name}</h1><ListingCard listing={listing} /></section>
    </main>
  );
}