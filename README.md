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

## Validation
The repository CI workflow runs `npm run typecheck` and `npm run build` on pushes and pull requests.