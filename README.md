# PG Thane

Next.js foundation for pgthane.com.

## Direction
- PG / Paying Guest / Hostel / Shared Rooms directory
- Search by location, microlocation, workplace and keyword
- Real inventory only; no fabricated property names, prices or availability
- Existing indexed Google Sites URLs should be preserved or redirected deliberately
- SEO-first location and workplace architecture
- Mobile-first responsive UI

## Development
```
npm install
npm run dev
```

The catalog contains photo-backed draft records only. Draft/photo-only records are excluded from published search results, listing pages, and the sitemap until property name, location and commercial details are verified. Do not publish fabricated property names, locations, prices, availability, reviews or amenities.

## Photo inventory
The 41 source photos belong under `public/inventory/` so Next.js can serve them at `/inventory/...`. The catalog intentionally keeps all 41 records unpublished/photo-only until the underlying property data is verified.

The repository connector currently supports Git blobs as text/base64 but does not provide a local-file upload bridge or release-asset upload. Do not replace the real photos with placeholders. When a binary upload bridge is available, upload the original 41 files into `public/inventory/` and verify the resulting paths before publishing any listing.

## Production validation
The `main` branch is the production source of truth; validate the Vercel deployment after each production change.

## Validation
The repository CI workflow runs `npm run typecheck` and `npm run build` on pushes and pull requests.
