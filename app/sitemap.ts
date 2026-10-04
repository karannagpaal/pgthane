import type { MetadataRoute } from "next";

const locations = ["wagle-estate","majiwada","kolshet","hiranandani-estate","thane-station","panchpakhadi","louiswadi","teen-hath-naka","naupada","khopat","castle-mill","kapurbawdi","manpada","bhramand","kasarvadavali","vartak-nagar","lokmanya-nagar"];

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: "https://www.pgthane.com/", changeFrequency: "weekly", priority: 1 }, ...locations.map((location) => ({ url: "https://www.pgthane.com/discover-pg-in-thane/pg-in-" + location + "-thane", changeFrequency: "weekly" as const, priority: 0.8 }))];
}