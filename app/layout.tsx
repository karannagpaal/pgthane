import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PG in Thane | Paying Guest, Hostel & Shared Rooms",
  description:
    "Find PG, Paying Guest, Hostel and shared room accommodation across Thane by location, microlocation and workplace.",
  metadataBase: new URL("https://www.pgthane.com"),
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.png", type: "image/png" }], apple: "/favicon.png" }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}