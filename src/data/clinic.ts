/* ------------------------------------------------------------------ */
/*  ClearVision Eye Care — single source of truth for all content      */
/* ------------------------------------------------------------------ */

export const CLINIC = {
  name: "ClearVision Eye Care",
  tagline: "See Life in Full Clarity",
  phone: "(555) 010-2030",
  phoneHref: "tel:+15550102030",
  emergencyPhone: "(555) 010-2999",
  emergencyHref: "tel:+15550102999",
  whatsapp:
    "https://wa.me/15550102030?text=Hi%20ClearVision!%20I'd%20like%20to%20book%20an%20eye%20exam.",
  email: "hello@clearvision.care",
  address: "218 Riverside Avenue, Suite 400",
  rating: 4.9,
  reviewCount: 486,
  mapsDirections:
    "https://www.google.com/maps/dir/?api=1&destination=218+Riverside+Avenue+Suite+400",
} as const;

export const HOURS = [
  { day: "Monday", open: "9:00 AM", close: "7:00 PM" },
  { day: "Tuesday", open: "9:00 AM", close: "7:00 PM" },
  { day: "Wednesday", open: "9:00 AM", close: "7:00 PM" },
  { day: "Thursday", open: "9:00 AM", close: "7:00 PM" },
  { day: "Friday", open: "9:00 AM", close: "7:00 PM" },
  { day: "Saturday", open: "9:00 AM", close: "3:00 PM" },
  { day: "Sunday", open: null, close: null },
] as const;

/* ------------------------------ services --------------------------- */

export type VisitReason = "prescription" | "medical" | "surgery";
export type ServiceIcon =
  | "exam" | "contacts" | "lasik" | "cataract" | "glaucoma"
  | "pediatric" | "diabetic" | "dry-eye" | "emergency";

export interface Service {
  id: string;
  name: string;
  icon: ServiceIcon;
  desc: string;
  duration: string;
  price: string; // "from $X" — pre-formatted
  emergency?: boolean;
}

export const VISIT_REASONS: { id: VisitReason; label: string; hint: string }[] = [
  { id: "prescription", label: "Prescription update", hint: "Glasses or contact lens renewal" },
  { id: "medical", label: "Medical concern", hint: "Symptoms, screening or follow-up" },
  { id: "surgery", label: "Surgery consult", hint: "LASIK, cataract or eyelid surgery" },
];

export const SERVICES: Service[] = [
  {
    id: "exam",
    name: "Comprehensive Eye Exam",
    icon: "exam",
    desc: "A full ocular health check with digital retinal imaging — not just a lens test.",
    duration: "45 min",
    price: "from $79",
  },
  {
    id: "contacts",
    name: "Contact Lens Fitting",
    icon: "contacts",
    desc: "Precision fittings for daily, monthly and toric lenses — comfort guaranteed.",
    duration: "30 min",
    price: "from $120",
  },
  {
    id: "lasik",
    name: "LASIK Consultation",
    icon: "lasik",
    desc: "Blade-free laser vision correction. Find out if you're a candidate.",
    duration: "60 min",
    price: "Free consult",
  },
  {
    id: "cataract",
    name: "Cataract Surgery",
    icon: "cataract",
    desc: "Modern lens replacement with most patients driving again in 24 hours.",
    duration: "Consult",
    price: "from $2,900",
  },
  {
    id: "glaucoma",
    name: "Glaucoma Screening",
    icon: "glaucoma",
    desc: "Early detection protects your optic nerve — 90% of vision loss is preventable.",
    duration: "30 min",
    price: "from $149",
  },
  {
    id: "pediatric",
    name: "Pediatric Eye Care",
    icon: "pediatric",
    desc: "Kid-friendly exams for ages 3+ that feel more like play than a doctor's visit.",
    duration: "30 min",
    price: "from $99",
  },
  {
    id: "diabetic",
    name: "Diabetic Eye Screening",
    icon: "diabetic",
    desc: "Annual dilated screening that catches retinopathy years before symptoms.",
    duration: "45 min",
    price: "from $139",
  },
  {
    id: "dry-eye",
    name: "Dry Eye Treatment",
    icon: "dry-eye",
    desc: "LipiFlow and TearScience therapy to end the burn, blur and watering.",
    duration: "30 min",
    price: "from $109",
  },
  {
    id: "emergency",
    name: "Emergency Visit",
    icon: "emergency",
    desc: "Sudden vision loss, eye injury, severe pain or flashes of light? Come now.",
    duration: "ASAP",
    price: "Same-day",
    emergency: true,
  },
];

/* ------------------------------ doctors ---------------------------- */

export type DoctorFilter = "all" | "optometrist" | "surgeon" | "pediatric";

