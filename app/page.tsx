"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { listings, verifiedMicrolocationIndex, verifiedWorkplaceIndex } from "@/data/catalog";

const locations = [
  "Thane Station","Wagle Estate","Panchpakhadi","Louiswadi","Teen Hath Naka",
  "Naupada","Khopat","Majiwada","Castle Mill","Kapurbawdi","Manpada","Bhramand",
  "Kasarvadavali","Hiranandani Estate","Vartak Nagar","Lokmanya Nagar","Kolshet",
  "Vasant Vihar","Pokhran Road"
];

const searchTypes = ["All", "Location", "Microlocation", "Workplace", "Keyword"] as const;
type SearchType = typeof searchTypes[number];

function locationHref(value: string) {
  if (value === "Thane Station") return "/discover-pg-in-thane/pg-near-railway-station-thane";
  return "/discover-pg-in-thane/pg-in-" + value.toLowerCase().replaceAll(" ", "-") + "-thane";
}

function withBudget(href: string, budget: string) {
  if (budget === "Any budget") return href;
  return href + (href.includes("?") ? "&" : "?") + "budget=" + encodeURIComponent(budget);
}

export default function HomePage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("All");
  const [budget, setBudget] = useState("Any budget");
  const [focused, setFocused] = useState(false);
  const [activeSuggestion, setActiveSuggestion] = useState(-1);

  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const result: { label: string; meta: string; href?: string }[] = [];

    if (type === "All" || type === "Location" || type === "Keyword") {
      locations.filter(x => x.toLowerCase().includes(q)).slice(0, 6).forEach(x =>
        result.push({ label: x, meta: "Location", href: withBudget(locationHref(x), budget) })
      );
    }

    if (type === "All" || type === "Workplace" || type === "Keyword") {
      verifiedWorkplaceIndex.filter(x => x.name.toLowerCase().includes(q)).slice(0, 6).forEach(x =>
        result.push({ label: x.name, meta: x.kind + " · " + x.location, href: withBudget("/search?q=" + encodeURIComponent(x.name) + "&type=Workplace", budget) })
      );
    }

    if (type === "All" || type === "Microlocation" || type === "Keyword") {
      verifiedMicrolocationIndex.filter(x => x.name.toLowerCase().includes(q)).slice(0, 4).forEach(x =>
        result.push({ label: x.name, meta: "Microlocation · " + x.location, href: withBudget("/search?q=" + encodeURIComponent(x.name) + "&type=Microlocation", budget) })
      );
    }

    if (type === "All" || type === "Keyword") {
      listings
        .filter(x => x.published === true && !x.photoOnly)
        .filter(x => [x.name, x.location, x.microlocation, x.type, ...(x.workplace || []), ...(x.amenities || [])].join(" ").toLowerCase().includes(q))
        .slice(0, 6)
        .forEach(x =>
          result.push({ label: x.name, meta: "PG · " + x.location, href: withBudget("/listing/" + x.slug, budget) })
        );
    }

    const seen = new Set<string>();
    const ql = q;
    return result
      .filter(item => {
        const key = item.label.toLowerCase() + "|" + item.meta.toLowerCase();
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .sort((a, b) => {
        const ap = a.label.toLowerCase().startsWith(ql) ? 0 : 1;
        const bp = b.label.toLowerCase().startsWith(ql) ? 0 : 1;
        return ap - bp || a.label.localeCompare(b.label);
      })
      .slice(0, 8);
  }, [query, type, budget]);

  useEffect(() => { setActiveSuggestion(-1); }, [query, type, budget]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (type !== "All") params.set("type", type);
    if (budget !== "Any budget") params.set("budget", budget);
    window.location.href = "/search" + (params.toString() ? "?" + params.toString() : "");
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="/" aria-label="PGThane.com home"><img src="/logo.png" alt="PGThane.com" className="brand-logo" width={188} height={58} /></a>
        <nav><a href="#locations">Locations</a><a href="#how-it-works">How it works</a><a href="#contact">Contact</a></nav>
        <a className="header-cta" href="#search">Find a PG</a>
      </header>

      <section className="hero">
        <div className="hero-inner">
          <div className="homepage-logo-wrap"><img src="/homepage-logo.png" alt="PGThane.com" className="homepage-logo" width={112} height={112} /></div>
          <div className="eyebrow">THANE PG DIRECTORY</div>
          <h1>Find a PG in Thane that fits your <em>location</em> and workplace.</h1>
          <p className="hero-copy">Search PG, Paying Guest, Hostel and shared-room options by location, microlocation or workplace.</p>

          <form id="search" className="search-panel" onSubmit={submit} role="search" aria-label="Search PGs in Thane">
            <div className="search-tabs" role="tablist" aria-label="Search category">
              {searchTypes.map(item => (
                <button
                  key={item}
                  type="button"
                  role="tab"
                  aria-selected={type === item}
                  className={type === item ? "active" : ""}
                  onClick={() => setType(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="search-row">
              <div className="search-field search-field-wrap">
                <span>⌕</span>
                <input
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 150)}
                  onKeyDown={e => {
                    if (!suggestions.length) return;
                    if (e.key === "ArrowDown") { e.preventDefault(); setActiveSuggestion(i => (i + 1) % suggestions.length); }
                    else if (e.key === "ArrowUp") { e.preventDefault(); setActiveSuggestion(i => (i - 1 + suggestions.length) % suggestions.length); }
                    else if (e.key === "Enter" && activeSuggestion >= 0) {
                      e.preventDefault();
                      const item = suggestions[activeSuggestion];
                      if (item.href) window.location.href = item.href;
                      else { setQuery(item.label); setFocused(true); setActiveSuggestion(-1); }
                    } else if (e.key === "Escape") { setFocused(false); setActiveSuggestion(-1); }
                  }}
                  aria-activedescendant={activeSuggestion >= 0 ? "suggestion-" + activeSuggestion : undefined}
                  placeholder={type === "Location" ? "Search a Thane location" : type === "Microlocation" ? "Search a microlocation" : type === "Workplace" ? "Search a workplace or business park" : type === "Keyword" ? "Search by PG keyword" : "Search location, workplace or keyword"}
                  inputMode="search"
                  aria-controls="search-suggestions" aria-label="Search PGs"
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    className="search-clear"
                    aria-label="Clear search"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => { setQuery(""); setFocused(true); }}
                  >×</button>
                )}
                {focused && query.trim() && (
                  <div id="search-suggestions" className="autocomplete" role="listbox" aria-label="Search suggestions">
                    {suggestions.map((item, i) => item.href ? (
                      <a id={"suggestion-" + i} key={item.label + i} href={item.href} className="autocomplete-item" role="option" aria-selected={activeSuggestion === i}>
                        <span>📍</span><div><strong>{item.label}</strong><small>{item.meta}</small></div>
                      </a>
                    ) : (
                      <button id={"suggestion-" + i} type="button" key={item.label + i} className="autocomplete-item" role="option" aria-selected={activeSuggestion === i} onMouseDown={() => { setQuery(item.label); setFocused(true); setActiveSuggestion(-1); }}>
                        <span>{item.meta.startsWith("Microlocation") ? "📍" : "🏢"}</span><div><strong>{item.label}</strong><small>{item.meta}</small></div>
                      </button>
                    ))}
                    {!suggestions.length && <div className="autocomplete-empty">No matching location, microlocation or workplace.</div>}
                  </div>
                )}
              </div>

              <select value={budget} onChange={e => setBudget(e.target.value)} aria-label="Budget">
                <option>Any budget</option><option>Under ₹10,000</option><option>₹10,000 – ₹15,000</option><option>₹15,000 – ₹20,000</option><option>₹20,000+</option>
              </select>
              <button className="search-button" type="submit">Search</button>
            </div>
          </form>
        </div>
      </section>

      <section className="trust-strip">
        <div><strong>Location-first</strong><span>Search by where you live or work</span></div>
        <div><strong>Verification-first</strong><span>Real property information is published only after verification</span></div>
        <div><strong>Easy enquiry</strong><span>Contact for current verified availability</span></div>
      </section>

      <section id="locations" className="section">
        <div className="section-heading"><div><div className="eyebrow">EXPLORE THANE</div><h2>Popular PG locations</h2></div><p>Choose a location to explore its microlocations and nearby workplaces.</p></div>
        <div className="location-grid">
          {locations.map(location => <a className="location-card" key={location} href={withBudget(locationHref(location), budget)}><span className="pin">📍</span><div><h3>PG in {location}</h3><p>PG · Paying Guest · Hostel · Shared Rooms</p></div><span className="arrow">→</span></a>)}
        </div>
      </section>

      <section id="how-it-works" className="process section">
        <div className="eyebrow">HOW IT WORKS</div><h2>Search around the place that matters to you.</h2>
        <div className="steps"><article><b>01</b><h3>Choose a location</h3><p>Start with a Thane neighbourhood or station.</p></article><article><b>02</b><h3>Refine by workplace</h3><p>Find accommodation around the office or business park you need.</p></article><article><b>03</b><h3>Compare real listings</h3><p>Review verified information before contacting the property.</p></article></div>
      </section>

      <section id="contact" className="contact-section"><div><div className="eyebrow">NEED HELP?</div><h2>Looking for a PG in a specific part of Thane?</h2><p>Tell us your location or workplace and we can help you narrow the search.</p></div><a className="contact-button" href="tel:9892336705">Call 9892336705</a></section>
      <footer><div className="footer-logo"><img src="/logo.png" alt="PGThane.com" className="footer-brand-logo" width={170} height={52} /></div><p>PG · Paying Guest · Hostel · Shared Rooms in Thane</p><small>© {new Date().getFullYear()} PG Thane</small></footer>
    </main>
  );
}
