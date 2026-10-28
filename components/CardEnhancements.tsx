"use client";

import { useState } from "react";

type CardEnhancementsProps = {
  listingName: string;
  listingUrl: string;
  latitude?: number;
  longitude?: number;
};

function Icon({ name, size = 16 }: { name: "single" | "double" | "triple" | "share" | "copy" | "pin" | "whatsapp"; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const, "aria-hidden": true as const };
  const paths = {
    single: <><rect x="4" y="4" width="16" height="16" rx="1.5" /><path d="M4 9h16M7 6.5h3M7 11.5h3" /></>,
    double: <><rect x="3" y="5" width="18" height="14" rx="1.5" /><path d="M3 10h18M6 7.5h4M14 7.5h4M6 12.5h4M14 12.5h4" /></>,
    triple: <><circle cx="7" cy="8" r="2.5" /><circle cx="17" cy="8" r="2.5" /><circle cx="12" cy="6" r="2.5" /><path d="M2.5 19v-2a4.5 4.5 0 0 1 7.1-3.7M21.5 19v-2a4.5 4.5 0 0 0-7.1-3.7M7.5 20v-2a4.5 4.5 0 0 1 9 0v2" /></>,
    share: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><path d="m8.7 10.6 6.6-4.2M8.7 13.4l6.6 4.2" /></>,
    copy: <><rect x="8" y="8" width="12" height="12" rx="2" /><path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" /></>,
    pin: <><path d="M20 10.5c0 5.1-8 11-8 11s-8-5.9-8-11a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10.5" r="2.5" /></>,
    whatsapp: <><path d="M20.5 11.5a8.5 8.5 0 0 1-12.6 7.4L3 20l1.2-4.7A8.5 8.5 0 1 1 20.5 11.5Z" /><path d="M8 7.5c.3-.5.6-.5.9-.5h.5c.2 0 .4.1.5.4l.8 1.8c.1.3.1.5-.1.7l-.6.7c-.2.2-.2.4 0 .7.5.9 1.3 1.6 2.2 2.1.3.2.5.2.7-.1l.8-.9c.2-.2.4-.3.7-.2l1.7.8c.3.1.4.3.4.5 0 .4-.2 1.3-.8 1.8-.5.5-1.3.7-2 .5-1.2-.3-2.7-1-4.1-2.3-1.1-1-2-2.4-2.2-3.5-.2-.8.1-1.8.6-2.5Z" /></>
  };
  return <svg {...common}>{paths[name]}</svg>;
}

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const radians = (degrees: number) => degrees * Math.PI / 180;
  const dLat = radians(lat2 - lat1);
  const dLon = radians(lon2 - lon1);
  const a = Math.sin(dLat / 2) ** 2 + Math.cos(radians(lat1)) * Math.cos(radians(lat2)) * Math.sin(dLon / 2) ** 2;
  return 6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function CardEnhancements({ listingName, listingUrl, latitude, longitude }: CardEnhancementsProps) {
  const [shareMessage, setShareMessage] = useState("");
  const [distanceMessage, setDistanceMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const absoluteUrl = () => new URL(listingUrl, window.location.origin).toString();

  async function copyLink() {
    const url = absoluteUrl();
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const field = document.createElement("textarea");
        field.value = url;
        field.style.position = "fixed";
        field.style.opacity = "0";
        document.body.appendChild(field);
        field.select();
        const copied = document.execCommand("copy");
        field.remove();
        if (!copied) throw new Error("Copy failed");
      }
      setShareMessage("Listing link copied.");
    } catch {
      setShareMessage("Copy failed. Please copy the listing URL from View details.");
    }
  }

  function shareWhatsApp() {
    const url = absoluteUrl();
    window.open(`https://wa.me/?text=${encodeURIComponent(listingName + " — " + url)}`, "_blank", "noopener,noreferrer");
  }

  async function shareListing() {
    const url = absoluteUrl();
    if (navigator.share) {
      try {
        await navigator.share({ title: listingName, text: listingName, url });
        setShareMessage("Share menu opened.");
        return;
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") return;
      }
    }
    setShareMessage("Choose WhatsApp or Copy Link below.");
  }

  function showDistance() {
    if (typeof latitude !== "number" || typeof longitude !== "number" ||
        !Number.isFinite(latitude) || !Number.isFinite(longitude) ||
        Math.abs(latitude) > 90 || Math.abs(longitude) > 180) {
      setDistanceMessage("Distance unavailable: verified property coordinates are not available yet.");
      return;
    }
    if (!navigator.geolocation) {
      setDistanceMessage("Your browser does not support location access.");
      return;
    }
    setBusy(true);
    setDistanceMessage("Getting your location…");
    navigator.geolocation.getCurrentPosition(
      position => {
        const km = distanceKm(position.coords.latitude, position.coords.longitude, latitude, longitude);
        setDistanceMessage(`Approx. ${km < 10 ? km.toFixed(1) : Math.round(km)} km straight-line distance`);
        setBusy(false);
      },
      error => {
        setDistanceMessage(error.code === error.PERMISSION_DENIED
          ? "Location permission denied. Allow location access in your browser settings to calculate distance."
          : error.code === error.TIMEOUT
            ? "Location request timed out. Please try again."
            : "Your location is currently unavailable. Please try again.");
        setBusy(false);
      },
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 120000 }
    );
  }

  return (
    <div className="pg-card-enhancements" aria-label="Sharing options and distance">
      <div className="pg-sharing-choices" aria-label="Sharing options">
        <span className="pg-sharing-choice"><Icon name="single" /> Single Sharing</span>
        <span className="pg-sharing-choice"><Icon name="double" /> Double Sharing</span>
        <span className="pg-sharing-choice"><Icon name="triple" /> Triple Sharing</span>
      </div>
      <div className="pg-card-extra-actions">
        <button type="button" className="pg-card-extra-button" onClick={shareListing}><Icon name="share" /> Share</button>
        <button type="button" className="pg-card-extra-button" onClick={shareWhatsApp} aria-label={`Share ${listingName} on WhatsApp`}>
          <Icon name="whatsapp" /> WhatsApp
        </button>
        <button type="button" className="pg-card-extra-button" onClick={copyLink}><Icon name="copy" /> Copy Link</button>
      </div>
      {shareMessage && <p className="pg-card-feedback" role="status">{shareMessage}</p>}
      <button type="button" className="pg-card-distance-button" onClick={showDistance} disabled={busy}>
        <Icon name="pin" /> {busy ? "Finding distance…" : "Show distance from my location"}
      </button>
      {distanceMessage && <p className="pg-card-feedback" role="status">{distanceMessage}</p>}
    </div>
  );
}