export interface Doctor {
  id: string;
  name: string;
  creds: string;
  role: string;
  specialty: string;
  filter: Exclude<DoctorFilter, "all">;
  rating: number;
  reviews: number;
  experience: number;
  languages: { flag: string; label: string }[];
  quote: string;
  available: boolean;
  nextAvailable: string;
  bio: string;
  education: string[];
  certifications: string[];
  interests: string[];
  days: string[];
  img: string;
  favorite?: boolean;
}

export const DOCTORS: Doctor[] = [
  {
    id: "dr-chen",
    name: "Dr. Sarah Chen",
    creds: "OD",
    role: "Optometrist",
    specialty: "Comprehensive & Dry Eye Care",
    filter: "optometrist",
    rating: 4.9,
    reviews: 212,
    experience: 12,
    languages: [
      { flag: "🇺🇸", label: "English" },
      { flag: "🇨🇳", label: "中文" },
    ],
    quote: "Nobody should leave an eye exam without understanding every number on their chart.",
    available: true,
    nextAvailable: "Today, 2:30 PM",
    bio: "Dr. Chen leads our comprehensive care team. Over 12 years she has guided more than 15,000 patients from \"my eyes are fine, probably\" to truly understanding their vision. She specialises in dry eye therapy and myopia control, and is famous for explaining OCT scans with a whiteboard and a smile.",
    education: [
      "Doctor of Optometry — UC Berkeley School of Optometry, 2012",
      "BSc Vision Science — University of California, San Diego, 2008",
    ],
    certifications: ["Board Certified, ABO", "TearScience® Certified", "AAO Fellow"],
    interests: ["Dry eye & MGD", "Myopia control", "Contact lens innovation"],
    days: ["Mon", "Tue", "Thu", "Fri", "Sat"],
    img: "/images/dr-chen.jpg",
    favorite: true,
  },
  {
    id: "dr-reid",
    name: "Dr. Marcus Reid",
    creds: "MD",
    role: "Ophthalmologist",
    specialty: "Refractive & Cataract Surgery",
    filter: "surgeon",
    rating: 4.8,
    reviews: 168,
    experience: 15,
    languages: [
      { flag: "🇺🇸", label: "English" },
      { flag: "🇫🇷", label: "Français" },
    ],
    quote: "The moment a patient sees 20/20 without glasses is why I love this job.",
    available: true,
    nextAvailable: "Today, 4:00 PM",
    bio: "Dr. Reid has performed over 4,000 blade-free LASIK and laser cataract procedures. Trained at Johns Hopkins, he was an early adopter of femtosecond laser technology and holds one of the region's highest patient satisfaction scores for surgical outcomes.",
    education: [
      "MD — Johns Hopkins University School of Medicine, 2009",
      "Ophthalmology Residency — Wilmer Eye Institute, 2013",
      "Cornea & Refractive Fellowship — Bascom Palmer Eye Institute, 2014",
    ],
    certifications: ["American Board of Ophthalmology", "AAO Member", "Femtosecond LASIK Certified"],
    interests: ["LASIK & PRK", "Premium IOLs", "Advanced cataract surgery"],
    days: ["Mon", "Wed", "Fri"],
    img: "/images/dr-reid.jpg",
  },
  {
    id: "dr-sharma",
    name: "Dr. Priya Sharma",
    creds: "MD",
    role: "Pediatric Ophthalmologist",
    specialty: "Pediatric & Strabismus Care",
    filter: "pediatric",
    rating: 4.9,
    reviews: 198,
    experience: 10,
    languages: [
      { flag: "🇺🇸", label: "English" },
      { flag: "🇮🇳", label: "हिन्दी" },
    ],
    quote: "I became a pediatric ophthalmologist so no child grows up afraid of the doctor.",
    available: false,
    nextAvailable: "Thursday, 9:30 AM",
    bio: "Dr. Sharma makes eye exams feel like a game — kids leave asking when they can come back. She specialises in childhood strabismus, amblyopia (lazy eye) and school vision screening, and partners with 40+ local schools for annual check-ups.",
    education: [
      "MD — Stanford University School of Medicine, 2014",
      "Pediatric Ophthalmology Fellowship — Boston Children's Hospital, 2017",
    ],
    certifications: ["American Board of Ophthalmology", "AAPOS Member", "InfantSEE® Provider"],
    interests: ["Amblyopia & strabismus", "School screenings", "Special-needs eye care"],
    days: ["Tue", "Wed", "Thu", "Sat"],
    img: "/images/dr-sharma.jpg",
  },
  {
    id: "dr-okafor",
    name: "Dr. James Okafor",
    creds: "OD",
    role: "Optometrist",
    specialty: "Glaucoma & Diabetic Eye Care",
    filter: "optometrist",
    rating: 4.7,
    reviews: 140,
    experience: 9,
    languages: [
      { flag: "🇺🇸", label: "English" },
      { flag: "🇳🇬", label: "Igbo" },
    ],
    quote: "Early screening saves sight — I make sure every patient gets the gold standard.",
    available: true,
    nextAvailable: "Today, 5:00 PM",
    bio: "Dr. Okafor manages our glaucoma and diabetic retinopathy programs. He believes the best treatment is prevention, and has helped hundreds of patients protect their sight through careful monitoring, OCT imaging and clear, honest conversations.",
    education: [
      "Doctor of Optometry — SUNY College of Optometry, 2015",
      "BS Biology — Howard University, 2011",
    ],
    certifications: ["Board Certified, ABO", "Glaucoma Certified Optometrist", "CLSA Member"],
    interests: ["Glaucoma management", "Diabetic retinopathy", "Ocular hypertension"],
    days: ["Mon", "Tue", "Wed", "Fri"],
    img: "/images/dr-okafor.jpg",
  },
];

