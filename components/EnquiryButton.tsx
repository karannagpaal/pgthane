"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { listings } from "@/data/catalog";

type Mode = "reserve" | "visit";

type EnquiryButtonProps = {
  listingName?: string;
  location?: string;
  label?: string;
  className?: string;
};

const publicListings = listings.filter((listing) => listing.published === true && !listing.photoOnly);

export default function EnquiryButton({
  listingName,
  location,
  label = "Enquire Now",
  className = "enquiry-button",
}: EnquiryButtonProps) {
  const [open, setOpen] = useState(false);
  const [mode, setMode] = useState<Mode>("reserve");
  const [submitted, setSubmitted] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const [property, setProperty] = useState(listingName || "");
  const [preferredLocation, setPreferredLocation] = useState(location || "");
  const [sharing, setSharing] = useState("");
  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [moveInDate, setMoveInDate] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [visitSlot, setVisitSlot] = useState("");
  const [acPreference, setAcPreference] = useState("");
  const [requests, setRequests] = useState("");

  const today = useMemo(() => {\n    const now = new Date();\n    const offset = now.getTimezoneOffset();\n    return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);\n  }, []);

  useEffect(() => {
    if (!open) return;
    setSubmitted(false);
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") resetAndClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  function resetAndClose() {
    setOpen(false);
    setSubmitted(false);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const lines = [
      "Hello PGThane.com, I want to enquire about a PG.",
      "",
      "Enquiry type: " + (mode === "reserve" ? "Room / availability enquiry" : "Schedule a physical visit"),
      property ? "PG / Property: " + property : "",
      preferredLocation ? "Location: " + preferredLocation : "",
      sharing ? "Sharing / room preference: " + sharing : "",
      "Name: " + name,
      "WhatsApp: " + whatsapp,
      email ? "Email: " + email : "",
      company ? "College / Company: " + company : "",
      mode === "reserve" ? "Target move-in date: " + (moveInDate || "Not specified") : "Preferred visit date: " + (visitDate || "Not specified"),
      mode === "visit" ? "Visit time slot: " + (visitSlot || "Not specified") : "AC preference: " + (acPreference || "Not specified"),
      requests ? "Special requests: " + requests : "",
      "",
      "Please share current verified availability and next steps."
    ].filter(Boolean);

    const url = "https://wa.me/919930007113?text=" + encodeURIComponent(lines.join("\n"));
    window.open(url, "_blank", "noopener,noreferrer");
    setSubmitted(true);
  }

  const title = mode === "reserve" ? "Enquire About a PG" : "Schedule a Free Physical Visit";

  return (
    <>
      <button type="button" className={className} onClick={() => setOpen(true)}>{label}</button>

      {open && (
        <div className="enquiry-overlay" role="presentation" onMouseDown={(e) => { if (e.target === e.currentTarget) resetAndClose(); }}>
          <section className="enquiry-modal" role="dialog" aria-modal="true" aria-labelledby="enquiry-title">
            <button type="button" className="enquiry-close" aria-label="Close enquiry form" onClick={resetAndClose}>×</button>

            <div className="enquiry-header">
              <div className="eyebrow">PGTHANE.COM ENQUIRY</div>
              <h2 id="enquiry-title">{title}</h2>
              <p>Share your requirements and we’ll connect with you on WhatsApp to confirm current availability.</p>
            </div>

            <div className="enquiry-tabs" role="tablist" aria-label="Enquiry type">
              <button type="button" className={mode === "visit" ? "active" : ""} onClick={() => setMode("visit")}>Schedule Free Visit</button>
              <button type="button" className={mode === "reserve" ? "active" : ""} onClick={() => setMode("reserve")}>Room Enquiry</button>
            </div>

            {submitted ? (
              <div className="enquiry-success">
                <strong>WhatsApp opened.</strong>
                <p>Your enquiry details are ready to send to <b>9930007113</b>. Availability is confirmed only after the property is checked.</p>
                <button type="button" className="primary-button" onClick={resetAndClose}>Done</button>
              </div>
            ) : (
              <form className="enquiry-form" onSubmit={submit}>
                <div className="enquiry-grid">
                  <label>
                    PG / Property
                    <select value={property} onChange={(e) => setProperty(e.target.value)}>
                      <option value="">Help me choose a PG</option>
                      {publicListings.map((item) => <option key={item.id} value={item.name}>{item.name}</option>)}
                    </select>
                  </label>

                  <label>
                    Preferred location
                    <select value={preferredLocation} onChange={(e) => setPreferredLocation(e.target.value)}>
                      <option value="">Any location in Thane</option>
                      {Array.from(new Set(publicListings.map((item) => item.location))).map((item) => <option key={item} value={item}>{item}</option>)}
                    </select>
                  </label>

                  <label>
                    Sharing / room preference
                    <select value={sharing} onChange={(e) => setSharing(e.target.value)} required>
                      <option value="">Select preference</option>
                      <option>Single Room</option>
                      <option>Double Sharing</option>
                      <option>Triple Sharing</option>
                      <option>Any sharing</option>
                    </select>
                  </label>

                  <label>
                    Full name
                    <input value={name} onChange={(e) => setName(e.target.value)} required placeholder="Your full name" />
                  </label>

                  <label>
                    WhatsApp number
                    <input value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} required inputMode="tel" placeholder="10-digit WhatsApp number" pattern="[0-9 +()-]{10,}" />
                  </label>

                  <label>
                    Email
                    <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" />
                  </label>

                  <label>
                    College / Company
                    <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Optional" />
                  </label>

                  {mode === "reserve" ? (
                    <>
                      <label>
                        Target move-in date
                        <input value={moveInDate} onChange={(e) => setMoveInDate(e.target.value)} type="date" min={today} />
                      </label>
                      <label>
                        Room AC preference
                        <select value={acPreference} onChange={(e) => setAcPreference(e.target.value)}>
                          <option value="">Select preference</option>
                          <option>AC preferred</option>
                          <option>Non-AC preferred</option>
                          <option>Either is fine</option>
                        </select>
                      </label>
                    </>
                  ) : (
                    <>
                      <label>
                        Preferred visit date
                        <input value={visitDate} onChange={(e) => setVisitDate(e.target.value)} type="date" min={today} required />
                      </label>
                      <label>
                        Visit time slot
                        <select value={visitSlot} onChange={(e) => setVisitSlot(e.target.value)} required>
                          <option value="">Select a time</option>
                          <option>10:00 AM – 12:00 PM</option>
                          <option>12:00 PM – 2:00 PM</option>
                          <option>2:00 PM – 4:00 PM</option>
                          <option>4:00 PM – 6:00 PM</option>
                          <option>6:00 PM – 8:00 PM</option>
                        </select>
                      </label>
                    </>
                  )}

                  <label className="enquiry-full">
                    Special requests
                    <textarea value={requests} onChange={(e) => setRequests(e.target.value)} rows={3} placeholder="Food, move-in timing, preferred area, questions, etc." />
                  </label>
                </div>

                <p className="enquiry-note">No online payment is taken here. This form opens WhatsApp with your enquiry details for confirmation.</p>
                <button type="submit" className="enquiry-submit">
                  {mode === "reserve" ? "Submit Enquiry & Connect on WhatsApp" : "Confirm Visit & Open WhatsApp"}
                </button>
              </form>
            )}
          </section>
        </div>
      )}
    </>
  );
}
