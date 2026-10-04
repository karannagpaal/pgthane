import type { MetadataRoute } from "next";
import { listings } from "@/data/catalog";

const locations = ["wagle-estate","majiwada","kolshet","hiranandani-estate","thane-station","panchpakhadi","louiswadi","teen-hath-naka","naupada","khopat","castle-mill","kapurbawdi","manpada","bhramand","kasarvadavali","vartak-nagar","lokmanya-nagar","pg-near-railway-station-thane","pg-in-vasant-vihar-thane","pg-in-pokhran-road-thane"];

export default function sitemap(): MetadataRoute.Sitemap {
  const locationUrls = locations.map(location => ({
    url: "https://www.pgthane.com/discover-pg-in-thane/pg-in-" + location + "-thane",
    changeFrequency: "weekly" as const,
    priority: 0.8
  }));
  const listingUrls = listings.filter(listing => listing.published === true && !listing.photoOnly).map(listing => ({
    url: "https://www.pgthane.com/listing/" + listing.slug,
    changeFrequency: "daily" as const,
    priority: 0.7
  }));
  return [{ url: "https://www.pgthane.com/", changeFrequency: "weekly", priority: 1 }, { url: "https://www.pgthane.com/discover-pg-in-thane", changeFrequency: "weekly", priority: 0.9 }, ...locationUrls, changeFrequency: "weekly", priority: 1 }, ...locationUrls, ...listingUrls];
}