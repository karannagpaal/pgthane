import type { Metadata } from "next";

const destination = "/discover-pg-in-thane/pg-near-railway-station-thane/";

export const metadata: Metadata = {
  title: "PG Near Thane Railway Station | PG Thane",
  robots: { index: false, follow: true },
  alternates: { canonical: destination }
};

export default function LegacyStationRedirectPage() {
  return (
    <main>
      <meta httpEquiv="refresh" content={`0;url=${destination}`} />
      <section className="section">
        <h1>PG Near Thane Railway Station</h1>
        <p>Redirecting you to the current Thane Railway Station PG page.</p>
        <p><a href={destination}>Continue to PG Near Thane Railway Station</a></p>
      </section>
    </main>
  );
}
