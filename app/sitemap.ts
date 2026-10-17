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
  const locationNames: Record<string, string> = {
    "pg-in-wagle-estate-thane": "Wagle Estate",
    "pg-in-majiwada-thane": "Majiwada",
    "pg-in-kolshet-thane": "Kolshet",
    "pg-in-hiranandani-estate-thane": "Hiranandani Estate",
    "pg-near-railway-station-thane": "Thane Station",
    "pg-in-panchpakhadi-thane": "Panchpakhadi",
    "pg-in-louiswadi-thane": "Louiswadi",
    "pg-in-teen-hath-naka-thane": "Teen Hath Naka",
    "pg-in-naupada-thane": "Naupada",
    "pg-in-khopat-thane": "Khopat",
    "pg-in-castle-mill-thane": "Castle Mill",
    "pg-in-kapurbawdi-thane": "Kapurbawdi",
    "pg-in-manpada-thane": "Manpada",
    "pg-in-bhramand-thane": "Bhramand",
    "pg-in-kasarvadavali-thane": "Kasarvadavali",
    "pg-in-vartak-nagar-thane": "Vartak Nagar",
    "pg-in-balkum-thane": "Balkum",
    "pg-in-ghodbunder-road-thane": "Ghodbunder Road",
    "pg-in-lokmanya-nagar-thane": "Lokmanya Nagar",
    "pg-in-vasant-vihar-thane": "Vasant Vihar",
    "pg-in-pokhran-road-thane": "Pokhran Road"
  };
  const hasVerifiedLocation = (name: string) => listings.some(listing =>
    listing.published === true && !listing.photoOnly && listing.verified === true &&
    listing.location.toLowerCase() === name.toLowerCase()
  );
  const locationUrls = locations
    .filter(slug => locationNames[slug] && hasVerifiedLocation(locationNames[slug]))
    .map(slug => ({
      url: "https://www.pgthane.com/discover-pg-in-thane/" + slug + "/",
      changeFrequency: "weekly" as const,
      priority: 0.8
    }));
  const workplaceUrls = verifiedWorkplaceIndex
    .filter(workplace => listings.some(listing =>
      listing.published === true && !listing.photoOnly && listing.verified === true &&
      listing.workplace.some(name => name.toLowerCase() === workplace.name.toLowerCase())
    ))
    .map(workplace => ({ url: "https://www.pgthane.com/discover-pg-in-thane/workplace/" + workplace.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") + "/", changeFrequency: "weekly" as const, priority: 0.75 }));
  const listingUrls = listings
    .filter(listing => listing.published === true && !listing.photoOnly && listing.verified === true)
    .map(listing => ({
      url: "https://www.pgthane.com/listing/" + listing.slug + "/",
      changeFrequency: "weekly" as const,
      priority: 0.7
    }));
  return [
    { url: "https://www.pgthane.com/", changeFrequency: "weekly", priority: 1 },
    { url: "https://www.pgthane.com/discover-pg-in-thane/", changeFrequency: "weekly", priority: 0.9 },
    ...locationUrls,
    ...workplaceUrls,
    ...listingUrls
  ];
}
