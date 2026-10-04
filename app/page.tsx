"use client";

import { useMemo, useState } from "react";

const locations = [
  "Thane Station",
  "Wagle Estate",
  "Panchpakhadi",
  "Louiswadi",
  "Teen Hath Naka",
  "Naupada",
  "Khopat",
  "Majiwada",
  "Castle Mill",
  "Kapurbawdi",
  "Manpada",
  "Bhramand",
  "Kasarvadavali",
  "Hiranandani Estate",
  "Vartak Nagar",
  "Lokmanya Nagar",
  "Kolshet"
];

const searchTypes = ["All", "Location", "Workplace", "Keyword"];

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const [budget, setBudget] = useState("Any budget");

  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return locations;
    return locations.filter((location) => location.toLowerCase().includes(q));
  }, [query]);

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="/">PG<span>Thane</span></a>
        <nav>
          <a href="#locations">Locations</a>
          <a href="#how-it-works">How it works</a>
          <a href="#contact">Contact</a>
        </nav>
        <a className="header-cta" href="#search">Find a PG</a>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="eyebrow">THANE PG DIRECTORY</div>
          <h1>Find a PG in Thane that fits your <em>location</em> and workplace.</h1>
          <p className="hero-copy">
            Search PG, Paying Guest, Hostel and shared-room options by location,
            microlocation or workplace.
          </p>

          <form id="search" className="search-panel" action="/search">
            <div className="search-tabs">
              {searchTypes.map((item) => (
                <button
                  key={item}
                  className={type === item ? "active" : ""}
                  onClick={() => setType(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="search-row">
              <div className="search-field">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search location, workplace or keyword"
                  aria-label="Search PGs"
                />
              </div>

              <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                <option>Any budget</option>
                <option>Under ₹10,000</option>
                <option>₹10,000 – ₹15,000</option>
                <option>₹15,000 – ₹20,000</option>
                <option>₹20,000+</option>
              </select>

              <button className="search-button" type="submit">Search</button>
            </div>

            {query && (
              <div className="search-results">
                <div className="result-heading">
                  {matches.length} location{matches.length === 1 ? "" : "s"} matching “{query}”
                </div>
                {matches.map((location) => (
                  <a key={location} href={`/discover-pg-in-thane/pg-in-${location.toLowerCase().replaceAll(" ", "-")}-thane`}>
                    <span>📍</span>{location}
                  </a>
                ))}
                {!matches.length && <p>No matching location found.</p>}
              </div>
            )}
          </div>
        </form>
      </section>

      <section className="trust-strip">
        <div><strong>Location-first</strong><span>Search by where you live or work</span></div>
        <div><strong>Real listings</strong><span>No invented property information</span></div>
        <div><strong>Easy enquiry</strong><span>View details and contact directly</span></div>
      </section>

      <section id="locations" className="section">
        <div className="section-heading">
          <div>
            <div className="eyebrow">EXPLORE THANE</div>
            <h2>Popular PG locations</h2>
          </div>
          <p>Choose a location to explore its microlocations and nearby workplaces.</p>
        </div>

        <div className="location-grid">
          {locations.map((location) => (
            <a
              className="location-card"
              key={location}
              href={`/discover-pg-in-thane/pg-in-${location.toLowerCase().replaceAll(" ", "-")}-thane`}
            >
              <span className="pin">📍</span>
              <div>
                <h3>PG in {location}</h3>
                <p>PG · Paying Guest · Hostel · Shared Rooms</p>
              </div>
              <span className="arrow">→</span>
            </a>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="process section">
        <div className="eyebrow">HOW IT WORKS</div>
        <h2>Search around the place that matters to you.</h2>
        <div className="steps">
          <article><b>01</b><h3>Choose a location</h3><p>Start with a Thane neighbourhood or station.</p></article>
          <article><b>02</b><h3>Refine by workplace</h3><p>Find accommodation around the office or business park you need.</p></article>
          <article><b>03</b><h3>Compare real listings</h3><p>Review verified information before contacting the property.</p></article>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div>
          <div className="eyebrow">NEED HELP?</div>
          <h2>Looking for a PG in a specific part of Thane?</h2>
          <p>Tell us your location or workplace and we can help you narrow the search.</p>
        </div>
        <a className="contact-button" href="tel:9892336705">Call 9892336705</a>
      </section>

      <footer>
        <div className="brand">PG<span>Thane</span></div>
        <p>PG · Paying Guest · Hostel · Shared Rooms in Thane</p>
        <small>© {new Date().getFullYear()} PG Thane</small>
      </footer>
    </main>
  );
}