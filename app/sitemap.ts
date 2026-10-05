import type { MetadataRoute } from "next";
import { listings, verifiedWorkplaceIndex } from "@/data/catalog";

export const dynamic = "force-static";

const locations = [
  "pg-in-wagle-estate-thane","pg-in-majiwada-thane","pg-in-kolshet-thane","pg-in-hiranandani-estate-thane",
  "pg-near-railway-station-thane","pg-in-panchpakhadi-thane","pg-in-louiswadi-thane","pg-in-teen-hath-naka-thane",
  "pg-in-naupada-thane","pg-in-khopat-thane","pg-in-castle-mill-thane","pg-in-kapurbawdi-thane",
  "pg-in-manpada-thane","pg-in-bhramand-thane","pg-in-kasarvadavali-thane","pg-in-vartak-nagar-thane","pg-in-balkum-thane","pg-in-ghodbunder-road-thane",
  "pg-in-lokmanya-nagar-thane","pg-in-vasant-vihar-thane","pg-in-pokhran-road-thane"
];

export default function sitemap(): MetadataRoute.Sitemap {
  const locationUrls = locations.map(slug => ({
    url: "https://www.pgthane.com/discover-pg-in-thane/" + slug,
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));
  const workplaceUrls = verifiedWorkplaceIndex.map(workplace => ({ url: "https://www.pgthane.com/discover-pg-in-thane/workplace/" + workplace.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""), changeFrequency: "weekly" as const, priority: 0.75 }));
  const listingUrls = listings
    .filter(listing => listing.published === true && !listing.photoOnly)
    .map(listing => ({
      url: "https://www.pgthane.com/listing/" + listing.slug,
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));
  return [
    { url: "https://www.pgthane.com/", changeFrequency: "weekly", priority: 1 },
    { url: "https://www.pgthane.com/discover-pg-in-thane", changeFrequency: "weekly", priority: 0.9 },
    ...locationUrls,
    ...workplaceUrls,
    ...listingUrls
  ];
}