export const SUPPORT_TEAM = [
  { name: "Elena Martinez", role: "Lead Hygienist", initials: "EM", grad: "from-teal-400 to-blue-500" },
  { name: "David Park", role: "Front Desk Manager", initials: "DP", grad: "from-sky-400 to-blue-600" },
  { name: "Aisha Bello", role: "Optometric Technician", initials: "AB", grad: "from-amber-400 to-orange-500" },
  { name: "Tom Nguyen", role: "Laser Safety Officer", initials: "TN", grad: "from-indigo-400 to-blue-700" },
  { name: "Grace Kim", role: "Eyewear Stylist", initials: "GK", grad: "from-rose-400 to-pink-500" },
  { name: "Sam Rivera", role: "Insurance Coordinator", initials: "SR", grad: "from-emerald-400 to-teal-600" },
];

/* --------------------------- eyewear boutique ----------------------- */

export interface Frame {
  id: string;
  brand: string;
  model: string;
  price: string;
  tag: string;
  img: string;
}

export const FRAMES: Frame[] = [
  {
    id: "f1",
    brand: "Ray-Ban",
    model: "Wayfarer Ease",
    price: "$189",
    tag: "Best seller",
    img: "https://images.pexels.com/photos/26050120/pexels-photo-26050120.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    id: "f2",
    brand: "Tom Ford",
    model: "FT5650-B",
    price: "$389",
    tag: "New arrival",
    img: "https://images.pexels.com/photos/28488304/pexels-photo-28488304.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    id: "f3",
    brand: "Oliver Peoples",
    model: "OP-505",
    price: "$429",
    tag: "Handcrafted",
    img: "https://images.pexels.com/photos/25096259/pexels-photo-25096259.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    id: "f4",
    brand: "Warby Parker",
    model: "Haskell",
    price: "$95",
    tag: "Staff pick",
    img: "https://images.pexels.com/photos/28368509/pexels-photo-28368509.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    id: "f5",
    brand: "Oakley",
    model: "Crosslink Switch",
    price: "$199",
    tag: "Active",
    img: "https://images.pexels.com/photos/29467510/pexels-photo-29467510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
  {
    id: "f6",
    brand: "Gucci",
    model: "GG1326",
    price: "$519",
    tag: "Limited",
    img: "https://images.pexels.com/photos/28368510/pexels-photo-28368510.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
  },
];

/* ------------------------------ insurance --------------------------- */

export const INSURANCE = [
  "VSP Vision",
  "EyeMed",
  "Cigna Vision",
  "Aetna",
  "UnitedHealthcare",
  "Humana",
  "MetLife Vision",
  "Blue Cross Blue Shield",
  "Medicare",
  "AAO Member",
  "FDA-Approved LASIK",
];

/* ----------------------------- testimonials ------------------------- */

export interface Testimonial {
  name: string;
  meta: string;
  text: string;
  initials: string;
  grad: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Melissa Torres",
    meta: "LASIK patient · 42",
    text: "After 20 years of squinting, Dr. Reid's team had me seeing 20/20 the very next morning. I cried — happy tears, promise.",
    initials: "MT",
    grad: "from-amber-400 to-orange-500",
  },
  {
    name: "David & Olivia Park",
    meta: "Pediatric visit · ages 5 & 8",
    text: "Our kids were terrified of the 'eye machine.' Dr. Sharma had them giggling through the whole exam and asking to come back.",
    initials: "DP",
    grad: "from-sky-400 to-blue-600",
  },
  {
    name: "Robert Kimble",
    meta: "Glaucoma program · 67",
    text: "Finally found an eye doctor who explains my glaucoma numbers in plain English. I've never understood my health better.",
    initials: "RK",
    grad: "from-teal-400 to-blue-500",
  },
  {
    name: "Ana Gutierrez",
    meta: "Returning patient",
    text: "The front desk filed my VSP claim before I even left the parking lot. Zero paperwork, zero stress. This is how healthcare should work.",
    initials: "AG",
    grad: "from-rose-400 to-pink-500",
  },
  {
    name: "Harold Mensah",
    meta: "Diabetic screening",
    text: "My diabetic screening caught a retinal issue two years before it would've shown up anywhere else. That exam may have saved my sight.",
    initials: "HM",
    grad: "from-emerald-400 to-teal-600",
  },
  {
    name: "Jasmine Lee",
    meta: "New patient",
    text: "Booked online at 9pm, seen at 9:30 the next morning. The online booking actually works — and the doctors are just as good.",
    initials: "JL",
    grad: "from-indigo-400 to-blue-700",
  },
];

