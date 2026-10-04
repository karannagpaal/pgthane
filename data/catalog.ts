export type Listing = {
  id: string;
  name: string;
  type: "PG" | "Paying Guest" | "Hostel" | "Shared Room";
  location: string;
  microlocation: string;
  workplace: string[];
  priceFrom?: number;
  gender?: "Male" | "Female" | "Unisex";
  sharing?: string[];
  food?: "With food" | "Without food" | "Both";
  roomType?: "Private room" | "Shared room" | "Both";
  amenities?: string[];
  photos: string[];
  verified: boolean;
  availability?: string;
  phone?: string;
  whatsapp?: string;
  slug: string;
};

// Real inventory is intentionally empty until verified property data is supplied.
// Never populate this with invented names, prices, photos or availability.
export const listings: Listing[] = [];

export const locationIndex = [
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

export const verifiedWorkplaceIndex = [
  { name: "TCS Olympus Centre", location: "Hiranandani Estate", kind: "Workplace" },
  { name: "Bayer House", location: "Hiranandani Estate", kind: "Workplace" },
  { name: "Hiranandani Business Park", location: "Hiranandani Estate", kind: "Business Park" },
  { name: "Quantum", location: "Hiranandani Estate", kind: "Office Building" },
  { name: "Centaurus", location: "Hiranandani Estate", kind: "Office Building" },
  { name: "Solus", location: "Hiranandani Estate", kind: "Office Building" }
];

export const verifiedMicrolocationIndex = [
  { name: "Hiranandani Estate", location: "Hiranandani Estate" },
  { name: "Ghodbunder Road", location: "Hiranandani Estate" },
  { name: "Hiranandani Business Park", location: "Hiranandani Estate" },
  { name: "One Hiranandani Park", location: "Hiranandani Estate" }
];