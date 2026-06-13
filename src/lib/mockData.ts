export type TicketType = {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  quantityAvailable: number;
  quantitySold: number;
  quantityRemaining: number;
  saleStart: string;
  saleEnd: string;
  isSaleOpen: boolean;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  coverImageUrl: string | null;
  bg: string;
  venueType: "physical" | "virtual";
  venueAddress: string | null;
  virtualLink: string | null;
  city: string;
  country: string;
  startTime: string;
  endTime: string;
  timezone: string;
  status: "published" | "draft" | "cancelled";
  isFeatured: boolean;
  isFree: boolean;
  capacity: number;
  category: { id: number; name: string };
  ticketTypes: TicketType[];
  organizer: {
    id: string;
    orgName: string;
    bio: string;
    website: string;
    eventsCount: number;
    rating: number;
  };
  lowestTicketPrice: number;
  currency: string;
};

export const CATEGORIES = [
  { id: 1, name: "Music", slug: "music" },
  { id: 2, name: "Technology", slug: "technology" },
  { id: 3, name: "Business", slug: "business" },
  { id: 4, name: "Arts", slug: "arts" },
  { id: 5, name: "Food & Drink", slug: "food-drink" },
  { id: 6, name: "Comedy", slug: "comedy" },
];

export const MOCK_EVENTS: Event[] = [
  {
    id: "1",
    title: "Afrobeats Night Lagos — Vol. 12",
    slug: "afrobeats-night-lagos-vol-12",
    description:
      "Afrobeats Night Lagos returns for its 12th edition — bigger, louder, and more electric than ever. Join us for a night of live performances, DJ sets, and an atmosphere that only Lagos can produce. Featuring some of Nigeria's most exciting acts alongside surprise guests, this is the event of the season.\n\nDoors open at 6:30 PM. Smart casual dress code. 18+ only. No refunds after purchase.",
    coverImageUrl: null,
    bg: "#1A2035",
    venueType: "physical",
    venueAddress: "Eko Hotel & Suites, Victoria Island, Lagos",
    virtualLink: null,
    city: "Lagos",
    country: "NG",
    startTime: "2026-06-14T19:00:00.000Z",
    endTime: "2026-06-14T23:00:00.000Z",
    timezone: "Africa/Lagos",
    status: "published",
    isFeatured: true,
    isFree: false,
    capacity: 500,
    category: { id: 1, name: "Music" },
    ticketTypes: [
      {
        id: "tt-1",
        name: "Early Bird",
        description: "Limited availability. No perks.",
        price: 10000,
        currency: "NGN",
        quantityAvailable: 100,
        quantitySold: 100,
        quantityRemaining: 0,
        saleStart: "2026-05-01T00:00:00.000Z",
        saleEnd: "2026-06-13T23:59:59.000Z",
        isSaleOpen: false,
      },
      {
        id: "tt-2",
        name: "General Admission",
        description: "Standard entry. Standing area.",
        price: 15000,
        currency: "NGN",
        quantityAvailable: 300,
        quantitySold: 88,
        quantityRemaining: 212,
        saleStart: "2026-05-01T00:00:00.000Z",
        saleEnd: "2026-06-14T18:00:00.000Z",
        isSaleOpen: true,
      },
      {
        id: "tt-3",
        name: "VIP Table",
        description: "Reserved table, 2 drinks, priority entry.",
        price: 50000,
        currency: "NGN",
        quantityAvailable: 20,
        quantitySold: 12,
        quantityRemaining: 8,
        saleStart: "2026-05-01T00:00:00.000Z",
        saleEnd: "2026-06-14T18:00:00.000Z",
        isSaleOpen: true,
      },
    ],
    organizer: {
      id: "org-1",
      orgName: "Lagos Events Co.",
      bio: "We bring Lagos the best nightlife experiences, one show at a time.",
      website: "https://lagoseventsco.com",
      eventsCount: 47,
      rating: 4.8,
    },
    lowestTicketPrice: 15000,
    currency: "NGN",
  },
  {
    id: "2",
    title: "Lagos Startup Summit 2026",
    slug: "lagos-startup-summit-2026",
    description:
      "The largest tech and startup conference in West Africa returns. Connect with founders, investors, and operators building the next generation of African companies.\n\nFeaturing keynotes, panel discussions, a startup pitch competition, and unmatched networking opportunities. Breakfast and lunch included.",
    coverImageUrl: null,
    bg: "#0D1520",
    venueType: "physical",
    venueAddress: "Landmark Centre, Victoria Island, Lagos",
    virtualLink: null,
    city: "Lagos",
    country: "NG",
    startTime: "2026-06-19T10:00:00.000Z",
    endTime: "2026-06-19T18:00:00.000Z",
    timezone: "Africa/Lagos",
    status: "published",
    isFeatured: true,
    isFree: true,
    capacity: 1000,
    category: { id: 2, name: "Technology" },
    ticketTypes: [
      {
        id: "tt-4",
        name: "General Admission",
        description: "Full day access to all sessions.",
        price: 0,
        currency: "NGN",
        quantityAvailable: 1000,
        quantitySold: 640,
        quantityRemaining: 360,
        saleStart: "2026-05-01T00:00:00.000Z",
        saleEnd: "2026-06-19T09:00:00.000Z",
        isSaleOpen: true,
      },
    ],
    organizer: {
      id: "org-2",
      orgName: "TechHub Lagos",
      bio: "Building the future of tech in Africa.",
      website: "https://techhublagos.com",
      eventsCount: 12,
      rating: 4.9,
    },
    lowestTicketPrice: 0,
    currency: "NGN",
  },
  {
    id: "3",
    title: "An Evening with Wande Coal",
    slug: "an-evening-with-wande-coal",
    description:
      "An intimate evening of soulful performances from one of Nigeria's most celebrated vocalists. Expect classics, new material, and a live band setup in an exclusive venue.\n\nLimited seating. Tables of 4 and 6 available. Doors open at 5:30 PM.",
    coverImageUrl: null,
    bg: "#141414",
    venueType: "physical",
    venueAddress: "Terra Kulture, Victoria Island, Lagos",
    virtualLink: null,
    city: "Lagos",
    country: "NG",
    startTime: "2026-06-27T18:00:00.000Z",
    endTime: "2026-06-27T22:00:00.000Z",
    timezone: "Africa/Lagos",
    status: "published",
    isFeatured: true,
    isFree: false,
    capacity: 200,
    category: { id: 1, name: "Music" },
    ticketTypes: [
      {
        id: "tt-5",
        name: "General Admission",
        description: "Standing area access.",
        price: 8000,
        currency: "NGN",
        quantityAvailable: 150,
        quantitySold: 95,
        quantityRemaining: 55,
        saleStart: "2026-05-01T00:00:00.000Z",
        saleEnd: "2026-06-27T17:00:00.000Z",
        isSaleOpen: true,
      },
      {
        id: "tt-6",
        name: "Reserved Table (4 seats)",
        description: "Table for 4, includes a bottle of wine.",
        price: 60000,
        currency: "NGN",
        quantityAvailable: 50,
        quantitySold: 30,
        quantityRemaining: 20,
        saleStart: "2026-05-01T00:00:00.000Z",
        saleEnd: "2026-06-27T17:00:00.000Z",
        isSaleOpen: true,
      },
    ],
    organizer: {
      id: "org-3",
      orgName: "Terra Live",
      bio: "Curating intimate live music experiences across Lagos.",
      website: "https://terralive.ng",
      eventsCount: 21,
      rating: 4.7,
    },
    lowestTicketPrice: 8000,
    currency: "NGN",
  },
  {
    id: "4",
    title: "Google Developer Group Lagos — July Meetup",
    slug: "gdg-lagos-july-meetup",
    description:
      "Join GDG Lagos for our monthly meetup featuring talks on AI agents, cloud infrastructure, and mobile development. Network with fellow developers and enjoy free snacks and swag.\n\nAll skill levels welcome. Bring your laptop for the hands-on workshop session.",
    coverImageUrl: null,
    bg: "#0D1520",
    venueType: "physical",
    venueAddress: "Co-Creation Hub, Yaba, Lagos",
    virtualLink: null,
    city: "Lagos",
    country: "NG",
    startTime: "2026-07-05T09:00:00.000Z",
    endTime: "2026-07-05T13:00:00.000Z",
    timezone: "Africa/Lagos",
    status: "published",
    isFeatured: false,
    isFree: true,
    capacity: 150,
    category: { id: 2, name: "Technology" },
    ticketTypes: [
      {
        id: "tt-7",
        name: "Free Entry",
        description: "Includes workshop materials and refreshments.",
        price: 0,
        currency: "NGN",
        quantityAvailable: 150,
        quantitySold: 102,
        quantityRemaining: 48,
        saleStart: "2026-06-01T00:00:00.000Z",
        saleEnd: "2026-07-05T08:00:00.000Z",
        isSaleOpen: true,
      },
    ],
    organizer: {
      id: "org-4",
      orgName: "Google Developer Group Lagos",
      bio: "A community of developers passionate about Google technologies.",
      website: "https://gdg.community.dev/gdg-lagos",
      eventsCount: 36,
      rating: 4.9,
    },
    lowestTicketPrice: 0,
    currency: "NGN",
  },
  {
    id: "5",
    title: "Abuja Food & Wine Festival",
    slug: "abuja-food-wine-festival",
    description:
      "A celebration of Nigeria's best culinary talent paired with premium wines from around the world. Sample dishes from over 30 vendors, attend live cooking demos, and enjoy curated wine tastings.\n\nFamily-friendly during the day, 18+ wine garden after 4 PM.",
    coverImageUrl: null,
    bg: "#1A1208",
    venueType: "physical",
    venueAddress: "Transcorp Hilton, Abuja",
    virtualLink: null,
    city: "Abuja",
    country: "NG",
    startTime: "2026-07-13T12:00:00.000Z",
    endTime: "2026-07-13T20:00:00.000Z",
    timezone: "Africa/Lagos",
    status: "published",
    isFeatured: false,
    isFree: false,
    capacity: 800,
    category: { id: 5, name: "Food & Drink" },
    ticketTypes: [
      {
        id: "tt-8",
        name: "Day Pass",
        description: "Full day access including all tastings.",
        price: 25000,
        currency: "NGN",
        quantityAvailable: 800,
        quantitySold: 410,
        quantityRemaining: 390,
        saleStart: "2026-06-01T00:00:00.000Z",
        saleEnd: "2026-07-13T11:00:00.000Z",
        isSaleOpen: true,
      },
    ],
    organizer: {
      id: "org-5",
      orgName: "Abuja Lifestyle Group",
      bio: "Curating premium lifestyle experiences in the capital.",
      website: "https://abujalifestyle.ng",
      eventsCount: 8,
      rating: 4.6,
    },
    lowestTicketPrice: 25000,
    currency: "NGN",
  },
  {
    id: "6",
    title: "Stand Up Abuja — Comedy Night",
    slug: "stand-up-abuja-comedy-night",
    description:
      "A night of non-stop laughter featuring Nigeria's top comedians plus rising stars from the open mic circuit. Hosted by a surprise headliner.\n\nDoors open at 7 PM. Show starts promptly at 8 PM. 18+ recommended for content.",
    coverImageUrl: null,
    bg: "#141414",
    venueType: "physical",
    venueAddress: "NAF Conference Centre, Abuja",
    virtualLink: null,
    city: "Abuja",
    country: "NG",
    startTime: "2026-07-18T20:00:00.000Z",
    endTime: "2026-07-18T22:30:00.000Z",
    timezone: "Africa/Lagos",
    status: "published",
    isFeatured: false,
    isFree: false,
    capacity: 300,
    category: { id: 6, name: "Comedy" },
    ticketTypes: [
      {
        id: "tt-9",
        name: "General Admission",
        description: "Standard seating.",
        price: 5000,
        currency: "NGN",
        quantityAvailable: 300,
        quantitySold: 180,
        quantityRemaining: 120,
        saleStart: "2026-06-01T00:00:00.000Z",
        saleEnd: "2026-07-18T19:00:00.000Z",
        isSaleOpen: true,
      },
    ],
    organizer: {
      id: "org-6",
      orgName: "Naija Laughs",
      bio: "Nigeria's premier comedy show producers.",
      website: "https://naijalaughs.ng",
      eventsCount: 64,
      rating: 4.8,
    },
    lowestTicketPrice: 5000,
    currency: "NGN",
  },
];

export function getEventBySlug(slug: string): Event | undefined {
  return MOCK_EVENTS.find(e => e.slug === slug);
}

export function getFeaturedEvents(): Event[] {
  return MOCK_EVENTS.filter(e => e.isFeatured);
}

export function getAllEvents(filters?: {
  search?: string;
  category?: string;
  city?: string;
  isFree?: boolean;
}): Event[] {
  let results = [...MOCK_EVENTS];

  if (filters?.search) {
    const q = filters.search.toLowerCase();
    results = results.filter(
      e => e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q)
    );
  }
  if (filters?.category && filters.category !== "All") {
    results = results.filter(e => e.category.name === filters.category);
  }
  if (filters?.city && filters.city !== "All cities") {
    results = results.filter(e => e.city === filters.city);
  }
  if (filters?.isFree !== undefined) {
    results = results.filter(e => e.isFree === filters.isFree);
  }

  return results;
}

export function formatPrice(amount: number, currency = "NGN"): string {
  if (amount === 0) return "Free";
  const symbol = currency === "NGN" ? "₦" : currency;
  return `${symbol}${amount.toLocaleString()}`;
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).toUpperCase().replace(",", ",");
}

export function formatDateLong(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}