/* -------------------------------- FAQs ------------------------------ */

export const FAQS = [
  {
    q: "Do you accept my insurance?",
    a: "Almost certainly yes. We're in-network with VSP, EyeMed, Cigna Vision, Aetna, UnitedHealthcare, Humana, MetLife Vision, Blue Cross Blue Shield and Medicare. Our insurance coordinator verifies your benefits before you arrive and files every claim for you — most patients pay nothing at the front desk beyond a small copay.",
  },
  {
    q: "What happens at my first visit?",
    a: "Plan for about 45–60 minutes. You'll start with a pre-test — digital retinal imaging, OCT scan, and a pressure check (no puff of air, we promise). Then your doctor reviews your history, discusses your vision goals, and walks you through every result. You'll leave with a clear picture of your eye health and a written plan, never a mystery bill.",
  },
  {
    q: "How much does an exam or LASIK cost?",
    a: "Comprehensive exams start at $79, and LASIK consultations are always free. Surgery pricing is all-inclusive — no surprise facility fees — with 0% financing available. We print your exact out-of-pocket cost (after insurance) before any treatment begins. If we can't beat another clinic's quote for the same procedure, we'll match it.",
  },
  {
    q: "I'm nervous about eye exams — can you help?",
    a: "You're in good company, and yes. We use touchless, air-puff-free equipment, warm-toned lighting, and every step is explained before it happens. For anxious patients we offer extra time, calming sedation options for procedures, and a friend or family member in the room. Tell us when you book and we'll make it easy.",
  },
  {
    q: "Do you handle eye emergencies?",
    a: "Yes — same-day, every day we're open. Sudden vision loss, flashes of light, floaters, eye injuries, severe pain or redness: call us and we'll see you within hours, or ring our 24/7 emergency line at (555) 010-2999. If it can't wait, we'll direct you to the right urgent eye facility immediately.",
  },
  {
    q: "Do you treat children?",
    a: "We love treating kids. Dr. Sharma's pediatric practice starts at age 3, and exams are play-based with zero pressure. Early eye exams catch amblyopia (lazy eye) and vision issues that affect learning — we partner with 40+ local schools for free annual screenings.",
  },
];

/* ------------------------------ time slots -------------------------- */

export const SLOT_START_MIN = 9 * 60; // 9:00 AM
export const SLOT_COUNT = 18; // 30-minute blocks → 5:30 PM last slot

export function slotLabel(index: number): string {
  const total = SLOT_START_MIN + index * 30;
  const h24 = Math.floor(total / 60);
  const m = total % 60;
  const ampm = h24 >= 12 ? "PM" : "AM";
  const h12 = h24 % 12 === 0 ? 12 : h24 % 12;
  return `${h12}:${m.toString().padStart(2, "0")} ${ampm}`;
}

/** Deterministic pseudo-random so "booked" slots are stable per date/dentist */
function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function seededRand(seed: number): () => number {
  let t = seed || 1;
  return () => {
    t += 0x6d2b79f5;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r ^= r + Math.imul(r ^ (r >>> 7), 61 | r);
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

export function isSlotBooked(dateISO: string, dentistId: string, slotIndex: number): boolean {
  const rand = seededRand(hashStr(`${dateISO}|${dentistId}|${slotIndex}`));
  return rand() < 0.38;
}

/** Slots still in the future for emergency (today-only) bookings */
export function emergencySlots(): number[] {
  const now = new Date();
  const minutes = now.getHours() * 60 + now.getMinutes();
  return Array.from({ length: SLOT_COUNT }, (_, i) => i).filter(
    (i) => SLOT_START_MIN + i * 30 > minutes + 45
  );
}
