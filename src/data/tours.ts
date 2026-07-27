/**
 * tours.ts — Morning Vietnam tour data
 *
 * Core fields: slug, name, region, duration, price, tagline, description,
 *   highlights, included, hub, languages, comingSoon, image, itinerary
 *
 * Extended fields (tour-details redesign):
 *   gallery[]          — 4–6 photos { src, alt }
 *   priceUSD           — number, lowest option per person
 *   pitch              — PitchBlock | Record<string, PitchBlock> — S3 hook
 *   valueAnchor        — ValueAnchorBlock | Record<string, ValueAnchorBlock> | null — S4
 *   storytelling       — { headline, paragraphs[], pullImage } — S5 narrative
 *   elevationProfile[] — timeline points { time, label, elevation, icon, highlight }
 *   welcomePack        — { headline, subheading, intro, items[] } — S7
 *   seasonality        — { intro, months[], notes[] } — S9
 *   faqs[]             — { q, a }
 */

// ── Types ──────────────────────────────────────────────────────────────────

export interface CompareRow      { metric: string; typical: string; us: string }
export interface FAQ             { q: string; a: string }
export interface GalleryItem     { src: string; alt: string }
export interface WelcomePackItem { icon: string; name: string; why: string }
export interface WelcomePack     { headline: string; subheading: string; intro: string; items: WelcomePackItem[] }
export interface SeasonMonth     { name: string; level: 'best' | 'good' | 'wet' }
export interface SeasonNote      { title: string; desc: string }
export interface Seasonality     { intro: string; months: SeasonMonth[]; notes: SeasonNote[] }
export interface UnlockStep      { num: number; title: string; desc: string }
export interface UnlockChallenge { sectionLabel: string; headline: string; intro: string; steps: UnlockStep[]; note: string; teaser: string }
export interface DurationOption  { id: string; label: string; price: number | null; priceVND?: number | null; tagline: string; ctaLabel: string; ctaNote: string; waText: string }
export interface ElevationPoint  { time: string; label: string; elevation: number; icon?: string; highlight?: boolean; durationOnly?: string; day?: number }
export interface TripInfoItem    { icon: string; label: string; value: string }
export interface ActivityCard    { badges?: string[]; badge?: string; badgeLabel?: string; time: string; title: string; desc: string; highlight: boolean; durationOnly?: string }
export interface PitchBlock      { headline: string; paragraphs?: string[]; bullets?: string[]; closingLine?: string }
export interface ValueAnchorBlock { headline: string; paragraphs: string[]; compareTable: CompareRow[] }
export interface Storytelling    { headline: string; paragraphs: string[]; pullImage?: string }
export interface ItineraryDay    { day: number; title: string; slots: string[] }

export interface Tour {
  slug:              string;
  name:              string;
  region:            string;
  duration:          string[];
  price:             string;
  tagline:           string;
  description:       string;
  highlights?:       string[];
  included?:         string[];
  hub:               string;
  languages:         string[];
  comingSoon:        boolean;
  image:             string;
  priceUSD?:         number | null;
  priceVND?:         number | null;   // lowest option, VNĐ (no formatting — display layer adds separator)
  hubUrl?:           string;
  cabinUpgrade?:     { labelOn: string; labelOff: string; surchargeVND: number; surchargeUSD: number; surchargeNote: string };
  discountPolicy?:   { rules: { label: string; value: string }[] };
  gallery?:          GalleryItem[];
  durationOptions?:  DurationOption[];
  selectorMode?:     'pickup-vehicle' | 'vehicle-only' | 'duration-tabs'; // default: pickup-vehicle when durationOptions present
  itinerary?:        ItineraryDay[];
  pitch?:            PitchBlock | Record<string, PitchBlock>;
  valueAnchor?:      ValueAnchorBlock | Record<string, ValueAnchorBlock> | null;
  storytelling?:     Storytelling;
  elevationProfile?: ElevationPoint[];
  elevationMax?:     number;
  panoramicImage?:   string;  // 3:1 ratio, 2400×800px min, placed after elevation chart
  activityCards?:    ActivityCard[];
  tripInfo?:         Record<string, TripInfoItem[]>;
  welcomePack?:      WelcomePack;
  seasonality?:      Seasonality;
  faqs?:             FAQ[];
  unlockChallenge?:  UnlockChallenge | null;
  upcomingDates?:    string[];   // e.g. ["Wed 22 Jul", "Sun 26 Jul"] — displayed on tour detail
  subtitle?:         string;     // Secondary line shown under h1 on hero, smaller font
  priceNote?:        string;     // Small note shown below price block on hero
}

// ── Shared defaults ────────────────────────────────────────────────────────

const DEFAULT_FAQS: FAQ[] = [
  { q: "What's the maximum group size?",  a: "Max 12 people. We never combine groups. Sometimes we run with 4–5 if that's the booking." },
  { q: "What happens if it rains?",        a: "Our routes have rain-friendly alternatives built in. We adjust on the fly — no day is cancelled." },
  { q: "Do I need to be fit?",             a: "Moderate fitness recommended. Most activities are walking/cycling at a relaxed pace, but some sections may include 30–60 min of uphill." },
  { q: "What's included in the price?",   a: "All transport, all meals, accommodation (if multi-day), all activity fees, dedicated host. You only need spending money." },
  { q: "When do I pay?",                  a: "Reserve your spot first — no payment upfront. Pay 14 days before departure. Free cancellation until then." },
];

const DEFAULT_COMPARE_TABLE: CompareRow[] = [
  { metric: "Real experience time",  typical: "~4 hrs",        us: "~8 hrs" },
  { metric: "Cultural workshop",     typical: "Performance",   us: "You do it" },
  { metric: "Welcome gift pack",     typical: "None",          us: "Curated" },
  { metric: "Game / challenge",      typical: "None",          us: "Unlock Challenge" },
  { metric: "Route design",          typical: "Standard",      us: "Optimized for depth" },
];

const DEFAULT_WELCOME_PACK = {
  headline: "Your welcome pack.",
  subheading: "Everything in your bag has a reason.",
  intro: "On the road, your guide hands you a Morning Vietnam pack. Not merch. Each item was chosen for what the day asks of you.",
  items: [
    { icon: "🥖", name: "Pork Floss Bread · Bánh ruốc",    why: "A light breakfast that's very much a Vietnamese thing — soft bread, fluffy pork floss, zero pretension. The kind of snack that makes locals nostalgic and visitors confused in the best way." },
    { icon: "🍘", name: "Rice Cracker · Bánh gạo",         why: "Road snack. Crunchy, light, oddly addictive. Perfect for the stretch of highway where the scenery gets good and you need something to do with your hands." },
    { icon: "🍬", name: "Ginger Candy · Kẹo gừng",        why: "Vietnamese mountain roads don't do straight lines. This little candy does more for motion sickness than any pill — and it actually tastes good. Don't skip it." },
    { icon: "💧", name: "Water · Nước suối",               why: "To get you started. The day earns you a refill." },
    { icon: "🪭", name: "Paper Hand Fan · Quạt giấy",     why: "For the valley heat. Hand-painted. Yours to keep." },
    { icon: "🧵", name: "Brocade Bracelet · Vòng tay thổ cẩm", why: "Everyone on the trip wears one. It's how you find your people at the Unlock Challenge — and a pretty decent souvenir that you didn't have to buy in a gift shop." },
    { icon: "♻️", name: "Recycled MVN Bag · Túi tái chế MVN", why: "Everything we just gave you came in this. Because if we're going to hand you a welcome pack, we're going to do it without adding to the pile. Small choice. Matters anyway." },
  ],
};

const DEFAULT_SEASONALITY_NORTH: Seasonality = {
  intro: "There's no wrong time. But here's what each season gives you.",
  months: [
    { name: "Jan", level: "best" },
    { name: "Feb", level: "best" },
    { name: "Mar", level: "good" },
    { name: "Apr", level: "good" },
    { name: "May", level: "wet"  },
    { name: "Jun", level: "wet"  },
    { name: "Jul", level: "wet"  },
    { name: "Aug", level: "wet"  },
    { name: "Sep", level: "wet"  },
    { name: "Oct", level: "best" },
    { name: "Nov", level: "best" },
    { name: "Dec", level: "best" },
  ],
  notes: [
    { title: "Best conditions (Oct–Feb)", desc: "Cool, dry, clear skies. Best for trekking and photography. Crowds may be higher around Tết (Jan–Feb)." },
    { title: "Wet season (May–Sep)",      desc: "Greenest landscapes, fullest waterfalls. Occasional afternoon rain — rain-friendly alternatives always built in. No day is cancelled." },
  ],
};

const DEFAULT_UNLOCK_CHALLENGE = {
  sectionLabel: "Signature format",
  headline: "The Unlock Challenge.",
  intro: "Every Morning Vietnam tour has one. A moment that turns your group from strangers into a team. You won't be told the rules — that's the whole point.",
  steps: [
    { num: 1, title: "Wear the wristband",          desc: "On the morning of the tour, your guide hands every traveler a Morning Vietnam wristband. It's how the game knows you're playing." },
    { num: 2, title: "A clue enters the day",        desc: "Somewhere during the trip — your guide won't say when — a card, a signal, or an object enters the picture. From that moment, the game has started." },
    { num: 3, title: "Read it. Move on it. Together.", desc: "Your group has to figure out what to do next. No GPS. No guidance from the guide. Just eyes, instinct, and each other. Win or not, you'll remember this part." },
  ],
  note: "Travelling solo or in pairs? The challenge adapts. The valley doesn't care how many of you there are — only that you're paying attention.",
  teaser: "We won't tell you more. That's the whole point.",
};

// ── Tours ──────────────────────────────────────────────────────────────────

export const tours: Tour[] = [

  // ── Ho Chi Minh: A Life ──────────────────────────────────────────────────
  {
    slug:        "ho-chi-minh-a-life",
    name:        "Ho Chi Minh: A Life",
    region:      "north",
    duration:    ["1 Day", "2D1N"],
    price:       "From $63/person",
    tagline:     "One man changed a nation. One day to understand why.",
    description: "Follow the physical places that shaped Hồ Chí Minh — from Ba Đình Square to the secret wartime base deep in Ba Vì forest. End at a mountain temple built by the people, not the state. Includes Unlock challenge at K9 Đá Chông.",
    highlights:  [
      "Hồ Chí Minh Mausoleum + Stilt House + Museum — the full Ba Đình complex",
      "K9 Đá Chông — the wartime secret base history forgot to mention (Unlock Challenge here)",
      "Sunset at Đền Thờ Bác Hồ, Ba Vì National Park — the temple the people built",
      "Lunch at Bình Hoa Quán — Northwestern Vietnamese food, no English menu, no tourist pricing",
      "2D1N option: Amour Resort Ba Vì + tropical forest hike at dawn",
    ],
    included:    [
      "Transport Hanoi ↔ Ba Vì round trip",
      "All entry fees",
      "Lunch at Bình Hoa Quán",
      "Dedicated host",
      "Unlock Challenge",
      "Welcome pack",
      "Accommodation at Amour Resort (2D1N only)",
      "Breakfast + dinner (2D1N only)",
      "Tropical forest hiking — Ba Vì National Park (2D1N only)",
    ],
    hub:         "Hanoi",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  false,
    image:       "/tours/hcm-a-life/2.webp",

    selectorMode: 'duration-tabs',

    // Duration-based pricing — used by duration switcher in [slug].astro
    durationOptions: [
      {
        id:       "1day",
        label:    "1 Day",
        price:    63,
        priceVND: 1650000,
        tagline:  "Hanoi → Ba Vì → back by 20:00",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Ho Chi Minh: A Life (1 Day, $63)",
      },
      {
        id:       "2d1n",
        label:    "2 Days 1 Night",
        price:    152,
        priceVND: 3980000,
        tagline:  "Add a night in Ba Vì forest + hiking morning",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Ho Chi Minh: A Life (2 Days 1 Night, $152)",
      },
    ],

    itinerary: [
      {
        day: 1,
        title: "The Life",
        slots: [
          "07:30 Meet at Old Quarter, Hanoi",
          "07:30 – 10:50 Hồ Chí Minh Mausoleum · Stilt House · HCM Museum",
          "10:50 – 12:10 Drive to Ba Vì",
          "12:10 – 13:10 Lunch at Bình Hoa Quán",
          "13:10 – 13:50 Drive to K9 Đá Chông",
          "13:50 – 15:20 K9 Đá Chông site + Unlock Challenge",
          "15:20 – 16:05 Drive into Ba Vì National Park",
          "16:05 – 18:05 Đền Thờ Bác Hồ temple · catch the sunset",
          "18:05 – 20:05 Drive back to Hanoi (1-day ends here)",
        ],
      },
      {
        day: 2,
        title: "Into the Forest (2D1N only)",
        slots: [
          "18:05 – 18:30 Drive to Amour Resort Ba Vì",
          "18:30 – 20:00 Dinner in the pine forest · Amour Resort",
          "20:00 – 22:00 Free time — the forest is yours",
          "07:30 – 08:30 Breakfast · pack up",
          "08:30 – 11:30 Tropical forest hike · waterfall · Ba Vì National Park",
          "11:30 – 13:30 Drive back to Hanoi · end of trip",
        ],
      },
    ],

    // ── Extended ──
    priceUSD: 63,
    priceVND: 1650000,
    gallery: [
      { src: "/tours/hcm-a-life/2.webp",  alt: "Ho Chi Minh Mausoleum at Ba Đình Square — honor guard marching in formation" },
      { src: "/tours/hcm-a-life/4.webp",  alt: "Ho Chi Minh Stilt House (Nhà sàn) — traditional red wooden architecture with guards" },
      { src: "/tours/hcm-a-life/9.webp",  alt: "Presidential Palace seen through the tropical garden of the Ba Đình complex" },
      { src: "/tours/hcm-a-life/6.webp",  alt: "Moss-covered tree-lined stone pathway through the Presidential Palace gardens" },
      { src: "/tours/hcm-a-life/5.webp",  alt: "Stone steps through dense forest at the Ho Chi Minh complex grounds" },
      { src: "/tours/hcm-a-life/7.webp",  alt: "Ancient standing stones in the forested grounds of the Ba Đình complex" },
      { src: "/tours/hcm-a-life/8.webp",  alt: "Guard at the underground bomb shelter entrance (Hầm trú ẩn) in the complex" },
      { src: "/tours/hcm-a-life/10.webp", alt: "Tour guide at the Presidential Palace compound with military personnel" },
      { src: "/tours/hcm-a-life/1.webp",  alt: "Iconic portrait of Hồ Chí Minh — the man behind the tour" },
    ],
    pitch: {
      headline: "Most visitors photograph the Mausoleum from behind a rope. Walk away knowing they \"saw\" it.",
      bullets: [
        "Ba Đình Square at 07:30 — before the tour buses arrive",
        "The stilt house he chose over the Presidential Palace next door",
        "K9 Đá Chông — where his body was preserved in secret during the war. Not on most itineraries.",
      ],
      closingLine: "",
    },
    valueAnchor: {
      "1day": {
        headline: "$63. Twelve hours in the places that shaped a nation.",
        paragraphs: [
          "Transport Hanoi return, all entry fees (Mausoleum complex, K9 Đá Chông, Ba Vì National Park), lunch at Bình Hoa Quán, dedicated host for the day, Unlock Challenge, Welcome pack. Nothing to pay on arrival.",
          "The standard Ba Đình city tour charges $20–35 for a guide who walks you past the rope barriers. This goes further — out of Hanoi, into Ba Vì, to places most tours don't cover. The day ends at a mountain temple built by the people, not the state.",
        ],
        compareTable: [
          { metric: "Real experience time", typical: "~3 hrs",      us: "~10 hrs" },
          { metric: "Cultural workshop",    typical: "Performance", us: "You do it" },
          { metric: "Welcome gift pack",    typical: "None",        us: "Curated" },
          { metric: "Game / challenge",     typical: "None",        us: "Unlock Challenge" },
          { metric: "Route design",         typical: "Standard",    us: "Optimized for depth" },
        ],
      },
      "2d1n": {
        headline: "$152. Two days — the mausoleum, the secret forest base, a night in Ba Vì.",
        paragraphs: [
          "Everything in the 1-day, plus: overnight at Amour Resort Ba Vì, breakfast + dinner Day 2, and a morning hike through tropical forest inside Ba Vì National Park. Different quality of day when you're not racing back to Hanoi.",
          "Ba Vì at dawn — before the resort guests are up and the trails are still empty — is a completely different place from the afternoon visit. The 2D1N is built around that.",
        ],
        compareTable: [
          { metric: "Real experience time", typical: "~3 hrs",      us: "~14 hrs across 2 days" },
          { metric: "Cultural workshop",    typical: "Performance", us: "You do it" },
          { metric: "Welcome gift pack",    typical: "None",        us: "Curated" },
          { metric: "Game / challenge",     typical: "None",        us: "Unlock Challenge" },
          { metric: "Route design",         typical: "Standard",    us: "Optimized for depth" },
        ],
      },
    },
    storytelling: {
      headline: "One man's footsteps — a nation's entire story.",
      paragraphs: [
        "Hồ Chí Minh didn't just lead a revolution — he lived one, across continents and decades, before returning to a country he'd given his life to. This day follows the physical places that shaped him: the mausoleum he never wanted, the stilt house he chose over the Presidential Palace, the base where the nation preserved him in secret.",
        "Our Unlock challenge at K9 Đá Chông isn't a treasure hunt — it's a way of seeing. By the time you're piecing together clues in the forest, you're also piecing together why a man who could have had everything chose to live so simply.",
        "Lunch is at Bình Hoa Quán — local Northwestern Vietnamese dishes in Hanoi, no English menu, no tourist pricing. No monuments. Just food, conversation, and the kind of hour that makes a day unforgettable.",
      ],
      pullImage: "/tours/hcm-a-life/4.webp",
    },
    elevationProfile: [
      { time: "07:30", label: "Mausoleum · Stilt House",  elevation: 14,  icon: "landmark", highlight: true  },
      { time: "12:10", label: "Bình Hoa Quán",             elevation: 20,  icon: "food",     highlight: false },
      { time: "13:50", label: "K9 · Unlock Challenge",     elevation: 80,  icon: "unlock",   highlight: true  },
      { time: "16:05", label: "Ho Chi Minh's Temple - Sunset from the peak of Ba Vi Mountain", elevation: 1296, icon: "temple",   highlight: true  },
      { time: "20:05", label: "Back to Hanoi",             elevation: 14,  icon: "return",   highlight: false, durationOnly: "1day" },
      { time: "18:30", label: "Amour Resort",              elevation: 300, icon: "resort",   highlight: false, durationOnly: "2d1n" },
      { time: "08:30", label: "Forest Hike · Ba Vì NP",   elevation: 900, icon: "hike",     highlight: false, durationOnly: "2d1n" },
    ],
    activityCards: [
      {
        badges: ["History"],
        time: "07:30 – 10:50",
        title: "The Mausoleum. The Stilt House. The Life.",
        desc: "Three hours inside the Ba Đình complex — unhurried. The mausoleum he never wanted built. The stilt house he chose over the Presidential Palace next door. The museum that maps 40 years of exile across four continents. By the time you leave, he stops being a monument.",
        highlight: true,
      },
      {
        badges: ["Meal"],
        time: "12:10 – 13:10",
        title: "Bình Hoa Quán — No English Menu",
        desc: "A family restaurant with no English menu and no tour-group tables. You point, they cook. Northwestern Vietnamese dishes made the way they've always been made — the kind of lunch you'll still be talking about at dinner.",
        highlight: false,
      },
      {
        badges: ["History", "Challenge"],
        time: "13:50 – 15:20",
        title: "K9 Đá Chông + Unlock Challenge",
        desc: "During the American War, Hồ Chí Minh worked here in secret — and this is where his body was preserved in the forest before being brought back to the Mausoleum. Not on most itineraries. The Unlock Challenge begins here: no phones, no directions. Your group has to read the place the way he did — by paying attention.",
        highlight: true,
      },
      {
        badges: ["History", "Hiking"],
        time: "16:05 – 18:05",
        title: "Đền Thờ Bác Hồ · 1,296m · Sunset",
        desc: "Over 1,320 stone steps up the mountain face, through primary forest — ancient trees, hanging vines, cloud and silence. The temple sits at 1,296m, the highest peak of Ba Vì. Forest rangers guard it day and night. Arrive at golden hour. Stay until the light is gone.",
        highlight: true,
      },
      {
        badges: ["Accommodation", "Meal"],
        time: "18:30 – 08:00",
        title: "Amour Resort Ba Vì — A Night in the Pines",
        desc: "Pine forest, no city noise, dinner on a balcony that smells like the mountain. The 2-day version of this tour exists because one evening here earns its place in the itinerary.",
        highlight: false,
        durationOnly: "2d1n",
      },
      {
        badges: ["Hiking"],
        time: "08:30 – 11:30",
        title: "Tropical Forest Hike · Ba Vì National Park",
        desc: "Primary rainforest, real waterfalls, biodiversity that doesn't care about your schedule. No trail map — that's what the guide is for. Back in Hanoi by early afternoon.",
        highlight: false,
        durationOnly: "2d1n",
      },
    ],

    tripInfo: {
      "1day": [
        { icon: "map-pin",         label: "Meeting point",     value: "Ho Chi Minh Mausoleum, 07:30" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full day" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "credit-card",     label: "Payment method",    value: "Cash" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "1,296m · Đền Thờ Bác Hồ" },
      ],
      "2d1n": [
        { icon: "map-pin",         label: "Meeting point",     value: "Ho Chi Minh Mausoleum, 07:30" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "home",            label: "Accommodation",     value: "Amour Resort Ba Vì" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full trip" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "credit-card",     label: "Payment method",    value: "Cash" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "1,296m · Đền Thờ Bác Hồ" },
      ],
    },

    welcomePack: DEFAULT_WELCOME_PACK,
    seasonality: DEFAULT_SEASONALITY_NORTH,
    faqs: [
      { q: "Where does the tour depart from?",   a: "We meet at the Ho Chi Minh Mausoleum, Hanoi at 07:30. Exact address comes through after booking — it's a spot you'll recognise." },
      { q: "How much climbing is involved?",      a: "The Đền Thờ Bác Hồ section has over 1,320 steps up the mountain. Not a fitness test — but wear actual shoes, not sandals." },
      { q: "What makes K9 Đá Chông worth a stop?", a: "This was a classified wartime base where Hồ Chí Minh worked in secret during the American War. His body was preserved here in the forest before being brought back to the Mausoleum in Hanoi. Most tours have never heard of it. We go there." },
      { q: "What does the 2D1N version add?",     a: "One night at Amour Resort Ba Vì — pine forest, dinner included, breakfast in the morning. Then a proper tropical forest hike inside Ba Vì National Park before the drive back. It's a different day when you're not watching the clock." },
      ...DEFAULT_FAQS.slice(0, 2),
    ],
    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
    upcomingDates: ["Tue 21 Jul", "Tue 28 Jul"],
  },

  // ── Sa Pa · Lai Châu ──────────────────────────────────────────────────────
  {
    slug:        "sa-pa-lai-chau",
    name:        "Sa Pa · Lai Châu",
    region:      "north",
    duration:    ["1D", "2D1N", "3D2N"],
    price:       "from $123",
    priceUSD:    52,
    priceVND:    4760000,
    tagline:     "Overnight sleeper bus, motorbike or car, ethnic minority villages, a tropical forest trek, and a glass bridge at sunset.",
    description: "Leave Hanoi at night. Wake up in the mist of Sa Pa. Spend two days riding through Vietnam's highest mountain pass into Lai Châu — a valley most travelers never find — then back through jungle trails and a glass bridge at 900m. Home by sunrise.",
    highlights: [
      "O Quy Hồ Pass — Vietnam's highest at 2,050m",
      "Tiên Sơn Cave",
      "Lao Chải 1 Hmong village + traditional blacksmith forge",
      "Waterfall swim at Thác Tác Tình",
      "Overnight homestay at Sì Thâu Chải — Dao village",
      "Tropical forest trek + lunch in the jungle",
      "Cầu Kính Rồng Mây — Dragon Cloud Glass Bridge at sunset",
    ],
    included: [
      "Overnight sleeper bus Hanoi ↔ Sa Pa (both ways)",
      "Motorbike or private car with driver (by option chosen)",
      "All meals from Day 1 breakfast to Day 2 dinner",
      "Homestay at Homestay A Pao · Sì Thâu Chải",
      "All activity & entrance fees",
      "Dedicated Morning Vietnam host",
      "Unlock Challenge",
      "Welcome pack",
    ],
    hub:         "Hanoi",
    hubUrl:      "/tours/sapa-lai-chau",
    cabinUpgrade: {
      labelOn:       "Private cabin (upgraded)",
      labelOff:      "Standard sleeper bus",
      surchargeVND:  200000,
      surchargeUSD:  8,        // $4/person/way × 2 ways = $8 total
      surchargeNote: "+$4/person/way · Your own private sleeping cabin",
    },
    discountPolicy: {
      rules: [
        { label: "Group 10+",          value: "10% off per person" },
        { label: "Children under 1m",  value: "30% off" },
      ],
    },
    languages:   ["EN", "FR", "DE"],
    comingSoon:  false,
    image:       "/tours/lai-chau-motortour/4.webp",
    panoramicImage: "/tours/sapa-trekking-classic/panoramic.jpg",

    elevationMax: 2000,

    durationOptions: [
      // ── Departs Hanoi ──────────────────────────────────────────
      {
        id:       "hanoi-car",
        label:    "Hanoi · Car",
        price:    189,
        priceVND: 4980000,
        tagline:  "Night bus Hanoi → Sa Pa, then private car all day. Departs Sun & Thu nights.",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now · Pay 14 days before · Free cancellation until then",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Lai Châu (From Hanoi, Car Tour, $189/person)",
      },
      {
        id:       "hanoi-motor",
        label:    "Hanoi · Motorbike",
        price:    163,
        priceVND: 4260000,
        tagline:  "Night bus Hanoi → Sa Pa, then self-ride or backseat on a 125cc. Departs Sun & Thu nights.",
        ctaLabel: "I'm in →",
        ctaNote:  "Valid motorbike licence required for self-ride · No payment now · Free cancellation",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Lai Châu (From Hanoi, Motor Tour, $163/person)",
      },
      // ── Departs Hanoi · Single cabin sleeper bus ───────────────
      {
        id:       "hanoi-cabin-car",
        label:    "Hanoi · Cabin · Car",
        price:    197,
        priceVND: 5160000,
        tagline:  "Private single cabin on the sleeper bus Hanoi → Sa Pa, then private car all day. Departs Sun & Thu nights.",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now · Pay 14 days before · Free cancellation until then",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Lai Châu (From Hanoi, Single Cabin + Car, $197/person)",
      },
      {
        id:       "hanoi-cabin-motor",
        label:    "Hanoi · Cabin · Motorbike",
        price:    171,
        priceVND: 4480000,
        tagline:  "Private single cabin on the sleeper bus Hanoi → Sa Pa, then self-ride or backseat on a 125cc. Departs Sun & Thu nights.",
        ctaLabel: "I'm in →",
        ctaNote:  "Valid motorbike licence required for self-ride · No payment now · Free cancellation",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Lai Châu (From Hanoi, Single Cabin + Motorbike, $171/person)",
      },
      // ── Departs Sa Pa ──────────────────────────────────────────
      {
        id:       "sapa-car",
        label:    "Sa Pa · Car",
        price:    147,
        priceVND: 3850000,
        tagline:  "Start from Sa Pa — private car all day. Mon & Fri departures, or any day for groups of 3+.",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now · Pay 14 days before · Free cancellation until then",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Lai Châu (From Sa Pa, Car Tour, $147/person)",
      },
      {
        id:       "sapa-motor",
        label:    "Sa Pa · Motorbike",
        price:    123,
        priceVND: 3230000,
        tagline:  "Start from Sa Pa — self-ride or backseat. Mon & Fri departures, or any day for groups of 3+.",
        ctaLabel: "I'm in →",
        ctaNote:  "Valid motorbike licence required for self-ride · No payment now · Free cancellation",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Lai Châu (From Sa Pa, Motor Tour, $123/person)",
      },
    ],

    itinerary: [
      {
        day: 0,
        title: "Night — Hanoi → Sa Pa",
        slots: [
          "22:00 Board sleeper bus at Old Quarter, Hanoi — sleep your way north",
          "05:30 Arrive Sa Pa",
        ],
      },
      {
        day: 1,
        title: "Into the Northwest",
        slots: [
          "05:30 Freshen up · change & stow your bag (motorbike guests: drop luggage here — your car won't be following)",
          "05:45 Breakfast — chicken phở at Sơn Râu",
          "06:15 Pick up vehicles · motorbike guests: inspect, sign waiver (Mr Cò) · car guests: meet your driver",
          "06:30 Coffee overlooking Mường Hoa Valley",
          "07:30 Depart — cross O Quy Hồ Pass at 2,050m",
          "09:15 Tiên Sơn Cave",
          "10:15 Lao Chải 1 Village — Homestay Cứ A Lồng",
          "11:00 Explore the village with a local guide",
          "12:00 Lunch & afternoon rest",
          "13:30 Hmong blacksmith forge — watch it, then try it",
          "14:45 Ride to Thác Tác Tình waterfall",
          "16:15 Swim. It's cold. Worth it.",
          "17:45 Sunset at Sì Thâu Chải",
          "19:00 Dinner · Homestay A Pao",
        ],
      },
      {
        day: 2,
        title: "Jungle, Glass & Home",
        slots: [
          "07:00 Morning in Sì Thâu Chải — a Dao village above the clouds",
          "08:00 Jungle trek begins + lunch in the forest",
          "14:15 Ride to Rồng Mây Glass Bridge",
          "15:30 Rồng Mây Glass Bridge · sunset from 900m",
          "18:30 Head back to Sa Pa",
          "19:15 Dinner in Sa Pa",
          "20:30 Sa Pa is yours — explore or rest",
          "23:00 Sleeper bus back to Hanoi",
        ],
      },
    ],

    // ── Extended ──
    tripInfo: {
      "hanoi-car": [
        { icon: "map-pin",         label: "Pickup",            value: "Old Quarter, Hanoi · Sun & Thu · 22:00" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "car",             label: "Vehicle",           value: "Sleeper bus (HN↔SaPa) + private car" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast, lunch, dinner × 2 days" },
        { icon: "home",            label: "Accommodation",     value: "Homestay A Pao · Sì Thâu Chải" },
        { icon: "mountain",        label: "Max altitude",      value: "2,050m · O Quy Hồ Pass" },
        { icon: "calendar-check",  label: "Departure days",    value: "Sun & Thu nights · Flexible for groups of 3+" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
      "hanoi-motor": [
        { icon: "map-pin",         label: "Pickup",            value: "Old Quarter, Hanoi · Sun & Thu · 22:00" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "motorbike",       label: "Vehicle",           value: "Sleeper bus (HN↔SaPa) + semi-auto 125cc" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast, lunch, dinner × 2 days" },
        { icon: "home",            label: "Accommodation",     value: "Homestay A Pao · Sì Thâu Chải" },
        { icon: "mountain",        label: "Max altitude",      value: "2,050m · O Quy Hồ Pass" },
        { icon: "calendar-check",  label: "Departure days",    value: "Tue & Wed nights · Flexible for groups of 3+" },
        { icon: "license",         label: "Licence",           value: "Required for self-ride · backseat available" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
      "hanoi-cabin-car": [
        { icon: "map-pin",         label: "Pickup",            value: "Old Quarter, Hanoi · Sun & Thu · 22:00" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "car",             label: "Vehicle",           value: "Private single cabin (HN↔SaPa) + private car" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast, lunch, dinner × 2 days" },
        { icon: "home",            label: "Accommodation",     value: "Homestay A Pao · Sì Thâu Chải" },
        { icon: "mountain",        label: "Max altitude",      value: "2,050m · O Quy Hồ Pass" },
        { icon: "calendar-check",  label: "Departure days",    value: "Sun & Thu nights · Flexible for groups of 3+" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
      "hanoi-cabin-motor": [
        { icon: "map-pin",         label: "Pickup",            value: "Old Quarter, Hanoi · Sun & Thu · 22:00" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "motorbike",       label: "Vehicle",           value: "Private single cabin (HN↔SaPa) + semi-auto 125cc" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast, lunch, dinner × 2 days" },
        { icon: "home",            label: "Accommodation",     value: "Homestay A Pao · Sì Thâu Chải" },
        { icon: "mountain",        label: "Max altitude",      value: "2,050m · O Quy Hồ Pass" },
        { icon: "calendar-check",  label: "Departure days",    value: "Tue & Wed nights · Flexible for groups of 3+" },
        { icon: "license",         label: "Licence",           value: "Required for self-ride · backseat available" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
      "sapa-car": [
        { icon: "map-pin",         label: "Pickup",            value: "Sa Pa town · Mon & Fri mornings" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "car",             label: "Vehicle",           value: "Private car, full day" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast, lunch, dinner" },
        { icon: "home",            label: "Accommodation",     value: "Homestay A Pao · Sì Thâu Chải" },
        { icon: "mountain",        label: "Max altitude",      value: "2,050m · O Quy Hồ Pass" },
        { icon: "calendar-check",  label: "Departure days",    value: "Mon & Fri · Flexible for groups of 3+" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
      "sapa-motor": [
        { icon: "map-pin",         label: "Pickup",            value: "Sa Pa town · Mon & Fri mornings" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "motorbike",       label: "Vehicle",           value: "Semi-auto 125cc Honda, full day" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast, lunch, dinner" },
        { icon: "home",            label: "Accommodation",     value: "Homestay A Pao · Sì Thâu Chải" },
        { icon: "mountain",        label: "Max altitude",      value: "2,050m · O Quy Hồ Pass" },
        { icon: "calendar-check",  label: "Departure days",    value: "Mon & Fri · Flexible for groups of 3+" },
        { icon: "license",         label: "Licence",           value: "Required for self-ride · backseat available" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
    },
    gallery: [
      { src: "/tours/lai-chau-motortour/1.webp",  alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/2.webp",  alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/3.webp",  alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/4.webp",  alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/5.webp",  alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/6.webp",  alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/7.webp",  alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/8.webp",  alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/9.webp",  alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/10.webp", alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/11.webp", alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/12.webp", alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/13.webp", alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/14.webp", alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/15.webp", alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/16.webp", alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/17.webp", alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/18.webp", alt: "Sa Pa · Lai Châu tour" },
      { src: "/tours/lai-chau-motortour/19.webp", alt: "Sa Pa · Lai Châu tour" },
    ],
    pitch: {
      headline: "The road over Vietnam's highest mountain pass — into a valley most travellers have never heard of.",
      bullets: [
        "O Quy Hồ at 2,050m — Vietnam's highest pass. Coaches can't make this run. We can.",
        "Limestone cave, Hmong blacksmith village, waterfall, Dao homestay — none of it on Klook or GetYourGuide",
        "Day 2: 6-hour jungle trek, lunch on the trail, glass bridge at 900m as the light turns gold",
      ],
      closingLine: "Two days. One mountain pass. A valley most tourists will never find.",
    },
    valueAnchor: {
      headline: "From $123. For a route that exists outside the tourist circuit entirely.",
      paragraphs: [
        "There is no Klook listing for O Quy Hồ. No GetYourGuide page for Sì Thâu Chải. The glass bridge at Rồng Mây only opened in 2023 and still has no English-language operator running it properly. We built this route because the northwest deserves better than what the standard Sapa circuit offers.",
        "The price covers sleeper bus both ways, transport all day, all meals, a fully-hosted village homestay, jungle trek with trail lunch, glass bridge entry, Unlock Challenge, and a dedicated host for 48 hours. The only thing not included is whatever you buy at the Sa Pa night market on Day 2.",
      ],
      compareTable: [
        { metric: "Real experience time",  typical: "~4 hrs",          us: "~20 hrs across 2 days" },
        { metric: "Route",                 typical: "Sapa loop",        us: "Sapa → Lai Châu exclusive" },
        { metric: "Max altitude",          typical: "~1,600m (Sapa)",   us: "2,050m · O Quy Hồ Pass" },
        { metric: "Village access",        typical: "Tourist village",  us: "Working Hmong + Dao communities" },
        { metric: "Accommodation",         typical: "Hotel",            us: "Family homestay · no booking platform" },
        { metric: "Unlock Challenge",      typical: "None",             us: "Included" },
      ],
    },
    storytelling: {
      headline: "Lai Châu doesn't have a tourist circuit. That's the point.",
      paragraphs: [
        "Every tour to the northwest runs the same loop: Sa Pa town, Cat Cat village, Fansipan cable car, back to Hanoi. The Hmong villages on that loop know tour groups well. Too well.",
        "O Quy Hồ is only 45 kilometres from Sa Pa. But it might as well be a different country. The pass closes to coaches in bad weather. The villages on the Lai Châu side don't have gift shops — because gift shops require foot traffic, and foot traffic requires a road that buses can use. The homestay at Sì Thâu Chải doesn't have a check-in desk. The family just sets the table.",
        "The jungle trek on Day 2 runs through primary forest above the valley. Six hours, one trail, lunch eaten sitting on tree roots in the middle of it. The glass bridge in the afternoon is the only infrastructure on the whole trip that feels like tourism. Everything else is just — the northwest, working the way it always has.",
      ],
      pullImage: "/tours/lai-chau-motortour/5.webp",
    },
    elevationProfile: [
      { time: "22:00", label: "Depart Hanoi",            elevation: 20,   icon: "van",      highlight: false, day: 0 },
      { time: "05:30", label: "Arrive Sa Pa",             elevation: 1500, icon: "resort",   highlight: false, day: 1 },
      { time: "06:30", label: "Mường Hoa Valley Café",   elevation: 1050, icon: "food",     highlight: false, day: 1 },
      { time: "07:30", label: "O Quy Hồ Pass · 2,050m",  elevation: 2000, icon: "peak",     highlight: true,  day: 1 },
      { time: "09:15", label: "Tiên Sơn Cave", elevation: 700,  icon: "cave",     highlight: true,  day: 1 },
      { time: "10:15", label: "Lao Chải 1 Village",         elevation: 1160, icon: "village",  highlight: false, day: 1 },
      { time: "13:30", label: "Hmong Blacksmith Forge",   elevation: 1160, icon: "culture",  highlight: false, day: 1 },
      { time: "16:15", label: "Thác Tác Tình",            elevation: 1000, icon: "water",    highlight: true,  day: 1 },
      { time: "17:45", label: "Sì Thâu Chải · Sunset",   elevation: 1450, icon: "hike",     highlight: true,  day: 1 },
      { time: "07:00", label: "Dao Village · explore",    elevation: 1450, icon: "landmark", highlight: false, day: 2 },
      { time: "08:00", label: "Jungle Trek begins",       elevation: 1450, icon: "hike",     highlight: true,  day: 2 },
      { time: "14:15", label: "Trail ends · valley",      elevation: 1200, icon: "hike",     highlight: false, day: 2 },
      { time: "15:30", label: "Rồng Mây Glass Bridge",    elevation: 1770, icon: "landmark", highlight: true,  day: 2 },
      { time: "23:00", label: "Sleeper bus to Hanoi",     elevation: 1500, icon: "return",   highlight: false, day: 2 },
    ],
    activityCards: [
      {
        badge: "trek", badgeLabel: "Pass",
        time: "07:30 – 09:15",
        title: "O Quy Hồ — Vietnam's Highest Mountain Pass",
        desc: "2,050 metres. Cloud forest on both sides. The final approach disappears into fog before the summit opens. Car: watch it through the window. Motorbike: feel every metre of altitude gain. Stop at the top as long as you want.",
        highlight: true,
      },
      {
        badge: "culture", badgeLabel: "Cave",
        time: "09:15 – 10:15",
        title: "Tiên Sơn Cave",
        desc: "A limestone cave system in Tam Đường district, Lai Châu — stalactites, stalagmites, and an underground stream. On the Lai Châu side of the pass, off every standard Sapa tour.",
        highlight: false,
      },
      {
        badge: "culture", badgeLabel: "Village",
        time: "10:15 – 14:45",
        title: "Lao Chải 1 Hmong Village + Blacksmith Forge",
        desc: "A working H'Mông community, not a demonstration village. Explore with a local guide, then watch (and try) the traditional blacksmith forge — tools still made the same way they've been made for generations. The forge runs whether we visit or not.",
        highlight: false,
      },
      {
        badge: "free", badgeLabel: "Waterfall",
        time: "16:15 – 17:45",
        title: "Thác Tác Tình — Waterfall Swim",
        desc: "A two-tiered waterfall fed by highland streams in Lai Châu. The pool at the base is clean, cold, and chest-deep at the centre. 90 minutes of actual downtime — bring a swimsuit and use it.",
        highlight: true,
      },
      {
        badge: "culture", badgeLabel: "Homestay",
        time: "17:45 – 07:00",
        title: "Sì Thâu Chải — Dao Village Overnight",
        desc: "A Dao (Yao) minority village never packaged as a tourist attraction. Homestay A Pao is a family home, not a guesthouse. Dinner is cooked in the kitchen next to where you sleep. In the morning the village is yours before anyone else wakes.",
        highlight: true,
      },
      {
        badge: "trek", badgeLabel: "Trek",
        time: "08:00 – 14:15",
        title: "Tropical Forest Trek + Jungle Lunch",
        desc: "6h15 through primary tropical forest above the Lai Châu valley. ~450m elevation gain. Lunch cooked on the trail and eaten in the forest — no tables, no menus. The route connects two valley points unreachable any other way.",
        highlight: true,
      },
      {
        badge: "free", badgeLabel: "Bridge",
        time: "15:30 – 18:30",
        title: "Cầu Kính Rồng Mây — Dragon Cloud Glass Bridge",
        desc: "Opened 2023. 650m long, suspended at 900m above the Lai Châu valley. Glass floor over a 200m drop. Visit late afternoon and the mountains turn deep orange as the sun drops behind the ridge. One of the better sunsets in the northwest.",
        highlight: true,
      },
    ],
    welcomePack: {
      ...DEFAULT_WELCOME_PACK,
      intro: "On the night bus, your host hands you a Morning Vietnam pack. Each item was chosen for what two days at altitude and one night in a Dao village asks of you.",
    },
    seasonality: {
      intro: "Mountain passes have seasons. Pick yours.",
      months: [
        { name: "Jan", level: "best" },
        { name: "Feb", level: "best" },
        { name: "Mar", level: "best" },
        { name: "Apr", level: "good" },
        { name: "May", level: "wet"  },
        { name: "Jun", level: "wet"  },
        { name: "Jul", level: "wet"  },
        { name: "Aug", level: "wet"  },
        { name: "Sep", level: "good" },
        { name: "Oct", level: "best" },
        { name: "Nov", level: "best" },
        { name: "Dec", level: "best" },
      ],
      notes: [
        { title: "Best conditions (Oct – Apr)", desc: "Dry roads, maximum visibility on the pass, rice terraces gold in Oct–Nov. Cloud inversion in the Mường Hoa valley most mornings Jan–Feb — coffee above the clouds is as good as it sounds." },
        { title: "Wet season (May – Sep)",      desc: "The pass can get slippery after heavy rain. We check road conditions every morning of departure. The jungle trek on Day 2 is actually better in light rain — the forest comes alive." },
      ],
    },
    faqs: [
      { q: "Car or motorbike — which should I choose?", a: "Car if you want to focus on scenery, villages, and people without managing a vehicle. Motorbike if you want to feel the altitude physically — the pass at 2,000m on two wheels is a different experience entirely. Same itinerary either way." },
      { q: "Do I need a motorbike licence?", a: "Yes for self-ride — a valid licence with motorcycle endorsement is required. If you want to ride pillion (backseat with our guide), no licence needed. Let us know when booking." },
      { q: "What type of bikes do you use?",  a: "Semi-automatic 125–150cc Hondas, well-maintained and suitable for mountain roads. The same bikes locals use on these roads every day." },
      { q: "How hard is the jungle trek on Day 2?", a: "Moderate. 6 hours on uneven forest trail with ~450m elevation gain. No technical sections — just long. Good footwear matters. If you can walk 3 hours comfortably, you can do this." },
      ...DEFAULT_FAQS.slice(2),
    ],
    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
    upcomingDates: ["Fri 24 Jul"],
  },

  // ── Unlock Mai Châu ──────────────────────────────────────────────────────
  {
    slug:        "unlock-mai-chau",
    name:        "Unlock Mai Châu",
    region:      "north",
    tagline:     "The valley that rewards those who stay.",
    description: "Rice terraces, White Thai families, and challenges you won't find in any guidebook. One day minimum. Three days maximum. The valley decides.",
    duration:    ["1 Day", "2D1N", "3D2N"],
    price:       "From $81/person",
    priceUSD:    81,
    priceVND:    2120000,

    durationOptions: [
      {
        id:       "1day",
        label:    "1 Day",
        price:    81,
        priceVND: 2120000,
        tagline:  "Hanoi → Thung Khe → Mai Châu → back by 10:30 PM",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Unlock Mai Châu (1 Day, $81)",
      },
      {
        id:       "2d1n",
        label:    "2 Days 1 Night",
        price:    134,
        priceVND: 3510000,
        tagline:  "Hanoi → Thung Khe → Mai Châu → overnight → back Day 2",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Unlock Mai Châu (2 Days 1 Night, $134)",
      },
      {
        id:       "3d2n",
        label:    "3 Days 2 Nights",
        price:    211,
        priceVND: 5520000,
        tagline:  "Hanoi → Mai Châu → Pà Cò → Cao Phong → back Day 3",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Unlock Mai Châu (3 Days 2 Nights, $211)",
      },
    ],

    tripInfo: {
      "1day": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, 06:00" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full day" },
        { icon: "calendar-check",  label: "Departure days",    value: "Mon & Fri · Flexible for groups of 3+" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "1,000m · Thung Khe Pass" },
      ],
      "2d1n": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, 06:00" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "home",            label: "Accommodation",     value: "Homestay Trường Huy" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full trip" },
        { icon: "calendar-check",  label: "Departure days",    value: "Tue · Flexible for groups of 3+" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "1,200m · Chiều Cave area" },
      ],
      "3d2n": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, 06:00" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "home",            label: "Accommodation",     value: "Night 1: Homestay Trường Huy · Night 2: A La Homestay" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full trip" },
        { icon: "calendar-check",  label: "Departure days",    value: "Tue · Flexible for groups of 3+" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "1,200m · Pà Cò" },
      ],
    },

    hub:         "Hanoi",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  false,
    selectorMode: 'duration-tabs',
    image:       "/tours/unlock-mai-chau/6.webp",
    gallery: [
      { src: "/tours/unlock-mai-chau/1.webp",  alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/2.webp",  alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/3.webp",  alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/4.webp",  alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/5.webp",  alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/6.webp",  alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/7.webp",  alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/8.webp",  alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/9.webp",  alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/10.webp", alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/11.webp", alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/12.webp", alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/13.webp", alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/14.webp", alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/15.webp", alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/16.webp", alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/17.webp", alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/18.webp", alt: "Unlock Mai Châu tour" },
      { src: "/tours/unlock-mai-chau/19.webp", alt: "Unlock Mai Châu tour" },
    ],
    pitch: {
      "1day": {
        headline: "Twelve hours. The valley most people only photograph from a bus window.",
        bullets: [
          "Thung Khe Pass at 1,000m — before the tour buses arrive",
          "Chiều Cave: 230 steps up the cliff face. Silent inside. Worth every step.",
          "Gò Lào Waterfall — off every standard itinerary. Bring a change of clothes.",
          "Village cycling at golden hour while the Unlock Challenge runs",
          "Batik wax dyeing + bamboo rice with Thai families who've done this their whole lives",
          "Back in Hanoi by 10:30 PM. Tomorrow you'll still be thinking about it.",
        ],
        closingLine: "One day. Real access. No tour group of forty.",
      },
      "2d1n": {
        headline: "Two days. The version where you actually get to stop and stay.",
        bullets: [
          "Everything in the 1-day — the cave, the waterfall, the cycling, the challenge",
          "Night at Homestay Trường Huy: open stilt house, rice field views, hoa ban trees lining the road outside",
          "Trường Huy cooks the best meal in the valley. Dinner + breakfast included.",
          "Day 2: back to Chiều Cave by bicycle, quieter now. Lunch at Gò Lào. Sunset viewpoint on the way out.",
          "Back in Hanoi Day 2. You'll wish you'd booked the 3-day.",
        ],
        closingLine: "Overnight in a place most visitors only drive through.",
      },
      "3d2n": {
        headline: "Three days. Two ethnic groups. One trip that covers more ground than most people's two-week itinerary.",
        bullets: [
          "Day 1–2: Mai Châu — cave, waterfall, cycling, White Thai homestay with the best cook in the valley",
          "Day 2 afternoon: road climbs to Pà Cò at 1,200m — different valley, different people, different world",
          "Night 2 at A La Homestay: Hmong food, rice wine, paper-making tools on the table",
          "Day 3 dawn: cloud hunting above Hang Kia. On clear mornings the valley disappears below you.",
          "Day 3: Hmong handmade paper workshop in Pà Cò. Cao Phong orange farm on the drive home.",
          "Back in Hanoi Day 3 evening. Two cultures, three days, zero filler.",
        ],
        closingLine: "This is the version people come back to tell us about.",
      },
    },
    storytelling: {
      headline: "The valley that doesn't let you stay a stranger.",
      paragraphs: [
        "Mai Châu sits 135km from Hanoi but feels like a different century. The valley floor is a patchwork of rice paddies tended by White Thai families who have lived here for generations — and who open their stilt houses to a small group of travellers exactly like you.",
        "We don't do the tourist homestay circuit. Our hosts are families we know personally. You'll cook with the women, eat with the household, and spend the evening on a bamboo platform watching fireflies appear over the fields. The Unlock challenge runs through the village at golden hour — a set of riddles and tasks that forces your group out of passive observer mode and into something much more interesting.",
        "Day two is slower and better for it. A sunrise walk before the valley wakes. A cooking class using ingredients you pick yourself. A hike to the waterfall nobody visits because it's not on any list. Then a farewell lunch that somehow feels like you've been coming back here for years.",
      ],
      pullImage: "https://images.unsplash.com/photo-1528127269322-539801943592?w=1200&q=85",
    },
    valueAnchor: {
      "1day": {
        headline: "$89. Work out what that covers.",
        paragraphs: [
          "Transport from Hanoi (return), lunch, dinner, all activity fees, cave entrance, dedicated host for 12 hours. The Unlock Challenge included.",
          "Most day tours to Mai Châu charge $40–50 for a bus seat, a buffet, and a photo stop. This is what the other $35–45 buys: actual access, small group, and a guide who knows the valley personally.",
          "10% group discount for 4+ people booking direct.",
        ],
        compareTable: [
          { metric: "Real experience time", typical: "~4 hrs",      us: "~8 hrs" },
          { metric: "Cultural workshop",    typical: "Performance", us: "You do it" },
          { metric: "Welcome gift pack",    typical: "None",        us: "Curated" },
          { metric: "Game / challenge",     typical: "None",        us: "Unlock Challenge" },
          { metric: "Route design",         typical: "Standard",    us: "Optimized for depth" },
        ],
      },
      "2d1n": {
        headline: "$151. Two days, everything included — do the math.",
        paragraphs: [
          "Transport (return), all meals Day 1 lunch through Day 2 lunch, homestay accommodation, all activities across both days, dedicated host. Nothing to pay on arrival.",
          "A comparable overnight tour elsewhere charges $80–100 for transport + room alone. Content — the cave, the waterfall, the challenge, the workshop — is extra, or absent.",
          "7% group discount for 4+ people booking direct.",
        ],
        compareTable: [
          { metric: "Real experience time", typical: "~4 hrs",      us: "~14 hrs across 2 days" },
          { metric: "Cultural workshop",    typical: "Performance", us: "You do it" },
          { metric: "Welcome gift pack",    typical: "None",        us: "Curated" },
          { metric: "Game / challenge",     typical: "None",        us: "Unlock Challenge" },
          { metric: "Route design",         typical: "Standard",    us: "Optimized for depth" },
        ],
      },
      "3d2n": {
        headline: "$233. Three days, two valleys, two cultures. The math is embarrassing.",
        paragraphs: [
          "Everything in the 2D1N, plus: a second night at A La Homestay in Pà Cò, all Day 3 meals, Hmong paper workshop, cloud hunt at Hang Kia, Cao Phong orange farm stop. Both homestays included.",
          "You'd spend more than this booking accommodation alone across three nights in the north — without the transport, the host, or any of the access.",
          "5% group discount for 4+ people booking direct.",
        ],
        compareTable: [
          { metric: "Real experience time", typical: "~4 hrs",      us: "~20 hrs across 3 days" },
          { metric: "Cultural workshop",    typical: "Performance", us: "You do it" },
          { metric: "Welcome gift pack",    typical: "None",        us: "Curated" },
          { metric: "Game / challenge",     typical: "None",        us: "Unlock Challenge" },
          { metric: "Route design",         typical: "Standard",    us: "Optimized for depth" },
        ],
      },
    },
    elevationProfile: [
      { time: "06:00", label: "Depart Hanoi",            elevation: 20,   icon: "van",      highlight: false },
      { time: "09:00", label: "Thung Khe Pass",           elevation: 1000, icon: "mountain", highlight: true  },
      { time: "10:00", label: "Chiều Cave",               elevation: 470,  icon: "cave",     highlight: true  },
      { time: "12:00", label: "Lunch · Homestay",         elevation: 220,  icon: "food",     highlight: false },
      { time: "14:15", label: "Gò Lào Waterfall",         elevation: 180,  icon: "water",    highlight: true  },
      { time: "15:45", label: "Village Cycling",          elevation: 240,  icon: "bike",     highlight: false },
      { time: "20:45", label: "Dinner · Hoà Bình",        elevation: 20,   icon: "food",     highlight: false, durationOnly: "1day" },
      { time: "18:30", label: "Homestay Trường Huy",      elevation: 220,  icon: "resort",   highlight: false, durationOnly: "2d1n" },
      { time: "15:00", label: "Sunset Viewpoint",         elevation: 400,  icon: "temple",   highlight: false, durationOnly: "2d1n" },
      { time: "16:30", label: "Pà Cò · A La Homestay",   elevation: 1200, icon: "resort",   highlight: true,  durationOnly: "3d2n" },
      { time: "07:00", label: "Cloud Hunt · Hang Kia",    elevation: 1200, icon: "hike",     highlight: true,  durationOnly: "3d2n" },
      { time: "15:45", label: "Cao Phong Orange Farm",    elevation: 200,  icon: "landmark", highlight: false, durationOnly: "3d2n" },
      { time: "22:45", label: "Back to Hanoi",             elevation: 20,   icon: "return",   highlight: false, durationOnly: "1day" },
      { time: "19:45", label: "Back to Hanoi",             elevation: 20,   icon: "return",   highlight: false, durationOnly: "2d1n" },
      { time: "18:40", label: "Back to Hanoi",             elevation: 20,   icon: "return",   highlight: false, durationOnly: "3d2n" },
    ],
    activityCards: [
      {
        badges: ["Hiking"],
        time: "09:00 – 09:25",
        title: "Thung Khe Pass — First Stop, First View",
        desc: "The road to Mai Châu crests at 1,000m. You stop here before the day officially starts — mist in the valley below, limestone peaks above, almost no one else around at this hour. It's a 25-minute stop that resets whatever mood you arrived with.",
        highlight: false,
      },
      {
        badges: ["Hiking", "Nature"],
        time: "09:25 – 11:45",
        title: "Chiều Cave — 230 Steps Into the Mountain",
        desc: "A stone staircase cut into the cliff face leads up 230m to a cave the tour buses don't reach. Inside: stalactites, silence, and a view back over the valley through the mouth of the rock. The climb takes about 30 minutes. The descent is easier. Both are worth it.",
        highlight: true,
      },
      {
        badges: ["Meal"],
        time: "12:00 – 13:30",
        title: "Thai Ethnic Lunch — Homestay Trường Huy",
        desc: "Cooked by the family, not catered. Sticky rice, grilled river fish, wild vegetables, fermented pork in bamboo. Eat on the open deck with the rice fields in front of you. This is not a restaurant — it's lunch the way the valley eats it.",
        highlight: true,
      },
      {
        badges: ["Nature"],
        time: "14:15 – 15:00",
        title: "Gò Lào Waterfall — Off Every Standard Route",
        desc: "Seven minutes off the main road, down a path that most day tours don't bother with. The waterfall drops into a pool wide enough to swim in. Bring a change of clothes. The water is cold in the best way.",
        highlight: false,
      },
      {
        badges: ["Challenge", "Culture"],
        time: "15:45 – 18:00",
        title: "Village Cycling + Unlock Challenge",
        desc: "Borrow a bike. Ride through White Thai villages at golden hour — paddy fields on both sides, water buffalo in the distance. While you cycle, the Unlock Challenge runs: your group is navigating a set of clues hidden somewhere in the valley. First to complete all tasks wins.",
        highlight: true,
      },
      {
        badges: ["Culture"],
        time: "~18:00",
        title: "Workshop: Batik Wax Dyeing + Bamboo Rice",
        desc: "Two crafts in one session. First: wax-resist fabric dyeing with Thai women — a technique passed down through generations, done with tools that haven't changed. Second: sticky rice cooked inside bamboo over an open fire. You make both. You keep the fabric.",
        highlight: false,
      },
      {
        badges: ["Meal"],
        time: "20:00 – 20:45",
        title: "Dinner on the Road — Hoà Bình",
        desc: "On the way back to Hanoi. A local restaurant stop included in your price — not a tourist trap, not a highway rest stop. Last meal before the city.",
        highlight: false,
        durationOnly: "1day",
      },
      {
        badges: ["Accommodation", "Meal"],
        time: "18:30 – 08:00",
        title: "Homestay Trường Huy — The Guy Who Cooks Best in the Valley",
        desc: "Open-plan stilt house. Wide deck. Views over a road lined with hoa ban trees and rice fields that go quiet after dark. Trường Huy runs this place himself — and the food he puts out for dinner will change your opinion of what homestay cooking can be. Breakfast is included. Sleep well.",
        highlight: true,
        durationOnly: "2d1n",
      },
      {
        badges: ["Hiking", "Nature"],
        time: "08:30 – 11:00",
        title: "Day 2 — Back to Chiều Cave, Quieter Now",
        desc: "You go back to the cave by bicycle from the homestay. Same staircase, different light, no one from yesterday's tour group. This time you know what's at the top.",
        highlight: false,
        durationOnly: "2d1n",
      },
      {
        badges: ["Nature", "Meal"],
        time: "12:15 – 13:45",
        title: "Lunch at Gò Lào Waterfall",
        desc: "Lunch laid out beside the water. You've already earned it — this time it's slower, and you can swim again after.",
        highlight: false,
        durationOnly: "2d1n",
      },
      {
        badges: ["Nature"],
        time: "15:00 – 15:45",
        title: "Sunset Viewpoint",
        desc: "The valley from above, at the hour when the light is best. Last stop before the road back — or, if you're staying another night, before the road climbs higher.",
        highlight: false,
        durationOnly: "2d1n",
      },
      {
        badges: ["Accommodation", "Culture"],
        time: "16:30 – 07:00",
        title: "Night 2 — A La Homestay · Pà Cò with the Hmong",
        desc: "The road climbs from Mai Châu to Pà Cò at 1,200m — a different valley, a different ethnic group, a completely different atmosphere. A La Homestay sits at the edge of the village. Dinner is Hmong food. The evening is a cultural exchange with the family: music, rice wine, paper-making tools on the table. Sleep under more stars than you've seen in a while.",
        highlight: true,
        durationOnly: "3d2n",
      },
      {
        badges: ["Nature"],
        time: "07:00 – 08:30",
        title: "Cloud Hunting — Hang Kia at Dawn",
        desc: "Alarm at 06:30. Drive 10 minutes to the cloud sea viewpoint above Hang Kia. On clear mornings, the valley below disappears entirely — you're standing above the clouds while the sun comes up through them. On foggy mornings, you're inside the cloud. Either way, it's the kind of thing you come back for.",
        highlight: true,
        durationOnly: "3d2n",
      },
      {
        badges: ["Culture"],
        time: "09:00 – 11:30",
        title: "Hmong Paper Making Workshop — Pà Cò",
        desc: "Giấy giang — handmade paper from the rattan plant, a craft that belongs specifically to the Hmong people of this area. You pulp the fiber, press it into sheets, dry it in the mountain air. A two-hour session that produces something you'll actually bring home.",
        highlight: false,
        durationOnly: "3d2n",
      },
      {
        badges: ["Nature", "Meal"],
        time: "15:45 – 16:15",
        title: "Cao Phong Orange Farm — Pick Your Own",
        desc: "On the drive back to Hanoi, the road passes through Cao Phong — Vietnam's most famous orange-growing district. You stop, walk the orchard, pick directly from the tree, and eat them on the spot. It costs nothing extra. It tastes better than any orange you've bought in a shop.",
        highlight: false,
        durationOnly: "3d2n",
      },
    ],
    welcomePack: DEFAULT_WELCOME_PACK,
    seasonality: DEFAULT_SEASONALITY_NORTH,
    faqs: DEFAULT_FAQS,
    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
    upcomingDates: ["Sat 25 Jul", "Thu 30 Jul", "Sun 2 Aug"],
  },

  // ── Mai – Mộc in 1 Trip ──────────────────────────────────────────────────
  {
    slug:        "mai-moc-in-1-trip",
    name:        "Mai – Mộc in 1 Trip",
    region:      "north",
    duration:    ["3D2N"],
    price:       "from $216",
    tagline:     "Two valleys, two ethnic groups, one trek most people never find.",
    description: "Mai Châu to Mộc Châu in three days. White Thai villages, a cave most tours don't climb to, natural hot springs, a night with a Hmong family at 1,200m, cloud hunting at dawn, and a forest trek connecting two villages that doesn't appear on any standard itinerary.",
    highlights: [
      "Trek: Phiêng Cành → Hang Táu — primary forest, guide-only, not on any operator's list",
      "Bò Ấm natural hot springs",
      "Cloud hunting above Hang Kia at dawn",
      "Two homestays: White Thai + Hmong",
      "Unlock Challenge · Village edition",
    ],
    included: [
      "Transport from Hanoi (return)",
      "All meals Day 1 lunch → Day 3 dinner",
      "2 nights accommodation",
      "All activity & entrance fees",
      "Dedicated host, 3 days",
      "Unlock Challenge",
    ],
    hub:        "Hanoi",
    languages:  ["EN", "FR", "DE"],
    comingSoon: false,
    selectorMode: 'vehicle-only',
    image:      "/tours/mai-moc-in-1-trip/6.webp",

    durationOptions: [
      {
        id:       "3d2n",
        label:    "3 Days 2 Nights",
        price:    216,
        priceVND: 5660000,
        tagline:  "Hanoi → Mai Châu → Pà Cò → Hang Táu → back Day 3",
        ctaLabel: "I'm in →",
        ctaNote:  "Tell us your travel dates and group size — we'll get back to you within 24 hours.",
        waText:   "Hi Morning Vietnam — I'd like to inquire about Mai – Mộc in 1 Trip (3 Days 2 Nights)",
      },
    ],

    priceUSD: 216,
    priceVND: 5660000,

    gallery: [
      { src: "/tours/mai-moc-in-1-trip/1.webp",  alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/2.webp",  alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/3.webp",  alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/4.webp",  alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/5.webp",  alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/6.webp",  alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/7.webp",  alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/8.webp",  alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/9.webp",  alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/10.webp", alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/11.webp", alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/12.webp", alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/13.webp", alt: "Mai – Mộc in 1 Trip" },
      { src: "/tours/mai-moc-in-1-trip/14.webp", alt: "Mai – Mộc in 1 Trip" },
    ],

    pitch: {
      "3d2n": {
        headline: "The standard Mai Châu day tour shows you the valley from a distance. This one puts you in it for three days.",
        bullets: [
          "Two valleys, two ethnic groups: White Thai in Mai Châu, H'Mông in Pà Cò at 1,200m",
          "The Phiêng Cành → Hang Táu trek: 4 hours through primary forest, no trail markers, not on any operator's menu",
          "Day 3 dawn: Hang Kia valley disappears into the clouds. You're standing above it.",
        ],
        closingLine: "Two valleys. One trip. Nothing like it on the market.",
      },
    },

    valueAnchor: {
      "3d2n": {
        headline: "Three days. Two homestays. A jungle trek no operator has built before.",
        paragraphs: [
          "Transport Hanoi return, all meals Day 1 lunch through Day 3 dinner, two nights accommodation (Homestay Trường Huy + A La Pà Cò), all activity and entrance fees, Unlock Challenge, dedicated host for 3 days. Nothing to decide or pay on arrival.",
          "The Phiêng Cành → Hang Táu trek alone isn't something you can book independently — it needs a local guide who knows the route, motorbike taxi coordination at Hang Táu, and timing built around the rest of the itinerary. That's what the host handles.",
          "Small groups. We never combine groups.",
        ],
        compareTable: [
          { metric: "Real experience time", typical: "~4 hrs",      us: "~22 hrs across 3 days" },
          { metric: "Cultural workshop",    typical: "Performance", us: "You do it" },
          { metric: "Welcome gift pack",    typical: "None",        us: "Curated" },
          { metric: "Game / challenge",     typical: "None",        us: "Unlock Challenge" },
          { metric: "Route design",         typical: "Standard",    us: "Optimized for depth" },
        ],
      },
    },

    storytelling: {
      headline: "One road connects two completely different worlds.",
      paragraphs: [
        "Mai Châu sits in a wide flat valley — rice paddies, White Thai stilt houses, roads lined with hoa ban blossom. It's easy, warm, and built for cycling. You arrive on Day 1 and wonder why you ever thought a day trip would be enough.",
        "Then the road climbs. Pà Cò is 1,200m up and feels nothing like the valley below — narrower, cooler, mist-covered in the morning, home to Hmong families whose language, food, and crafts have almost nothing in common with the Thai people 40km behind you. Two ethnic groups, one trip.",
        "Day 3 is the trek. Phiêng Cành to Hang Táu is not on any standard itinerary — a 2-hour route through primary forest connecting two Hmong villages, done on foot with a guide who knows every turn. You come out the other side at Hang Táu knowing you covered ground most visitors never reach.",
      ],
      pullImage: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200&q=85",
    },

    elevationProfile: [
      { time: "06:00", label: "Depart Hanoi",          elevation: 20   },
      { time: "09:00", label: "Thung Khe Pass",         elevation: 1000, highlight: true  },
      { time: "10:10", label: "Homestay Trường Huy",    elevation: 220  },
      { time: "14:30", label: "Village Cycling",        elevation: 240  },
      { time: "20:00", label: "Cultural Exchange",      elevation: 220  },
      { time: "08:30", label: "Chiều Cave",             elevation: 470,  highlight: true  },
      { time: "13:45", label: "Gò Lào Waterfall",       elevation: 180,  highlight: true  },
      { time: "15:30", label: "Bò Ấm Hot Springs",      elevation: 200  },
      { time: "17:30", label: "A La Homestay · Pà Cò",  elevation: 1200, highlight: true  },
      { time: "06:30", label: "Cloud Hunt · Hang Kia",  elevation: 1200, highlight: true  },
      { time: "09:30", label: "Trek: Phiêng Cành",      elevation: 900,  highlight: true  },
      { time: "11:30", label: "Hang Táu",               elevation: 700  },
      { time: "19:45", label: "Dinner · Hoà Bình",      elevation: 20   },
      { time: "21:45", label: "Back to Hanoi",          elevation: 20   },
    ],

    activityCards: [
      {
        badges: ["Hiking"],
        time: "09:00 – 09:25",
        title: "Thung Khe Pass — The Gateway View",
        desc: "The road crests at 1,000m before dropping into the valley. First stop. Mist below, limestone peaks above. The kind of view that makes the 3-hour drive feel worth it before the day even starts.",
        highlight: false,
      },
      {
        badges: ["Culture", "Meal"],
        time: "11:25 – 14:30",
        title: "Lunch + Bản Văn Cycling · Day 1",
        desc: "Lunch at Homestay Trường Huy — cooked by the family, not catered. Then out on bicycles through Bản Văn: flat paddy roads, water buffalo, almost no other tourists in the late morning.",
        highlight: false,
      },
      {
        badges: ["Challenge", "Culture"],
        time: "14:30 – 17:00",
        title: "Village Cycling + Unlock Challenge",
        desc: "Golden hour on two wheels through White Thai villages. The Unlock Challenge runs while you cycle — your group navigates clues hidden somewhere in the valley. First to complete all tasks wins.",
        highlight: true,
      },
      {
        badges: ["Accommodation", "Meal"],
        time: "18:30 – 08:00",
        title: "Homestay Trường Huy — Night 1",
        desc: "Open-plan stilt house, wide deck, rice field views. Trường Huy runs this place himself — dinner and breakfast included, and the food will recalibrate your expectations of what homestay cooking can be.",
        highlight: true,
      },
      {
        badges: ["Hiking", "Nature"],
        time: "08:30 – 11:00",
        title: "Chiều Cave — 230 Steps Into the Mountain",
        desc: "Stone staircase cut into the cliff face, 230m up to a cave carved into the mountainside. Stalactites, silence, and a view back over the valley through the mouth of the rock. Takes about 30 minutes each way.",
        highlight: true,
      },
      {
        badges: ["Nature"],
        time: "12:15 – 15:00",
        title: "Gò Lào Waterfall + Bò Ấm Hot Springs",
        desc: "Lunch beside the waterfall, then 7 minutes to a pool wide enough to swim in — off the standard route, almost always empty. Followed by Bò Ấm: a managed natural hot spring tucked into the valley. Cold swim, hot soak.",
        highlight: false,
      },
      {
        badges: ["Accommodation", "Culture"],
        time: "17:30 – 06:30",
        title: "Night 2 — A La Homestay · Pà Cò with the Hmong",
        desc: "The road climbs 40km from Mai Châu to Pà Cò at 1,200m. Different valley, different people, different atmosphere entirely. Dinner is Hmong food. The evening is a cultural exchange — music, rice wine, conversation with a family living above the clouds.",
        highlight: true,
      },
      {
        badges: ["Nature"],
        time: "06:30 – 08:00",
        title: "Cloud Hunting — Hang Kia at Dawn",
        desc: "Drive 10 minutes to the viewpoint above Hang Kia before breakfast. On clear mornings the valley disappears — you're above the cloud layer as the sun rises through it. On misty mornings, you're inside the cloud.",
        highlight: true,
      },
      {
        badges: ["Hiking", "Nature"],
        time: "09:30 – 14:30",
        title: "Trek: Phiêng Cành → Hang Táu",
        desc: "A 2-hour route through primary forest connecting two Hmong villages — no trail markers, no tourist infrastructure, guide-only. Start at Phiêng Cành at ~900m, come out at Hang Táu at ~700m. Lunch on the trail. Xe ôm down to the pickup point.",
        highlight: true,
      },
      {
        badges: ["Meal"],
        time: "19:45 – 20:30",
        title: "Dinner on the Road — Hoà Bình",
        desc: "Last stop before Hanoi. Local restaurant, included in your price. A proper meal before the final stretch.",
        highlight: false,
      },
    ],

    tripInfo: {
      "3d2n": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, 06:00" },
        { icon: "calendar",        label: "Departure",         value: "Mon · Groups of 3+ can choose any day" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "home",            label: "Accommodation",     value: "Trường Huy + A La, Pà Cò" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, 3 days" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "credit-card",     label: "Payment method",    value: "Cash" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "Thung Khe 1,000m · Pà Cò 1,200m" },
      ],
    },

    welcomePack:     DEFAULT_WELCOME_PACK,
    seasonality:     DEFAULT_SEASONALITY_NORTH,
    faqs:            DEFAULT_FAQS,
    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
  },

  // ── Mũi Đôi — First Sunrise ─────────────────────────────────────────────
  {
    slug:        "mui-doi-first-sunrise",
    name:        "Vietnam's Easternmost Point",
    subtitle:    "Trek & Camp to Vietnam's Easternmost Point — First Sunrise at Mũi Đôi",
    region:      "central",
    duration:    ["2D1N"],
    price:       "From $134/person",
    priceUSD:    134,
    priceVND:    3500000,
    priceNote:   "From $123 / 3,200,000 ₫ for groups of 5+",
    tagline:     "Trek wild coastline, camp on a deserted beach, and watch the first sunrise to touch Vietnamese territory.",
    description: "Two days on Vietnam's most remote coastal trail, ending at Mũi Đôi — the easternmost point of the Vietnamese mainland. No road reaches here. Trek from Đầm Môn fishing village through scrub forest and wild coast to Bãi Rạng beach camp on Day 1. Pre-dawn on Day 2, follow the cliff path 500m to the headland. Mũi Đôi is the first land in Vietnam to see the sun each morning. BBQ beach dinner, boat transfer to Bãi Thắm, and back to Nha Trang by afternoon.",
    highlights: [
      "Mũi Đôi — Vietnam's easternmost mainland point: the first sunrise in the country lands here",
      "Pre-dawn cliff trek at 04:30 — 500m coastal trail in darkness to the headland",
      "Wild beach camp at Bãi Rạng — BBQ seafood dinner by the South China Sea",
      "Vân Phong Bay — one of Vietnam's 21 National Tourist Areas, pristine and without mass tourism",
      "Bãi Thắm — one of Vietnam's most beautiful beaches, accessible only by boat or sand dune crossing",
    ],
    included: [
      "Transport Nha Trang ↔ Đầm Môn (van both ways)",
      "All meals: 2 breakfasts, 2 lunches, 1 BBQ beach dinner",
      "Camping equipment: tents + sleeping mats (bring own sleeping bag or liner)",
      "Boat transfer Bãi Rạng → Bãi Thắm",
      "Local guide (Đầm Môn-based)",
      "Dedicated Morning Vietnam host",
      "Welcome pack",
    ],
    hub:        "Nha Trang",
    languages:  ["EN", "FR", "DE"],
    comingSoon: false,
    image:      "/tours/mui-doi/1.webp",

    selectorMode: 'vehicle-only',

    discountPolicy: {
      rules: [
        { label: "1 – 4 people",  value: "$134 / 3,500,000 ₫ per person" },
        { label: "5 – 12 people", value: "$123 / 3,200,000 ₫ per person" },
      ],
    },

    panoramicImage: "/tours/mui-doi/panoramic.webp",

    gallery: [
      { src: "/tours/mui-doi/1.webp",  alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/2.webp",  alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/3.webp",  alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/4.webp",  alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/5.webp",  alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/6.webp",  alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/7.webp",  alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/8.webp",  alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/9.webp",  alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/10.webp", alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/11.webp", alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/12.webp", alt: "Vietnam's Easternmost Point — Mũi Đôi" },
      { src: "/tours/mui-doi/13.webp", alt: "Vietnam's Easternmost Point — Mũi Đôi" },
    ],

    durationOptions: [
      {
        id:       "2d1n",
        label:    "2D1N",
        price:    134,
        priceVND: 3500000,
        tagline:  "Nha Trang → Đầm Môn · coastal trek · wild beach camp · Mũi Đôi sunrise · Bãi Thắm → Nha Trang",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now · Pay 14 days before · Free cancellation until then",
        waText:   "Hi Morning Vietnam — I'd like to book Vietnam's Easternmost Point — Mũi Đôi (2D1N, $134/person)",
      },
    ],

    tripInfo: {
      "2d1n": [
        { icon: "map-pin",         label: "Pickup",       value: "Nha Trang hotel · Saturdays · 05:30" },
        { icon: "users",           label: "Group size",   value: "3 – 12 people joined · 6+ for private departure" },
        { icon: "car",             label: "Transport",    value: "Van Nha Trang ↔ Đầm Môn + boat transfer Day 2" },
        { icon: "tools-kitchen-2", label: "Meals",        value: "2 breakfasts · 2 lunches · 1 BBQ beach dinner" },
        { icon: "home",            label: "Camping",      value: "Wild beach camp · Bãi Rạng · tents + mats provided" },
        { icon: "mountain",        label: "Trekking",     value: "~12km over 2 days · coastal + cliff section · moderate" },
        { icon: "calendar-check",  label: "Departures",   value: "Every Saturday · private groups of 6+ flexible" },
        { icon: "user-check",      label: "Min. age",     value: "Children 5+ welcome · must be with parent / guardian" },
        { icon: "plane",           label: "Add-on",       value: "Nha Trang flight package available on request" },
      ],
    },

    pitch: {
      headline: "Vietnam's first sunrise lands here, on this headland, at the eastern edge of everything.",
      bullets: [
        "Mũi Đôi: Vietnam's easternmost mainland point — the first land in the country to see each day's light",
        "4:30am departure in darkness — 500m cliff trail, the South China Sea dropping away on both sides",
        "No road gets here. Two days of coastal trekking and one wild beach night to earn it.",
      ],
      closingLine: "Two days. One cliff. The first light in Vietnam.",
    },

    valueAnchor: {
      "2d1n": {
        headline: "From $134. Two days, a wild beach camp, and a sunrise at the easternmost point in Vietnam.",
        paragraphs: [
          "Included: van Nha Trang ↔ Đầm Môn, all meals (2 breakfasts, 2 lunches, 1 BBQ beach dinner), tents and sleeping mats, boat transfer to Bãi Thắm, local guide, Morning Vietnam host, welcome pack. Sleeping bag or liner recommended — not included.",
          "There is no standard tour to Mũi Đôi. Day boat trips to Vân Phong Bay take you around the headland — you see it from the water. To stand at the tip at sunrise requires 2 days. This is the only packaged route that gets you there.",
        ],
        compareTable: [
          { metric: "Getting to Mũi Đôi", typical: "Day boat · anchored offshore",    us: "2-day trek · standing on the headland" },
          { metric: "The sunrise",         typical: "From water · looking at a cliff", us: "From the tip · first light in Vietnam" },
          { metric: "Overnight",           typical: "Hotel in Nha Trang",              us: "Wild camp · Bãi Rạng · South China Sea" },
          { metric: "Other tourists",      typical: "Nha Trang beach crowd",           us: "Likely just your group" },
          { metric: "Seafood dinner",      typical: "Restaurant · Nha Trang",          us: "BBQ on the beach · at camp" },
          { metric: "Group size",          typical: "Open groups · varies",            us: "3 – 12 people · your group only" },
        ],
      },
    },

    storytelling: {
      headline: "Vân Phong Bay — one of Vietnam's last pristine bays, and the door to a coastline almost nobody reaches.",
      paragraphs: [
        "Vân Phong Bay sits on the northern coast of Khánh Hòa province, about 50km north of Nha Trang. It is one of Vietnam's 21 designated National Tourist Areas — selected for its deep, sheltered natural harbour and coral reef ecosystems that remain largely intact. The bay is known for lobster farming and fishing. What it isn't known for is resorts. There aren't any.",
        "Đầm Môn is the fishing village at the base of the peninsula, in Vạn Ninh district. The road ends here. South of the village, the coast becomes scrub forest and wild trail — a narrow strip of land with the South China Sea on the east and the sheltered bay on the west. The trail to Mũi Đôi covers roughly 12km over 2 days, passing two remote beaches before reaching the headland.",
        "Mũi Đôi is Vietnam's easternmost mainland point, at approximately 109°28'E longitude. Because of this, it receives the first sunlight of any point on the Vietnamese mainland each morning. The headland is a rocky cliff above the sea, accessible only on foot via the trail from Bãi Rạng camp. The final 500m of trail follows the cliff edge above open ocean.",
        "Bãi Thắm — sometimes called Chú Năm beach — is reached by boat on Day 2 morning. It is a wide arc of white sand accessible only by water or by crossing the sand dunes from the road. No development, no facilities, no entrance gate. It is regularly described by those who've been there as one of the most beautiful beaches in Vietnam. Most people have never heard of it.",
      ],
      pullImage: "/tours/mui-doi/storytelling.webp",
    },

    elevationProfile: [
      { time: "05:30", label: "Nha Trang pickup",      elevation: 5,  icon: "van",    highlight: false, day: 1 },
      { time: "07:30", label: "Đầm Môn · breakfast",   elevation: 10, icon: "food",   highlight: false, day: 1 },
      { time: "08:00", label: "Trek begins",            elevation: 10, icon: "hike",   highlight: false, day: 1 },
      { time: "10:00", label: "Coastal hill section",   elevation: 75, icon: "hike",   highlight: false, day: 1 },
      { time: "11:30", label: "Bãi Na · packed lunch",  elevation: 5,  icon: "food",   highlight: false, day: 1 },
      { time: "13:30", label: "Scrub forest trail",     elevation: 80, icon: "hike",   highlight: false, day: 1 },
      { time: "16:30", label: "Bãi Rạng · camp",       elevation: 5,  icon: "resort", highlight: false, day: 1 },
      { time: "18:00", label: "BBQ beach dinner",       elevation: 5,  icon: "food",   highlight: true,  day: 1 },

      { time: "04:30", label: "Depart camp in darkness", elevation: 5,  icon: "hike",   highlight: false, day: 2 },
      { time: "05:30", label: "Mũi Đôi · first sunrise", elevation: 60, icon: "hike",   highlight: true,  day: 2 },
      { time: "07:00", label: "Return to camp",           elevation: 5,  icon: "hike",   highlight: false, day: 2 },
      { time: "07:30", label: "Boat to Bãi Thắm",        elevation: 2,  icon: "van",    highlight: false, day: 2 },
      { time: "08:00", label: "Bãi Thắm · swim + rest",  elevation: 2,  icon: "resort", highlight: true,  day: 2 },
      { time: "10:30", label: "Sand dune crossing",       elevation: 25, icon: "hike",   highlight: false, day: 2 },
      { time: "12:00", label: "Lunch · Đầm Môn",         elevation: 10, icon: "food",   highlight: false, day: 2 },
      { time: "14:00", label: "Return to Nha Trang",      elevation: 5,  icon: "return", highlight: false, day: 2 },
    ],
    elevationMax: 120,

    activityCards: [
      // ── Day 1 ──────────────────────────────────────────────────────────────
      {
        badgeLabel: "Drive",
        time: "05:30 – 07:30 · Day 1",
        title: "Nha Trang to Đầm Môn — Van, Coast Road North",
        desc: "Early pickup from your Nha Trang hotel. The drive north follows the coast road through Vạn Ninh district toward Đầm Môn — roughly 2 hours. As the road narrows and the fishing villages get smaller, the bay opens to the east: still water, scattered islands, no development. You arrive at the fishing village, have breakfast with the team, get your gear sorted, and meet your local guide. Trek starts at 08:00.",
        highlight: false,
      },
      {
        badgeLabel: "Trek",
        time: "08:00 – 11:30 · Day 1",
        title: "Morning Section: Đầm Môn to Bãi Na",
        desc: "The first trekking section covers roughly 5km along the eastern coast of the peninsula. The trail leaves the village and immediately enters coastal scrub — low trees, thorny brush, the occasional open section where the sea appears on your right. Two low ridges break the route, each topping out with views over Vân Phong Bay and the South China Sea. The descent from the second ridge brings you down to Bãi Na: a small, wild beach where you stop for lunch. No other parties. No facilities. Just a beach and a packed meal.",
        highlight: false,
      },
      {
        badgeLabel: "Trek",
        time: "13:00 – 16:30 · Day 1",
        title: "Afternoon Section: Bãi Na to Bãi Rạng",
        desc: "After lunch and a rest, the trail continues south through a denser section of coastal forest. The canopy closes overhead, the path narrows. This is the quieter, more remote stretch of the day — scrub forest alternating with rocky sections above the sea. No signage, no waypoints, just the guide and the trail. About 3km and 2.5 hours later, the trees open onto Bãi Rạng: a wide, east-facing beach exposed to open ocean. Tents go up while the light is still good.",
        highlight: false,
      },
      {
        badgeLabel: "Food",
        time: "16:30 – 20:00 · Night 1",
        title: "Camp Setup & BBQ Dinner — Bãi Rạng",
        desc: "Tents up, then swim. The water at Bãi Rạng is clear and the current is mild — it's the right moment to wash off the trail and let the day settle. Dinner is built around seafood sourced from Vân Phong Bay: squid, prawns, fish, grilled over a wood fire on the sand. Rice, charred vegetables, dipping sauces. The cook is your local guide, who has been running this route for years. The fire stays lit after dinner. Sleep comes early — wake-up call is 04:00.",
        highlight: true,
      },
      // ── Day 2 ──────────────────────────────────────────────────────────────
      {
        badgeLabel: "Hiking",
        time: "04:30 – 05:30 · Day 2",
        title: "Pre-dawn Cliff Trek to Mũi Đôi — In Darkness",
        desc: "Headlamps on at 04:30. The trail from Bãi Rạng to Mũi Đôi covers 500m along a coastal cliff above the South China Sea. Rocky underfoot, exposed in places — your guide leads and you follow closely. The path climbs to the headland ridge then descends slightly to the tip. After 20–25 minutes of careful walking, the trail ends at the cliff edge. You arrive in darkness, before the horizon changes. The sea is audible on three sides. You wait.",
        highlight: true,
      },
      {
        badgeLabel: "Sunrise",
        time: "~05:30 · Day 2",
        title: "First Sunrise at Mũi Đôi — Vietnam's Easternmost Point",
        desc: "Vietnam's easternmost mainland point, at approximately 109°28'E. The sun rises here before any other point on the Vietnamese mainland — every single day, without exception. The light appears as a thin line above the horizon, then widens fast. The South China Sea runs to the edge of vision in three directions. There is nothing between this headland and the Philippines. Most people go quiet when it happens. Photographs help, but they don't capture the silence.",
        highlight: true,
      },
      {
        badgeLabel: "Drive",
        time: "07:00 – 08:00 · Day 2",
        title: "Return to Camp & Boat Transfer to Bãi Thắm",
        desc: "After the sunrise, the group returns to Bãi Rạng along the same cliff trail — faster in daylight, easier underfoot. Camp is packed down: tents, mats, kitchen gear. A small boat meets you at the shoreline and takes the group 15 minutes south along the coast to Bãi Thắm. There is no road to Bãi Thắm, which is why it looks the way it does.",
        highlight: false,
      },
      {
        badgeLabel: "Beach",
        time: "08:00 – 16:00 · Day 2",
        title: "Bãi Thắm Beach, Sand Dunes & Return to Nha Trang",
        desc: "Bãi Thắm is a long arc of white sand and shallow turquoise water — clear enough to see the bottom at chest depth, calm enough to float. Breakfast is served on the beach. Swim, rest, do nothing. When the group is ready, the exit is either a 30-minute walk over the sand dunes to the Đầm Môn road (scenic, worth it) or a shared truck for 1,500,000 ₫ per trip (up to 10 people). Lunch in Đầm Môn village, then the van back south to Nha Trang. Arrive mid-afternoon.",
        highlight: true,
      },
    ],

    itinerary: [
      {
        day: 1,
        title: "Day 1 — Nha Trang → Đầm Môn → Coastal Trek → Bãi Rạng Camp",
        slots: [
          "05:30  Hotel pickup · Nha Trang",
          "07:30  Arrive Đầm Môn fishing village · breakfast + gear check",
          "08:00  Trek begins — coastal trail heading south toward Mũi Đôi",
          "10:00  Cross first hill section (~75m) · views open over Vân Phong Bay",
          "11:30  Lunch at Bãi Na · packed meal, beach rest",
          "13:00  Continue through coastal scrub forest · eastern face of the peninsula",
          "16:30  Arrive Bãi Rạng · set up camp · swim",
          "18:00  BBQ beach dinner — seafood grilled on the sand",
          "Overnight at Bãi Rạng · wild beach camp · wake-up 04:00",
        ],
      },
      {
        day: 2,
        title: "Day 2 — Pre-dawn to Mũi Đôi · Sunrise · Bãi Thắm · Nha Trang",
        slots: [
          "04:00  Wake up",
          "04:30  Depart camp · headlamps on · 500m cliff trail to Mũi Đôi headland",
          "05:30  Arrive Mũi Đôi · sunrise (time varies by season)",
          "06:30  Return to camp · pack down",
          "07:30  Boat transfer Bãi Rạng → Bãi Thắm (~15 minutes)",
          "08:00  Arrive Bãi Thắm · breakfast · swimming · free time",
          "10:30  Sand dune crossing on foot to Đầm Môn road (~30 min) · OR truck add-on 1,500,000 ₫ / trip / up to 10 pax",
          "12:00  Lunch at Đầm Môn",
          "14:00  Depart Đầm Môn → Nha Trang",
          "16:00  Arrive Nha Trang · end of tour",
        ],
      },
    ],

    seasonality: {
      intro: "Vân Phong Bay is one of the most sheltered bays on Vietnam's central coast. What changes across seasons is sea conditions and overnight comfort at camp.",
      months: [
        { name: "Jan", level: "best" },
        { name: "Feb", level: "best" },
        { name: "Mar", level: "best" },
        { name: "Apr", level: "best" },
        { name: "May", level: "best" },
        { name: "Jun", level: "good" },
        { name: "Jul", level: "good" },
        { name: "Aug", level: "good" },
        { name: "Sep", level: "wet"  },
        { name: "Oct", level: "wet"  },
        { name: "Nov", level: "best" },
        { name: "Dec", level: "best" },
      ],
      notes: [
        { title: "Best conditions (Nov – May)", desc: "Dry season on the south-central coast. Clear skies, calm seas, comfortable nights at camp. Sunrise visibility is highest December through March. These months are the reason to go." },
        { title: "Shoulder season (Jun – Aug)", desc: "Hot and humid, occasional afternoon showers. Vân Phong Bay stays relatively sheltered even when the open coast is choppy. Camp is manageable — main differences are heat on the trail and insects at night." },
        { title: "Typhoon season (Sep – Oct)", desc: "Highest rainfall and wave activity on the central coast. We run tours year-round but will flag conditions closer to your date. If the sea requires it, departure may be adjusted for safety." },
      ],
    },

    faqs: [
      { q: "How fit do I need to be?", a: "Moderate fitness. The trek covers roughly 12km over two days on uneven coastal trail — scrub forest, rocky sections, and one cliff path. No technical climbing, but the pre-dawn section requires steady footing on uneven rock in the dark. If you can hike 4–5 hours comfortably, you can do this. Not ideal if you have knee problems." },
      { q: "What's the truck option on Day 2?", a: "After Bãi Thắm, you can either walk across the sand dunes back to the Đầm Môn road (~30 minutes) or share a truck (xe bán tải) for 1,500,000 ₫ per trip, fitting up to 10 people. We decide together at the beach based on how the group is feeling." },
      { q: "What camping gear is provided?", a: "Tents and sleeping mats are included. Bring your own sleeping bag or lightweight liner — Bãi Rạng nights are warm but a liner adds comfort. A headlamp is essential for the 04:30 cliff walk — bring one or ask us in advance." },
      { q: "I'm not staying in Nha Trang — can I still join?", a: "Yes. We depart from Nha Trang on Saturday mornings at 05:30. If you need a flight, we can add a Nha Trang (Cam Ranh Airport · CXR) flight package to your booking — just ask when you enquire." },
      { q: "What's the private group option?", a: "Groups of 6 or more can book a private departure on any day that works — not only Saturdays. Contact us with your dates and group size." },
      { q: "Is there signal on the trail?", a: "Weak to none once you leave Đầm Môn village. Tell someone where you're going before you depart. Your guide carries emergency contact and knows the route." },
    ],

    welcomePack: {
      ...DEFAULT_WELCOME_PACK,
      intro: "Your host hands you a Morning Vietnam pack at the trailhead in Đầm Môn. One item was chosen for the kind of morning that starts at 04:00.",
    },

    unlockChallenge: null,
  },

  // ── Ninh Bình In A New Way ───────────────────────────────────────────────
  {
    slug:        "ninh-binh-in-a-new-way",
    name:        "Ninh Bình In A New Way",
    region:      "north",
    duration:    ["2D1N", "3D2N"],
    price:       "Contact for pricing",
    tagline:     "Vietnam's most dramatic landscape, lived — not photographed.",
    description: "Limestone karsts, ancient capitals, and hidden villages. Ninh Binh is Vietnam's inland Halong Bay — but lived, not photographed. Row through Trang An with a local, sleep in the valley, unlock the old capital.",
    highlights:  ["Trang An boat row", "Bich Dong pagoda hike", "Hoa Lu ancient capital", "Village Unlock challenge", "Mua Cave sunrise"],
    included:    ["Transport from Hanoi", "All meals", "Accommodation", "Activities", "Unlock challenges", "Dedicated host"],
    hub:         "Hanoi",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  true,
    image:       "/tours/ninh-binh-in-a-new-way/thumbnail.jpg",
    itinerary: [
      {
        day: 1,
        title: "Into the Karsts",
        slots: [
          "06:30 Depart Hanoi",
          "09:00 Trang An boat row",
          "12:00 Lunch",
          "14:00 Hoa Lu ancient capital",
          "16:00 Check in",
          "17:30 Unlock challenge at sunset",
        ],
      },
      {
        day: 2,
        title: "The Hidden Side",
        slots: [
          "05:30 Optional Mua Cave sunrise",
          "08:00 Breakfast",
          "09:30 Bich Dong pagoda",
          "11:30 Village walk",
          "13:00 Farewell lunch",
          "15:00 Return Hanoi",
        ],
      },
    ],

    // ── Extended ──
    priceUSD: 85,
    tripInfo: {
      "default": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, 06:30" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "home",            label: "Accommodation",     value: "Ninh Bình valley (1 night)" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full trip" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "credit-card",     label: "Payment method",    value: "Cash" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "185m · Mua Cave" },
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&q=85",  alt: "Limestone karsts rising from Trang An waterway" },
      { src: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1400&q=85", alt: "Traditional rowing boat through karst caves" },
      { src: "https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=1400&q=85", alt: "Mua Cave summit at sunrise, overlooking the valley" },
      { src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1400&q=85",  alt: "Hoa Lu ancient capital temple complex" },
      { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=85",  alt: "Bich Dong pagoda carved into limestone cliff" },
    ],
    pitch: {
      headline: "Ninh Bình gives you Hạ Long Bay — without the cruise ship, the noise, or the itinerary.",
      bullets: [
        "Tràng An before 9 AM — wooden boat, near-silence, oarswoman who steers with her feet",
        "Hoa Lư: Vietnam's first imperial capital. Most tours give it 40 minutes. We stay two hours.",
        "Day 2 optional 5:30 AM: 500 steps up Mua Cave, sun spilling across the karst valley below",
      ],
      closingLine: "Vietnam's most dramatic landscape. Lived from inside it.",
    },
    valueAnchor: {
      headline: "$85 for two days in a landscape most tours reduce to a bus window.",
      paragraphs: [
        "The standard Ninh Bình day tour gets you Tràng An (in a boat queue), Hoa Lư (in 30 minutes), and a lunch stop near the car park. You see the landscape through a lens and leave without having touched it.",
        "We run this overnight because the most important moments here happen at 5:30 AM and at sunset — times that don't exist on a day trip from Hanoi. You stay in the valley. You're there when it's actually worth being there.",
        "Same destination. Completely different experience of it.",
      ],
      compareTable: DEFAULT_COMPARE_TABLE,
    },
    storytelling: {
      headline: "Hạ Long Bay without the cruise ship — and a thousand times better.",
      paragraphs: [
        "Ninh Bình is what Hạ Long Bay looked like before the boats arrived. The same limestone karsts, the same water threading between them — but here you row through caves with a local oarswoman who's done it ten thousand times and still knows which rock face catches the best afternoon light.",
        "Hoa Lư was Vietnam's first imperial capital. Most visitors give it 40 minutes. We give it two hours, a host who knows the dynastic history, and an Unlock challenge that turns ancient stone inscriptions into a race against time. By sunset you'll know more about the Đinh and Lê dynasties than you wanted — and won't want to stop.",
        "Day two begins before dawn, optional but almost everyone comes: 500 steps up Mua Cave to watch the sun spill across the valley. Then the pagoda at Bích Động, which is built directly into the limestone cliff. Then a village walk that has no itinerary because the best part of it is always something we didn't plan.",
      ],
      pullImage: "https://images.unsplash.com/photo-1528360983277-13d401cdc186?w=1200&q=85",
    },
    elevationProfile: [
      { time: "06:30", label: "Depart Hanoi",            elevation: 12,  icon: "van",     highlight: false },
      { time: "09:00", label: "Trang An boat row",        elevation: 8,   icon: "boat",    highlight: true  },
      { time: "14:00", label: "Hoa Lu ancient capital",   elevation: 15,  icon: "temple",  highlight: false },
      { time: "17:30", label: "Unlock challenge",         elevation: 20,  icon: "unlock",  highlight: true  },
      { time: "05:30", label: "Mua Cave sunrise (opt.)", elevation: 185, icon: "sunrise", highlight: true  },
      { time: "09:30", label: "Bich Dong pagoda",         elevation: 60,  icon: "temple",  highlight: false },
    ],
    activityCards: [
      { badge: "trek",    badgeLabel: "Boat",    time: "09:00 – 11:30", title: "Tràng An Boat Row",            desc: "2 hours through 9 cave systems on a traditional wooden boat. Your oarswoman rows with her feet — a technique unique to this waterway. Arrive before the day-trippers.", highlight: true  },
      { badge: "culture", badgeLabel: "History", time: "14:00 – 16:00", title: "Hoa Lư Ancient Capital",       desc: "Vietnam's 10th-century imperial capital. Two temple complexes and the Unlock Challenge running through the Đinh and Lê dynasty history.", highlight: false },
      { badge: "free",    badgeLabel: "Challenge",time: "17:30 – sunset", title: "Unlock Challenge at Sunset",  desc: "Clues placed across the ancient capital. Your group decodes stone inscriptions before dark. Best 90 minutes of the trip.", highlight: true  },
      { badge: "trek",    badgeLabel: "Climb",   time: "05:30 – 07:00 (opt.)", title: "Mua Cave Sunrise",      desc: "500 steps up. Valley views at first light. Optional — but 90% of the group comes. Worth the early alarm.", highlight: false },
      { badge: "culture", badgeLabel: "Explore", time: "09:30 – 11:00", title: "Bích Động Pagoda",             desc: "Three pagoda levels built directly into a limestone cliff. The upper chamber requires climbing through a narrow rock passage — 10 minutes from base to top.", highlight: false },
    ],
    welcomePack: DEFAULT_WELCOME_PACK,
    seasonality: DEFAULT_SEASONALITY_NORTH,
    faqs: DEFAULT_FAQS,
    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
  },

  // ── Cát Bà: Not Just About Sea ───────────────────────────────────────────
  {
    slug:        "cat-ba-not-just-sea",
    name:        "Cát Bà: Not Just About Sea",
    region:      "north",
    duration:    ["1D", "2D1N", "3D2N"],
    price:       "Contact for pricing",
    tagline:     "The island beyond the Instagram. Forests, villages, and real connection.",
    description: "Cat Ba island has a national park, fishing villages, and trails that 99% of visitors never walk. We go there. Plus Halong Bay from a local angle, not a cruise ship.",
    highlights:  ["Cat Ba National Park hike", "Fishing village visit", "Kayak Halong Bay", "Unlock challenge: island navigation", "Local seafood dinner"],
    included:    ["Transport from Hanoi", "All meals", "Accommodation", "Activities", "Unlock challenges", "Dedicated host"],
    hub:         "Hanoi",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  true,
    image:       "/tours/cat-ba-not-just-sea/thumbnail.jpg",
    itinerary: [
      {
        day: 1,
        title: "Island Unlock",
        slots: [
          "06:00 Depart Hanoi",
          "10:30 Ferry to Cat Ba",
          "12:00 Lunch",
          "14:00 National Park hike",
          "17:00 Fishing village",
          "19:00 Seafood dinner",
        ],
      },
      {
        day: 2,
        title: "Halong Local",
        slots: [
          "07:00 Kayak Halong",
          "10:30 Unlock challenge",
          "12:30 Farewell lunch",
          "14:00 Ferry back",
          "18:00 Arrive Hanoi",
        ],
      },
    ],

    // ── Extended ──
    priceUSD: 95,
    tripInfo: {
      "default": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, 06:00" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Van + ferry, round trip" },
        { icon: "home",            label: "Accommodation",     value: "Cát Bà island (1 night)" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full trip" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "credit-card",     label: "Payment method",    value: "Cash" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "177m · Cát Bà National Park" },
      ],
    },
    gallery: [
      { src: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=85",  alt: "Kayaking through Halong Bay karsts at sunrise" },
      { src: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1400&q=85", alt: "Emerald waters of Halong Bay from above" },
      { src: "https://images.unsplash.com/photo-1536599018102-9f803c140fc1?w=1400&q=85", alt: "Cat Ba National Park jungle trail" },
      { src: "https://images.unsplash.com/photo-1573197388989-2b6d5e9e27d8?w=1400&q=85", alt: "Fishing village on Cat Ba island" },
      { src: "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1400&q=85",  alt: "Sunset over the limestone islands from Cat Ba" },
    ],
    pitch: {
      headline: "Cát Bà is what Hạ Long Bay looks like when you step off the boat.",
      bullets: [
        "Cát Bà National Park: 17,000 hectares, world's rarest primates, trail not on any standard route",
        "Fishing village dinner — catch still swimming two hours earlier, no performance, no staging",
        "Day 2 kayaking: quiet lagoons, hidden beaches, Unlock Challenge from water level",
      ],
      closingLine: "The island most people only photograph from a boat deck. We go in.",
    },
    valueAnchor: {
      headline: "$95 for an island most people only see from a railing.",
      paragraphs: [
        "The typical Hạ Long Bay cruise charges more than this for a floating hotel where you see the karsts through a cabin porthole and eat from a buffet. The landscape is famous. The experience, usually, is not.",
        "We built this trip around what Cát Bà actually is: a national park, a fishing community, a kayak route through the empty part of the bay, and a challenge that requires you to actually navigate it. The island, not the postcard of it.",
        "Same destination. Completely different relationship with it.",
      ],
      compareTable: DEFAULT_COMPARE_TABLE,
    },
    storytelling: {
      headline: "An island that most people only see from a boat deck.",
      paragraphs: [
        "Cát Bà is the largest island in Hạ Long Bay, and almost nobody actually explores it. The cruise ships anchor offshore. The day-trippers stay on the beach strip. We go into the national park — 17,000 hectares of jungle that rises to 177 metres and contains a population of the world's most endangered primates.",
        "The fishing village in the afternoon is not a performance. The families there live by what they pull from the water every morning. Our host grew up on that water, and that difference — between someone who explains a village and someone who is from it — is the one that changes how you travel.",
        "Day two is kayaking, but not the kind where you paddle in a line behind a guide. We find the quiet lagoons. The hidden beaches. The places that don't appear in the photos because they require 20 minutes of paddling past the crowd. The Unlock challenge runs from water level — a navigation puzzle that ends at the best viewpoint on the island.",
      ],
      pullImage: "https://images.unsplash.com/photo-1512100356356-de1b84283e18?w=1200&q=85",
    },
    elevationProfile: [
      { time: "06:00", label: "Depart Hanoi",       elevation: 12,  icon: "van",     highlight: false },
      { time: "10:30", label: "Ferry to Cat Ba",     elevation: 0,   icon: "boat",    highlight: false },
      { time: "14:00", label: "National Park hike",  elevation: 177, icon: "hike",    highlight: true  },
      { time: "17:00", label: "Fishing village",     elevation: 5,   icon: "village", highlight: false },
      { time: "07:00", label: "Kayak Halong",        elevation: 0,   icon: "kayak",   highlight: true  },
      { time: "10:30", label: "Unlock challenge",    elevation: 10,  icon: "unlock",  highlight: true  },
    ],
    activityCards: [
      { badge: "trek",    badgeLabel: "Hike",     time: "14:00 – 16:30", title: "Cát Bà National Park Trail",   desc: "+177m elevation. Dense jungle, rare primates overhead if you're quiet. Not on any standard tour — your guide chooses the trail based on the group's pace.", highlight: true  },
      { badge: "culture", badgeLabel: "Village",  time: "17:00 – 18:30", title: "Fishing Village Visit",        desc: "Floating homes on the harbour. Families who live by the catch. Our host grew up here — the difference between guided and local is everything.", highlight: false },
      { badge: "food",    badgeLabel: "Dinner",   time: "19:00 – 21:00", title: "Seafood Dinner",               desc: "What came out of the water this morning, at a table on the pier. Included in your price.", highlight: false },
      { badge: "free",    badgeLabel: "Kayak",    time: "07:00 – 10:00", title: "Kayak Hạ Long Bay",            desc: "We paddle past the tour flotilla into quiet lagoons the crowd can't reach without 20 minutes of paddling. Hidden beaches. No noise.", highlight: true  },
      { badge: "free",    badgeLabel: "Challenge",time: "10:30 – 12:00", title: "Unlock Challenge",             desc: "Navigation puzzle from water level. Plot coordinates, paddle to checkpoints, finish at the best viewpoint on the island.", highlight: false },
    ],
    welcomePack: DEFAULT_WELCOME_PACK,
    seasonality: {
      ...DEFAULT_SEASONALITY_NORTH,
      notes: [
        { title: "Best conditions (Oct–Apr)", desc: "Cool, dry, clear skies. Best for hiking and kayaking visibility. Oct–Nov offers the calmest seas and emptiest trails." },
        { title: "Wet season (May–Sep)",       desc: "Warmer water, greener jungle. Afternoon rain possible — kayak routes and park trails remain open. Rain-friendly alternatives always available." },
      ],
    },
    faqs: DEFAULT_FAQS,
    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
  },

  // ── Coming soon ───────────────────────────────────────────────────────────

  {
    slug:        "central-vietnam",
    name:        "Central Vietnam",
    region:      "soon",
    duration:    ["5D4N"],
    price:       "Coming Q3 2026",
    tagline:     "Huế, Đà Nẵng, Hội An — the full arc. Coming Q3 2026.",
    description: "Three cities, one soul. Imperial Hue, coastal Da Nang, and the lanterns of Hoi An — Morning Vietnam style.",
    highlights:  [],
    included:    [],
    hub:         "Da Nang",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  true,
    image:       "https://images.unsplash.com/photo-1568775791746-bcc117bcb312?w=800&q=80",
    itinerary:   [],
    priceUSD:    null,
    gallery:     [],
    pitch:       { headline: "Coming Q3 2026.", paragraphs: [], closingLine: "" },
    valueAnchor: { headline: "", paragraphs: [], compareTable: [] },
    storytelling:{ headline: "Coming Q3 2026.", paragraphs: [], pullImage: "" },
    elevationProfile: [],
    activityCards: [],
    welcomePack: DEFAULT_WELCOME_PACK,
    seasonality: DEFAULT_SEASONALITY_NORTH,
    faqs:        DEFAULT_FAQS,
    unlockChallenge: null,
  },

  {
    slug:        "central-highlands",
    name:        "Central Highlands",
    region:      "soon",
    duration:    ["4D3N"],
    price:       "Coming Q3 2026",
    tagline:     "Đắk Lắk & Kon Tum. Coffee forests and living culture. Coming Q3 2026.",
    description: "Vietnam's least-visited region. Coffee at origin, elephant sanctuary, and indigenous Ede culture.",
    highlights:  [],
    included:    [],
    hub:         "Buon Ma Thuot",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  true,
    image:       "/tours/central-highlands-thumb.png",
    itinerary:   [],
    priceUSD:    null,
    gallery:     [],
    pitch:       { headline: "Coming Q3 2026.", paragraphs: [], closingLine: "" },
    valueAnchor: { headline: "", paragraphs: [], compareTable: [] },
    storytelling:{ headline: "Coming Q3 2026.", paragraphs: [], pullImage: "" },
    elevationProfile: [],
    activityCards: [],
    welcomePack: DEFAULT_WELCOME_PACK,
    seasonality: DEFAULT_SEASONALITY_NORTH,
    faqs:        DEFAULT_FAQS,
    unlockChallenge: null,
  },

  {
    slug:        "mekong-delta",
    name:        "Mekong Delta",
    region:      "soon",
    duration:    ["3D2N"],
    price:       "Coming Q4 2026",
    tagline:     "The river that feeds a nation. Coming Q4 2026.",
    description: "Floating markets, river villages, and the slow life of the south.",
    highlights:  [],
    included:    [],
    hub:         "Can Tho",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  true,
    image:       "/tours/mekong-delta-thumb.jpg",
    itinerary:   [],
    priceUSD:    null,
    gallery:     [],
    pitch:       { headline: "Coming Q4 2026.", paragraphs: [], closingLine: "" },
    valueAnchor: { headline: "", paragraphs: [], compareTable: [] },
    storytelling:{ headline: "Coming Q4 2026.", paragraphs: [], pullImage: "" },
    elevationProfile: [],
    activityCards: [],
    welcomePack: DEFAULT_WELCOME_PACK,
    seasonality: DEFAULT_SEASONALITY_NORTH,
    faqs:        DEFAULT_FAQS,
    unlockChallenge: null,
  },

  // ── Sa Pa Trekking Classic ───────────────────────────────────────────────
  {
    slug:        "sapa-trekking-classic",
    name:        "Sa Pa Trekking Classic",
    region:      "north",
    duration:    ["2D1N"],
    price:       "from $67",
    priceUSD:    67,
    priceVND:    1750000,
    tagline:     "Two days through the Mường Hoa valley — Black H'Mông villages, rice terraces, and a night in Tả Van.",
    description: "Hanoi sleeper bus to Sa Pa, then two days on foot through the Mường Hoa valley. Day 1 follows the classic route: Ý Linh Hồ, Lao Chải, Tả Van — Black H'Mông villages strung along the valley's terrace edges, ending with a night at a local H'Mông homestay. Day 2 continues to Giàng Tả Chải, explores the village, eats lunch in the bản, then returns to Sa Pa by car and back to Hanoi by evening bus. The most-trekked route in Sa Pa — done the right way.",
    highlights: [
      "Ý Linh Hồ, Lao Chải, Tả Van — three Black H'Mông villages in the Mường Hoa valley",
      "Night in a local H'Mông homestay at Tả Van — dinner and breakfast with the family",
      "Day 2: Giàng Tả Chải — bamboo forest, valley views, lunch in the village",
      "Full circuit: Hanoi → Sa Pa → valley trek → homestay → Giàng Tả Chải → Hanoi",
      "Unlock Challenge somewhere in the valley",
      "Max 8 people — no joined groups",
    ],
    included: [
      "Sleeper bus Hanoi ↔ Sa Pa (both ways)",
      "Private car Sa Pa ↔ villages as needed",
      "All meals: lunch + dinner Day 1 · breakfast + lunch Day 2",
      "1 night H'Mông homestay · Tả Van village",
      "Dedicated Morning Vietnam host, both days",
      "All entrance & activity fees",
      "Unlock Challenge",
      "Welcome pack",
    ],
    hub:         "Hanoi",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  false,
    image:       "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-3.webp",

    panoramicImage: "/tours/sapa-trekking-classic/panoramic.jpg",

    gallery: [
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-1.webp",  alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-2.webp",  alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-3.webp",  alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-4.webp",  alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-5.webp",  alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-6.webp",  alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-7.webp",  alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-8.webp",  alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-9.webp",  alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-11.webp", alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-12.webp", alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-13.webp", alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-14.webp", alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-15.webp", alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-16.webp", alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-17.webp", alt: "Sa Pa Trekking Classic" },
      { src: "/tours/sapa-trekking-classic/Sa Pa Trekking Classic-18.webp", alt: "Sa Pa Trekking Classic" },
    ],

    cabinUpgrade: {
      labelOn:       "Private cabin (upgraded)",
      labelOff:      "Standard sleeper bus",
      surchargeVND:  200000,
      surchargeUSD:  8,
      surchargeNote: "+$4/person/way · Your own private sleeping cabin",
    },

    selectorMode: 'vehicle-only',
    durationOptions: [
      {
        id:       "2d1n",
        label:    "2D1N",
        price:    67,
        priceVND: 1750000,
        tagline:  "Hanoi → Sa Pa · Ý Linh Hồ → Lao Chải → Tả Van homestay · Giàng Tả Chải → Hanoi.",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now · Pay 14 days before · Free cancellation until then",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa Trekking Classic (2D1N, $67/person)",
      },
    ],

    tripInfo: {
      "2d1n": [
        { icon: "map-pin",         label: "Pickup",           value: "Old Quarter, Hanoi · 06:30 sleeper bus" },
        { icon: "users",           label: "Group size",       value: "3 – 12 people" },
        { icon: "car",             label: "Vehicle",          value: "Sleeper bus (HN ↔ Sa Pa) + private car + trekking" },
        { icon: "tools-kitchen-2", label: "Meals",            value: "Lunch + dinner Day 1 · breakfast + lunch Day 2" },
        { icon: "home",            label: "Accommodation",    value: "H'Mông local homestay · Tả Van village" },
        { icon: "mountain",        label: "Max altitude",     value: "~1,500m · Sa Pa area" },
        { icon: "calendar-check",  label: "Departure days",   value: "Mon · Flexible for groups of 3+" },
        { icon: "lock-open",       label: "Unlock Challenge", value: "Included" },
      ],
    },

    itinerary: [
      {
        day: 1,
        title: "Day 1 — Hanoi → Sa Pa → Mường Hoa Valley → Tả Van",
        slots: [
          "06:30  Board sleeper bus · Old Quarter, Hanoi",
          "13:30  Arrive Sa Pa · lunch at a local restaurant",
          "14:30  Meet your Morning Vietnam host · Sa Pa town centre",
          "14:45  Drive to Ý Linh Hồ trailhead",
          "15:15  Trek begins — through Ý Linh Hồ (Black H'Mông) · terraced hillsides above Mường Hoa valley",
          "16:00  Continue to Lao Chải — Black H'Mông village on the valley floor",
          "17:00  Trek through rice terraces toward Tả Van",
          "18:30  Arrive Tả Van · check in to H'Mông homestay",
          "18:30 – 20:30  Dinner cooked by the host family · Tây Bắc style",
          "Overnight · Tả Van homestay",
        ],
      },
      {
        day: 2,
        title: "Day 2 — Tả Van → Giàng Tả Chải → Sa Pa → Hanoi",
        slots: [
          "08:00 – 08:45  Breakfast at the homestay",
          "08:45 – 10:00  Trek from Tả Van to Giàng Tả Chải — bamboo forest, hillside path",
          "10:00 – 12:00  Explore Giàng Tả Chải village · local life",
          "12:00 – 13:00  Lunch at the village",
          "13:00 – 15:15  Car back to Sa Pa town · free time",
          "15:30  Board bus back to Hanoi",
          "21:30 – 22:30  Arrive Hanoi Old Quarter · end of tour",
        ],
      },
    ],

    pitch: {
      headline: "The Mường Hoa valley is Sa Pa's signature landscape. Most people see it from a minibus window. This is two days inside it.",
      bullets: [
        "Three villages in sequence: Ý Linh Hồ → Lao Chải → Tả Van — on foot, not a minibus",
        "Night in the valley: dinner cooked by an H'Mông family, sleep where the rice terraces begin",
        "Day 2: Giàng Tả Chải — a smaller, quieter settlement most Sa Pa tour groups never reach",
      ],
      closingLine: "The Mường Hoa valley is exactly as good as people say. The trick is being in it, not above it.",
    },

    valueAnchor: {
      "2d1n": {
        headline: "$67. Two days in the Mường Hoa valley — Hanoi, three villages, homestay, all meals included.",
        paragraphs: [
          "Included: sleeper bus Hanoi ↔ Sa Pa (both ways), private car where needed, all meals from Day 1 lunch through Day 2 lunch, H'Mông homestay at Tả Van, dedicated host both days, Unlock Challenge, welcome pack. No hidden fees.",
          "The standard market for this format — 2 days, Hanoi bus, homestay, guide — runs $56–89 depending on operator and group size. Morning Vietnam runs max 8 people, no joined groups, local host (not a hired agency guide). The price sits in the middle of the market for a product that's built differently.",
        ],
        compareTable: [
          { metric: "Group size",       typical: "Up to 20+ (joined groups)", us: "Max 12 · no joined groups" },
          { metric: "Guide",            typical: "Agency guide",              us: "Morning Vietnam local host" },
          { metric: "Villages",         typical: "2 (Y Linh Ho + Ta Van)",    us: "3 + Giàng Tả Chải Day 2" },
          { metric: "Homestay",         typical: "Basic bungalow or guesthouse", us: "H'Mông family homestay · Tả Van" },
          { metric: "Meals",            typical: "Lunch only",                us: "Lunch + dinner + breakfast + lunch" },
          { metric: "Unlock Challenge", typical: "Not available",             us: "Included" },
        ],
      },
    },

    storytelling: {
      headline: "The Mường Hoa valley is where Sa Pa's landscape becomes something you walk through, not look at.",
      paragraphs: [
        "Sa Pa sits at 1,500m on the edge of the Hoàng Liên Sơn range. Below it, the Mường Hoa valley drops in a series of terraced steps — rice fields stacked against hillsides, cultivated by Black H'Mông families who have farmed this land for generations. The valley is about 20km long and 300m lower than the town above it. Most visitors see it from the top.",
        "Ý Linh Hồ is the first village south of Sa Pa on the valley's eastern ridge — a Black H'Mông settlement at about 1,330m, perched where the terraces begin their descent. The path from here follows the terrace edges down through Lao Chải, another H'Mông village in the valley centre, and then across the valley floor to Tả Van at 1,070m. The entire descent covers roughly 8–10km on foot.",
        "Tả Van is where the night is. The village sits at the meeting point of the Mường Hoa River and several smaller streams — a flat pocket of valley floor surrounded by terraces on three sides. The homestay is a working family home, not a guesthouse. Dinner is northwestern Vietnamese cooking: rice, vegetables, pork or chicken from the yard, rice wine if you want it.",
        "Giàng Tả Chải on Day 2 is the furthest point into the valley on this route — a small H'Mông settlement across a bamboo-forested hillside from Tả Van. The path cuts through the forest before opening out onto views across the full width of the valley. Lunch is cooked in the village. The car back to Sa Pa takes 30–45 minutes from the main road. By late afternoon you're on the bus back to Hanoi.",
      ],
      pullImage: "/tours/lai-chau-motortour/1.webp",
    },

    elevationProfile: [
      { time: "06:30", label: "Depart Hanoi",         elevation: 20,   icon: "van",     highlight: false, day: 1 },
      { time: "13:30", label: "Sa Pa · lunch",         elevation: 1500, icon: "food",    highlight: false, day: 1 },
      { time: "15:15", label: "Ý Linh Hồ · trek",    elevation: 1330, icon: "hike",    highlight: false, day: 1 },
      { time: "16:00", label: "Lao Chải Village",       elevation: 1020, icon: "village", highlight: false, day: 1 },
      { time: "17:00", label: "Rice terraces",         elevation: 1000, icon: "hike",    highlight: false, day: 1 },
      { time: "18:30", label: "Tả Van · homestay",   elevation: 1070, icon: "resort",  highlight: true,  day: 1 },

      { time: "08:45", label: "Bamboo forest trek",   elevation: 1000, icon: "hike",    highlight: false, day: 2 },
      { time: "10:00", label: "Giàng Tả Chải Village", elevation: 990, icon: "village", highlight: true,  day: 2 },
      { time: "12:00", label: "Lunch with locals",    elevation: 990,  icon: "food",    highlight: false, day: 2 },
      { time: "13:30", label: "Car to Sa Pa",         elevation: 1500, icon: "van",     highlight: false, day: 2 },
      { time: "15:30", label: "Hanoi",                elevation: 10,   icon: "return",  highlight: false, day: 2 },
    ],
    elevationMax: 1600,

    activityCards: [
      {
        badge: "van", badgeLabel: "Night Bus",
        time: "06:30 – 13:30 · Day 1",
        title: "Hanoi to Sa Pa — Sleeper Bus",
        desc: "The journey starts with a high-quality sleeper bus from Hanoi's Old Quarter at 06:30 — lie-flat berths, air conditioning, roughly 7 hours to Sa Pa. You arrive in time for a late lunch before meeting your host and starting the afternoon trek. The same bus brings you back on Day 2 evening, departing Sa Pa at 15:30 and arriving Hanoi by 21:30.",
        highlight: false,
      },
      {
        badge: "hike", badgeLabel: "Trek",
        time: "15:15 – 18:30 · Day 1",
        title: "Ý Linh Hồ → Lao Chải → Tả Van",
        desc: "The main trek of Day 1 covers three villages in sequence, descending roughly 430m through the Mường Hoa valley. Starting at Ý Linh Hồ (1,330m) — a Black H'Mông settlement on the terrace hillside — the path drops through open rice fields to Lao Chải (1,100m), another H'Mông village in the valley centre. From there it follows the valley floor through terraced paddies to Tả Van (1,070m). About 8–10km on foot, 3 hours including rests. The classic Sa Pa trekking route — walked by locals for generations, not built for tourism.",
        highlight: true,
      },
      {
        badge: "resort", badgeLabel: "Homestay",
        time: "18:30 – 08:00 · Night",
        title: "Tả Van — H'Mông Homestay",
        desc: "The night is at a local H'Mông family homestay in Tả Van village. Dinner is cooked by the host: rice, vegetables from the garden, pork or chicken, northwestern Vietnamese dishes. The house is a working family home — wooden construction, communal dining, shared sleeping arrangements in the traditional style. Breakfast in the morning before the Day 2 trek departs. Tả Van sits at 1,070m at the valley floor — in clear weather, the terrace hillsides above the village are visible from the front of the house.",
        highlight: true,
      },
      {
        badge: "hike", badgeLabel: "Trek",
        time: "08:45 – 10:00 · Day 2",
        title: "Tả Van to Giàng Tả Chải — Through the Bamboo Forest",
        desc: "Day 2's trek is shorter and quieter than Day 1's. The path from Tả Van climbs slightly before entering a section of dense bamboo forest — cool, canopied, a different texture from the open terrace walking of the previous afternoon. After the forest the route opens onto a hillside with views across the full width of the Mường Hoa valley before descending to Giàng Tả Chải at 990m. About 75 minutes of walking.",
        highlight: false,
      },
      {
        badge: "village", badgeLabel: "Village",
        time: "10:00 – 13:00 · Day 2",
        title: "Giàng Tả Chải — The End of the Valley",
        desc: "Giàng Tả Chải is a Black H'Mông village at the far end of the valley circuit — smaller and less visited than Tả Van or Lao Chải. The path into the village crosses a small bridge over the Mường Hoa River. Time here is unstructured: walking through the village, talking to the families through your host, watching what's happening at the time of year you arrive. Lunch is cooked in the bản — rice, local vegetables, whatever's in season. The Unlock Challenge runs somewhere in this window.",
        highlight: true,
      },
      {
        badge: "van", badgeLabel: "Return",
        time: "13:00 – 15:30 · Day 2",
        title: "Back to Sa Pa — Free Time Before Bus",
        desc: "The car picks up at the main road above Giàng Tả Chải and takes 30–45 minutes to reach Sa Pa town. From 13:00 to 15:30 is free time — use it however you want: coffee at a local café, walking the Sa Pa market, or just sitting at the viewpoint before the bus south. The evening bus departs at 15:30 and arrives in Hanoi Old Quarter by 21:30.",
        highlight: false,
      },
    ],

    welcomePack: {
      ...DEFAULT_WELCOME_PACK,
      intro: "Your host hands you a Morning Vietnam pack at the start of the trek. One item was chosen specifically for a day that ends in someone else's house.",
    },

    seasonality: {
      intro: "The Mường Hoa valley is walkable year-round. What changes is what the terraces look like and how the path feels underfoot.",
      months: [
        { name: "Jan", level: "good" },
        { name: "Feb", level: "good" },
        { name: "Mar", level: "good" },
        { name: "Apr", level: "good" },
        { name: "May", level: "best" },
        { name: "Jun", level: "best" },
        { name: "Jul", level: "best" },
        { name: "Aug", level: "best" },
        { name: "Sep", level: "best" },
        { name: "Oct", level: "best" },
        { name: "Nov", level: "good" },
        { name: "Dec", level: "good" },
      ],
      notes: [
        { title: "Rice season (May – Oct)", desc: "May–Jun: flooded terraces, mirror reflections, transplanting season. Jul–Aug: full green growth, mist and cloud. Sep–Oct: golden harvest — the most photographed period in Sa Pa, for good reason. The trail is muddier after rain but the valley is at its most alive." },
        { title: "Dry season (Nov – Apr)", desc: "Drier, clearer, easier underfoot. Jan–Feb brings cold and occasional frost at altitude — the homestay is warmer than it looks. Mar–Apr: plum and peach blossom season, the terraces start to green up. Fewer tourists than peak season." },
      ],
    },

    faqs: [
      { q: "How difficult is the trekking?", a: "Moderate. Day 1 is roughly 8–10km downhill through the Mường Hoa valley — 3 hours of walking with elevation loss of about 430m. Day 2 is shorter (5–6km, 75 min to Giàng Tả Chải). Paths are mostly dirt and uneven in places, particularly after rain. Suitable for anyone with normal fitness. Not recommended for people with knee issues (Day 1 descent). Trekking poles are useful but not required." },
      { q: "What is the homestay like?", a: "A local H'Mông family home in Tả Van village — wooden construction, basic facilities, communal sleeping area. Not a guesthouse or bungalow. You eat with the family, sleep under the same roof, and leave in the morning. If you're expecting hotel-style amenities, this isn't the right tour. If you want to understand what Tả Van actually is, this is the only way to do it." },
      { q: "What's included in the price?", a: "Sleeper bus Hanoi ↔ Sa Pa (both ways), private car where needed, all meals from Day 1 lunch through Day 2 lunch (4 meals total), H'Mông homestay at Tả Van, dedicated Morning Vietnam host for both days, all entrance and activity fees, Unlock Challenge, welcome pack. The only extras are personal spending and tips." },
      { q: "Can I join this tour solo?", a: "Yes — we run joined groups of up to 8 people, so solo travelers book the same way as groups. Minimum 3 people to confirm departure. If you're traveling alone and want to guarantee a specific date, contact us and we'll confirm availability." },
      { q: "What's the best time of year?", a: "Sep–Oct for golden rice terraces. May–Jun for flooded mirror fields. Mar–Apr for blossom season and clear skies. The route is walkable year-round — Dec–Feb is cold (3–7°C at night in the valley) but doable with layers." },
    ],

    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
    upcomingDates: ["Wed 22 Jul", "Sun 26 Jul", "Mon 27 Jul", "Sun 2 Aug"],
  },

  // ── Sa Pa · Nậm Cang ─────────────────────────────────────────────────────
  {
    slug:        "sapa-nam-cang",
    name:        "Sa Pa · Nậm Cang",
    region:      "north",
    duration:    ["1 Day", "2D1N"],
    price:       "from $52",
    priceUSD:    52,
    priceVND:    1360000,
    tagline:     "Terraced rice fields, a Red Dao village, and a valley most Sa Pa visitors never reach — one day or two.",
    description: "Leave Sa Pa and trek into Nậm Cang — a Red Dao village 30km south, deep in the Hoàng Liên Sơn range, sitting at the edge of terraced fields that drop in layers toward the valley floor. One day covers the route from Nậm Sài through the rice terraces to the village. Two days starts from Hanoi, adds a night in a Black H'Mông homestay at Tả Van, and approaches Nậm Cang from Giàng Tả Chải across a longer trekking route.",
    highlights: [
      "Nậm Cang — Red Dao village in the Hoàng Liên Sơn, 30km from Sa Pa town",
      "Terraced rice fields: trekking through the paddies, not photographing them from a viewpoint",
      "1 Day: trek from Nậm Sài through rice terraces direct to Nậm Cang",
      "2D1N: Hanoi → Ý Linh Hồ → Tả Van (Black H'Mông homestay) → Giàng Tả Chải → Nậm Cang",
      "Red Dao culture: traditional dress, embroidery, medicinal herb knowledge",
      "Herb bath (Red Dao herbal soak) — included on 2D1N return to Sa Pa",
      "Unlock Challenge in the valley",
    ],
    included: [
      "Transport Sa Pa ↔ Nậm Cang (1 Day) / Hanoi ↔ Sa Pa sleeper bus + private car (2D1N)",
      "All meals: lunch (1 Day) · lunch + dinner + breakfast (2D1N)",
      "Homestay at Tả Van (2D1N only)",
      "Red Dao herbal bath in Sa Pa (2D1N only)",
      "Dedicated Morning Vietnam host, full day",
      "All activity & entrance fees",
      "Unlock Challenge",
      "Welcome pack",
    ],
    hub:         "Sa Pa",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  false,
    image:       "/tours/sapa-nam-cang/7.webp",
    panoramicImage: "/tours/sapa-trekking-classic/panoramic.jpg",
    selectorMode: 'duration-tabs',

    gallery: [
      { src: "/tours/sapa-nam-cang/1.webp",  alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/2.webp",  alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/3.webp",  alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/4.webp",  alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/5.webp",  alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/6.webp",  alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/7.webp",  alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/8.webp",  alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/9.webp",  alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/10.webp", alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/11.webp", alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/12.webp", alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/13.webp", alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/14.webp", alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/15.webp", alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/16.webp", alt: "Sa Pa · Nậm Cang" },
      { src: "/tours/sapa-nam-cang/17.webp", alt: "Sa Pa · Nậm Cang" },
    ],

    durationOptions: [
      {
        id:       "1day",
        label:    "1 Day",
        price:    52,
        priceVND: 1360000,
        tagline:  "Sa Pa → Nậm Sài → rice terrace trek → Nậm Cang Red Dao village → back to Sa Pa by 17:30.",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now · Pay 14 days before · Free cancellation until then",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Nậm Cang (1 Day, $52/person)",
      },
      {
        id:       "2d1n",
        label:    "2D1N",
        price:    111,
        priceVND: 2900000,
        tagline:  "Hanoi → Sa Pa · Ý Linh Hồ trek → Tả Van homestay · Giàng Tả Chải → Nậm Cang · Red Dao herb bath → Sa Pa.",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now · Pay 14 days before · Free cancellation until then",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Nậm Cang (2D1N, $111/person)",
      },
    ],

    tripInfo: {
      "1day": [
        { icon: "map-pin",         label: "Meeting point",    value: "Sa Pa town centre · 08:30" },
        { icon: "users",           label: "Group size",       value: "3 – 12 people" },
        { icon: "car",             label: "Vehicle",          value: "Private car to Nậm Sài · trekking from there" },
        { icon: "tools-kitchen-2", label: "Meals",            value: "Lunch at Nậm Cang included" },
        { icon: "mountain",        label: "Max altitude",     value: "~1,500m · Sa Pa area" },
        { icon: "calendar-check",  label: "Departure days",   value: "Thu & Sat · Flexible for groups of 3+" },
        { icon: "lock-open",       label: "Unlock Challenge", value: "Included" },
      ],
      "2d1n": [
        { icon: "map-pin",         label: "Pickup",           value: "Old Quarter, Hanoi · 06:30 sleeper bus" },
        { icon: "users",           label: "Group size",       value: "3 – 12 people" },
        { icon: "car",             label: "Vehicle",          value: "Sleeper bus (HN ↔ Sa Pa) + private car + trekking" },
        { icon: "tools-kitchen-2", label: "Meals",            value: "Lunch Day 1 + dinner + breakfast + lunch Day 2" },
        { icon: "home",            label: "Accommodation",    value: "Local H'Mông homestay · Tả Van village" },
        { icon: "leaf",            label: "Herb bath",        value: "Red Dao herbal bath in Sa Pa (Day 2)" },
        { icon: "mountain",        label: "Max altitude",     value: "~1,500m · Sa Pa area" },
        { icon: "calendar-check",  label: "Departure days",   value: "Tue · Flexible for groups of 3+" },
        { icon: "lock-open",       label: "Unlock Challenge", value: "Included" },
      ],
    },

    itinerary: [
      {
        day: 1,
        title: "1 Day — Nậm Sài to Nậm Cang",
        slots: [
          "08:30  Meet at Sa Pa town centre · vehicle check",
          "08:30 – 10:00  Drive to Nậm Sài (1h30)",
          "10:00  Trek begins — through rice terraces toward Nậm Cang",
          "12:00  Arrive Nậm Cang · lunch at a local family",
          "13:30 – 15:00  Explore the village · Red Dao culture and daily life",
          "15:00 – 16:00  Deep into the terraced fields at Nậm Cang · photography",
          "16:00 – 17:30  Drive back to Sa Pa town centre",
        ],
      },
      {
        day: 0,
        title: "2D1N · Day 0 — Hanoi → Sa Pa",
        slots: [
          "06:30  Board high-quality sleeper bus · Old Quarter, Hanoi",
          "13:00  Arrive Sa Pa · lunch at a local restaurant",
          "14:30  Meet your Morning Vietnam host · Sa Pa town centre",
          "14:45  Drive to Ý Linh Hồ trailhead",
          "15:15  Trek begins — through Ý Linh Hồ (Black H'Mông village) · wild terraced hillsides",
          "18:30  Arrive Tả Van village · rest and dinner at homestay",
          "20:30  Sleep at local H'Mông homestay · Tả Van",
        ],
      },
      {
        day: 2,
        title: "2D1N · Day 2 — Tả Van to Nậm Cang",
        slots: [
          "08:00 – 08:30  Breakfast at the homestay",
          "08:30 – 10:30  Trek from Tả Van to Giàng Tả Chải",
          "10:30 – 11:30  Drive from Giàng Tả Chải to Nậm Sài",
          "11:30 – 13:30  Trek through Nậm Cang rice terraces",
          "13:30 – 14:30  Lunch at Nậm Cang · rest",
          "14:30 – 16:00  Explore Nậm Cang village · Red Dao culture",
          "16:00 – 16:45  Photography in the terraced fields",
          "16:45 – 17:45  Drive back to Sa Pa town centre",
          "17:45 – 18:45  Red Dao herbal bath in Sa Pa",
          "18:45 – 22:00  Free time in Sa Pa · explore the night market",
        ],
      },
    ],

    pitch: {
      "1day": {
        headline: "Sa Pa has a hundred trekking routes. Nậm Cang is the one the coach tours don't reach.",
        bullets: [
          "30km past the coach road — Red Dao families, no gift shops, no entrance gate",
          "2 hours through rice terrace edges: more actual Sa Pa landscape than most visitors see in a week",
          "Lunch cooked at the village. Unlock Challenge in the afternoon, in the fields.",
        ],
        closingLine: "One day. The valley without the crowds.",
      },
      "2d1n": {
        headline: "Two days. Hanoi to three villages, two ethnic groups, and a valley most Sa Pa itineraries miss entirely.",
        bullets: [
          "Sleeper bus north → Ý Linh Hồ → Tả Van homestay — trekking starts the moment you arrive",
          "Day 2: Black H'Mông to Red Dao — two completely different communities, one valley apart",
          "Ends with a Red Dao herbal bath in Sa Pa — a ritual women here have practiced for centuries",
        ],
        closingLine: "Three villages. Two nights. The Sa Pa most visitors go home having missed.",
      },
    },

    valueAnchor: {
      "1day": {
        headline: "$52. A full day in Nậm Cang — the valley the coach tours don't reach.",
        paragraphs: [
          "Included: private car Sa Pa ↔ Nậm Sài, full trekking route through the terraces, lunch at the village, dedicated Morning Vietnam host, Unlock Challenge, welcome pack. Min group 3, max 12.",
          "Standard Sa Pa day tours charge $20–35 for Cat Cat Village + a viewpoint stop. This covers a route those operators don't run — because they don't have the local contacts to run it.",
        ],
        compareTable: [
          { metric: "Route",             typical: "Cat Cat / Fansipan circuit",        us: "Nậm Sài → Nậm Cang terraces" },
          { metric: "Village access",    typical: "Tourist village with gift shops",   us: "Working Red Dao community" },
          { metric: "Trekking",          typical: "30–60 min paved path",             us: "2h+ through rice terrace edges" },
          { metric: "Lunch",             typical: "Restaurant in Sa Pa town",         us: "Cooked in the village" },
          { metric: "Unlock Challenge",  typical: "Not available",                    us: "Included" },
        ],
      },
      "2d1n": {
        headline: "$111. Two full days — Hanoi, three villages, two ethnic groups, everything included.",
        paragraphs: [
          "Included: sleeper bus Hanoi ↔ Sa Pa (both ways), private car on both days, all meals from Day 1 lunch through Day 2 dinner, H'Mông homestay at Tả Van, Red Dao herbal bath in Sa Pa, all activity fees, dedicated host, Unlock Challenge, welcome pack.",
          "The comparable product elsewhere — bus + basic homestay + one guided walk — costs $80–100 and covers a fraction of the ground.",
        ],
        compareTable: [
          { metric: "Villages visited",  typical: "1 (usually Cat Cat)",              us: "3 — Ý Linh Hồ, Tả Van, Nậm Cang" },
          { metric: "Ethnic groups",     typical: "H'Mông (tourist circuit)",         us: "Black H'Mông + Red Dao" },
          { metric: "Trekking",          typical: "Paved loop, 1–2h",                us: "Full day each day, proper trail" },
          { metric: "Homestay",          typical: "Tourist homestay near Sa Pa town", us: "Local family · Tả Van village" },
          { metric: "Herb bath",         typical: "Extra cost, tourist spa",          us: "Included · Red Dao practitioner" },
          { metric: "Unlock Challenge",  typical: "Not available",                    us: "Included" },
        ],
      },
    },

    storytelling: {
      headline: "Nậm Cang is where the Sa Pa tourist circuit ends and the real valley begins.",
      paragraphs: [
        "Most of the trekking routes out of Sa Pa converge on the same few villages within a few kilometres of town — places that have adjusted to tourism so thoroughly that the experience of 'local life' is largely a performance. Nậm Cang sits 30km further south, past the road the minibuses use, in a section of the Hoàng Liên Sơn range where the Red Dao community has had very little reason to rearrange itself for visitors.",
        "The Red Dao are distinct from the H'Mông communities closer to Sa Pa town. The women's embroidery is more intricate, the headwear more elaborate, the knowledge of medicinal herbs deeper and more practically alive — the herbal bath tradition isn't a wellness product here, it's a functional practice that's been passed down for generations. You encounter all of this in the context of working village life, not a demonstration staged for tour groups.",
        "The 2D1N route adds the Mường Hoa valley approach — through Ý Linh Hồ, a Black H'Mông settlement on the terrace edges above the valley floor, down to Tả Van for the night. Day 2 crosses from Tả Van to Giàng Tả Chải on foot, then connects to Nậm Cang by road and trail. Two days of walking that cover the full range of what the Sa Pa area actually contains, before most visitors have made it past the cable car.",
      ],
      pullImage: "/tours/lai-chau-motortour/3.webp",
    },

    elevationProfile: [
      // ── 1 Day ────────────────────────────────────────────────────────────
      { time: "08:30", label: "Sa Pa · meet",          elevation: 1500, icon: "resort",  highlight: false, durationOnly: "1day" },
      { time: "10:00", label: "Nậm Sài · trek start", elevation: 868,  icon: "hike",    highlight: false, durationOnly: "1day" },
      { time: "12:00", label: "Nậm Cang · lunch",     elevation: 660,  icon: "food",    highlight: true,  durationOnly: "1day" },
      { time: "14:30", label: "Red Dao village",       elevation: 800,  icon: "village", highlight: true,  durationOnly: "1day" },
      { time: "16:00", label: "Terraced fields",       elevation: 760,  icon: "free",    highlight: false, durationOnly: "1day" },
      { time: "17:30", label: "Back in Sa Pa",         elevation: 1500, icon: "resort",  highlight: false, durationOnly: "1day" },

      // ── 2D1N · Day 1 ─────────────────────────────────────────────────────
      { time: "06:30", label: "Depart Hanoi",          elevation: 20,   icon: "van",     highlight: false, durationOnly: "2d1n", day: 1 },
      { time: "13:30", label: "Arrive Sa Pa · lunch",  elevation: 1500, icon: "food",    highlight: false, durationOnly: "2d1n", day: 1 },
      { time: "15:15", label: "Ý Linh Hồ · trek",    elevation: 1330, icon: "hike",    highlight: false, durationOnly: "2d1n", day: 1 },
      { time: "17:00", label: "Mường Hoa valley",     elevation: 1050, icon: "hike",    highlight: false, durationOnly: "2d1n", day: 1 },
      { time: "18:30", label: "Tả Van · homestay",    elevation: 1070, icon: "resort",  highlight: true,  durationOnly: "2d1n", day: 1 },

      // ── 2D1N · Day 2 ─────────────────────────────────────────────────────
      { time: "08:30", label: "Giàng Tả Chải · trek", elevation: 990,  icon: "hike",    highlight: false, durationOnly: "2d1n", day: 2 },
      { time: "10:30", label: "Drive to Nậm Sài",     elevation: 868,  icon: "van",     highlight: false, durationOnly: "2d1n", day: 2 },
      { time: "11:30", label: "Rice terrace trek",     elevation: 780,  icon: "hike",    highlight: false, durationOnly: "2d1n", day: 2 },
      { time: "13:30", label: "Nậm Cang · lunch",     elevation: 660,  icon: "food",    highlight: true,  durationOnly: "2d1n", day: 2 },
      { time: "15:00", label: "Red Dao village",       elevation: 800,  icon: "village", highlight: true,  durationOnly: "2d1n", day: 2 },
      { time: "16:00", label: "Terraced fields",       elevation: 760,  icon: "free",    highlight: false, durationOnly: "2d1n", day: 2 },
      { time: "17:45", label: "Sa Pa · herb bath",    elevation: 1500, icon: "free",    highlight: true,  durationOnly: "2d1n", day: 2 },
    ],
    elevationMax: 1600,

    activityCards: [
      // ── 1 Day ─────────────────────────────────────────────────────────────
      {
        badge: "van", badgeLabel: "Drive",
        time: "08:30 – 10:00 · 1 Day",
        title: "Sa Pa to Nậm Sài — The Road South",
        desc: "The drive from Sa Pa toward Nậm Sài takes 90 minutes along mountain roads that most tour vehicles never use. The route drops out of the Sa Pa plateau and into a lower valley system — the air changes, the vegetation changes, and the tourist circuit falls away behind you. Nậm Sài is a small H'Mông settlement at 868m, at the edge of the terrace system that connects down to Nậm Cang. This is where you leave the car and start walking.",
        highlight: false,
        durationOnly: "1day",
      },
      {
        badge: "trek", badgeLabel: "Trek",
        time: "10:00 – 12:00 · 1 Day",
        title: "Nậm Sài to Nậm Cang — Through the Terraces",
        desc: "Two hours on foot through working rice terraces — not a loop trail, not a viewpoint path. The route descends from Nậm Sài at 868m to the Nậm Cang valley at 660m, following the edges of paddy fields that are actively farmed. The landscape is season-dependent: mirror-flat flooded fields in May, vivid green in July and August, deep gold in September and October. The trail is narrow in places and uneven underfoot — this is not a paved circuit. No other tour groups use this route.",
        highlight: true,
        durationOnly: "1day",
      },
      {
        badge: "food", badgeLabel: "Lunch",
        time: "12:00 – 13:30 · 1 Day",
        title: "Lunch at Nậm Cang — Cooked in the Village",
        desc: "Lunch is prepared by a Red Dao family in Nậm Cang — rice, local vegetables, whatever the season offers. Not a restaurant, not a tourist set menu. You eat in or around the family home, with time to sit and recover from the walk before the afternoon in the village. The food is simple and good. The setting is the point.",
        highlight: false,
        durationOnly: "1day",
      },
      {
        badge: "village", badgeLabel: "Village",
        time: "13:30 – 16:00 · 1 Day",
        title: "Nậm Cang — Red Dao Village",
        desc: "The Red Dao in Nậm Cang are one of the few communities in the Sa Pa region that have had limited exposure to organised tourism. The women's hand-embroidered indigo garments and layered headdresses are worn daily — not for visitors. The community maintains traditional herb gardens, practices indigo dyeing, and passes down medicinal knowledge through the women's line. Your host walks you through the village with introductions to the families, not a guided tour of crafts for sale.",
        highlight: true,
        durationOnly: "1day",
      },
      {
        badge: "free", badgeLabel: "Fields",
        time: "16:00 – 17:30 · 1 Day",
        title: "Terraced Fields — Last Light",
        desc: "The final stretch before the drive back is unstructured time in the terraced fields above the village — the best light of the day, no schedule pressure, and the Unlock Challenge running somewhere in this window. The terraces at Nậm Cang are less photographed than those in the Mường Hoa valley, which means you have them to yourself. The drive back to Sa Pa takes about an hour from here.",
        highlight: false,
        durationOnly: "1day",
      },

      // ── 2D1N ──────────────────────────────────────────────────────────────
      {
        badge: "van", badgeLabel: "Night Bus",
        time: "06:30 – 13:30 · Day 1 (2D1N)",
        title: "Hanoi to Sa Pa — Sleeper Bus Overnight",
        desc: "The 2D1N starts with a high-quality sleeper bus from Hanoi's Old Quarter at 06:30 — not the cheapest option on the road, and worth it. Lie-flat berths, air conditioning, roughly 7 hours. You arrive in Sa Pa by early afternoon, eat lunch, and meet your host before the afternoon trek begins. It's a long travel day compressed into a window that leaves both days free for walking.",
        highlight: false,
        durationOnly: "2d1n",
      },
      {
        badge: "hike", badgeLabel: "Trek",
        time: "15:15 – 18:30 · Day 1 (2D1N)",
        title: "Ý Linh Hồ to Tả Van — Mường Hoa Valley Descent",
        desc: "The afternoon of Day 1 is the full Mường Hoa valley descent — starting at Ý Linh Hồ (1,330m), a Black H'Mông settlement on the terrace hillside, and ending at Tả Van on the valley floor (1,070m). Three hours of walking through wild rice terraces, bamboo forest, and open hillside with the Hoàng Liên Sơn peaks above. This is the classic Sa Pa trekking landscape — unmodified and mostly free of tourist infrastructure. You arrive at the homestay as the light leaves the mountains.",
        highlight: true,
        durationOnly: "2d1n",
      },
      {
        badge: "resort", badgeLabel: "Homestay",
        time: "18:30 – 08:00 · Night (2D1N)",
        title: "Tả Van Homestay — H'Mông Family",
        desc: "The night is spent at a local H'Mông family homestay in Tả Van — a village at the bottom of the Mường Hoa valley. Dinner is cooked by the family: rice, vegetables grown in the valley, occasionally chicken or pork. The house is traditional in structure. The experience is not curated — you sleep in a family home in a working village, not a boutique property. In the morning you eat breakfast with the family and set out on foot toward Giàng Tả Chải.",
        highlight: true,
        durationOnly: "2d1n",
      },
      {
        badge: "hike", badgeLabel: "Trek",
        time: "08:30 – 10:30 · Day 2 (2D1N)",
        title: "Tả Van to Giàng Tả Chải — Morning Trek",
        desc: "Day 2 starts on foot from the homestay. The route crosses from Tả Van to Giàng Tả Chải — two hours through the lower valley, rice fields, and a section of forested hillside. At 990m, Giàng Tả Chải sits slightly above Tả Van. The morning light on the terraces is the best of the day. From Giàng Tả Chải you board a vehicle for the drive to Nậm Sài, where the second major trek begins.",
        highlight: false,
        durationOnly: "2d1n",
      },
      {
        badge: "trek", badgeLabel: "Trek",
        time: "11:30 – 13:30 · Day 2 (2D1N)",
        title: "Nậm Sài to Nậm Cang — The Terrace Route",
        desc: "The same route the 1 Day option uses — from Nậm Sài at 868m down through the rice terraces to Nậm Cang at 660m. After a morning of walking from the homestay, this is the second half of a full day on foot. The Nậm Cang terraces are quieter and less visited than those in the Mường Hoa valley. The route is narrow, uneven, and passes through working paddy fields. No other tour groups are on it.",
        highlight: true,
        durationOnly: "2d1n",
      },
      {
        badge: "village", badgeLabel: "Village",
        time: "13:30 – 16:45 · Day 2 (2D1N)",
        title: "Nậm Cang — Red Dao Community & Terraced Fields",
        desc: "Lunch in the village, then time with the Red Dao community — the same cultural experience as the 1 Day option, but arrived at after two days of walking through three distinct ethnic communities: Black H'Mông at Ý Linh Hồ, H'Mông at Tả Van, and Red Dao here. The contrast is the point. The Unlock Challenge runs in the terraced fields in the afternoon before the drive back to Sa Pa.",
        highlight: true,
        durationOnly: "2d1n",
      },
      {
        badge: "free", badgeLabel: "Herb Bath",
        time: "17:45 – 18:45 · Day 2 (2D1N)",
        title: "Red Dao Herbal Bath — Sa Pa",
        desc: "The day ends with a Red Dao herbal bath in Sa Pa — a blend of 10–12 mountain herbs prepared by Red Dao women, used for centuries to treat muscle fatigue and joint pain after fieldwork. The preparation is authentic: the herbs are the same ones used in the villages, sourced from the hills above Sa Pa, not a commercial formula. About 45 minutes in a wooden tub. After two full days of trekking through the valley, the timing makes sense.",
        highlight: true,
        durationOnly: "2d1n",
      },
    ],

    welcomePack: {
      ...DEFAULT_WELCOME_PACK,
      intro: "At the start of the day, your host hands you a Morning Vietnam pack. One item earns its place on the terrace walk.",
    },

    seasonality: {
      intro: "Nậm Cang's rice terraces change dramatically by season. The route is walkable year-round — what you see changes everything.",
      months: [
        { name: "Jan", level: "good" },
        { name: "Feb", level: "good" },
        { name: "Mar", level: "good" },
        { name: "Apr", level: "good" },
        { name: "May", level: "best" },
        { name: "Jun", level: "best" },
        { name: "Jul", level: "best" },
        { name: "Aug", level: "best" },
        { name: "Sep", level: "best" },
        { name: "Oct", level: "best" },
        { name: "Nov", level: "good" },
        { name: "Dec", level: "good" },
      ],
      notes: [
        { title: "Rice season peak (May – Oct)", desc: "May–Jun: flooded fields, mirror reflections, transplanting season — the terraces are at their most alive. Jul–Aug: vivid green, full growth, cloud season (expect mist — it adds to the atmosphere). Sep–Oct: golden harvest, the most photographed landscape in northern Vietnam. This is the window most people come for." },
        { title: "Dry season (Nov – Apr)", desc: "The terraces are quieter and drier. Jan–Feb can bring cold fog and occasional frost at altitude — bring layers. Mar–Apr: plum and peach blossoms in the valley. The trek is easier underfoot, the light is cleaner, and the village is calmer. A different experience, not a worse one." },
      ],
    },

    faqs: [
      { q: "Which option should I choose — 1 Day or 2D1N?", a: "1 Day is right if you're based in Sa Pa and want a full day in the Nậm Cang valley without the overnight. 2D1N is the fuller picture: it starts from Hanoi, adds the Mường Hoa valley approach via Ý Linh Hồ and Tả Van, and covers two different ethnic communities (Black H'Mông + Red Dao) across two days of proper trekking. The herb bath on Day 2 is a good reason to choose it on its own." },
      { q: "How hard is the trekking?", a: "Moderate — suitable for anyone with reasonable fitness. The 1 Day route is 2–3 hours of walking on uneven terrace paths with some elevation change. The 2D1N adds a longer Day 1 descent (3h+) through the Mường Hoa valley. No technical sections. Trekking poles are useful but not required. Minimum age 12." },
      { q: "What is the Red Dao herbal bath?", a: "A medicinal bath using a blend of 10–12 mountain herbs traditionally prepared by Red Dao women — used for centuries to treat fatigue and sore muscles after fieldwork. On the 2D1N, it's included at the end of Day 2 in Sa Pa. About 45 minutes of soaking in a wooden tub. You'll want it after two days of walking." },
      { q: "What is the best time of year for the rice terraces?", a: "Sep–Oct for golden harvest colour. May–Jun for flooded mirror-field reflections during transplanting season. Jul–Aug for vivid green and moody cloud conditions. The route is walkable year-round — what changes is what the terraces look like." },
      ...DEFAULT_FAQS.slice(2),
    ],

    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
    upcomingDates: ["Wed 22 Jul", "Sun 26 Jul", "Mon 27 Jul", "Sun 2 Aug"],
  },

  // ── Into Nậm Lúc Waterfall ───────────────────────────────────────────────
  {
    slug:        "into-nam-luc",
    name:        "Into Nậm Lúc Waterfall",
    region:      "north",
    duration:    ["1 Day"],
    price:       "from $63",
    priceUSD:    63,
    priceVND:    1650000,
    tagline:     "A limestone cave, a jungle trek to an untouched waterfall, and the highest viewpoint in Lai Châu — all in one day from Sa Pa.",
    description: "Leave Sa Pa at dawn. Visit Tiên Sơn Cave, then ride motorbike taxis deep into the jungle to the trailhead at 430m. Trek up through primary forest — gaining 470 metres of altitude — to Nậm Lúc Waterfall, swim, eat lunch among the trees, then push to the summit at 900m. Car option ends at Linh Ứng Temple (1,250m) — the best sunset view in all of Lai Châu. Back in Sa Pa by evening.",
    highlights: [
      "Tiên Sơn Cave — limestone cave system",
      "Motorbike taxi into jungle — trailhead at 430m, arranged by Morning Vietnam",
      "Full trek: 430m (trailhead) → 900m (summit) through primary forest",
      "Swim at Nậm Lúc Waterfall — jungle lunch at the falls",
      "Car option: Linh Ứng Temple at 1,250m — sunset over Lai Châu city",
      "Day trip from Sa Pa, back by evening",
    ],
    included: [
      "Transport Sa Pa → Lai Châu → Sa Pa",
      "Motorbike taxi to & from waterfall trailhead (arranged, included)",
      "Cave entrance fee",
      "Jungle lunch at the waterfall",
      "Dedicated Morning Vietnam host, full day",
      "Unlock Challenge",
      "Welcome pack",
    ],
    hub:         "Sa Pa",
    hubUrl:      "/tours/sapa-lai-chau",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  false,
    image:       "/tours/into-nam-luc/1.webp",
    panoramicImage: "/tours/sapa-trekking-classic/panoramic.jpg",
    selectorMode: 'vehicle-only',

    gallery: [
      { src: "/tours/into-nam-luc/1.webp",  alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/2.webp",  alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/3.webp",  alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/4.webp",  alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/5.webp",  alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/6.webp",  alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/7.webp",  alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/8.webp",  alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/9.webp",  alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/10.webp", alt: "Into Nậm Lúc Waterfall" },
      { src: "/tours/into-nam-luc/11.webp", alt: "Into Nậm Lúc Waterfall" },
    ],

    durationOptions: [
      {
        id:       "car",
        label:    "By car",
        price:    81,
        priceVND: 2130000,
        tagline:  "Private car Sa Pa → cave → jungle → waterfall → Linh Ứng Temple sunset. Back by 20:15. Mon departures.",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now · Pay 14 days before · Free cancellation until then",
        waText:   "Hi Morning Vietnam — I'd like to book Into Nậm Lúc Waterfall (By Car, $81/person)",
      },
      {
        id:       "motor",
        label:    "By motorbike",
        price:    63,
        priceVND: 1650000,
        tagline:  "Motorbike Sa Pa → cave → jungle → waterfall. No Linh Ứng Temple — back in Sa Pa by 19:30. Thu departures.",
        ctaLabel: "I'm in →",
        ctaNote:  "Valid motorbike licence required for self-ride · No payment now · Free cancellation",
        waText:   "Hi Morning Vietnam — I'd like to book Into Nậm Lúc Waterfall (By Motorbike, $63/person)",
      },
    ],

    tripInfo: {
      "car": [
        { icon: "map-pin",         label: "Meeting point",     value: "Sa Pa town · Mon · 06:00" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "car",             label: "Vehicle",           value: "Private car, full day" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast + jungle lunch included" },
        { icon: "mountain",        label: "Max altitude",      value: "1,250m · Linh Ứng Temple" },
        { icon: "calendar-check",  label: "Departure days",    value: "Mon · Flexible for groups of 3+" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
      "motor": [
        { icon: "map-pin",         label: "Meeting point",     value: "Sa Pa town · Thu · 06:00" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "motorbike",       label: "Vehicle",           value: "Semi-auto 125cc Honda, full day" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast + jungle lunch included" },
        { icon: "mountain",        label: "Max altitude",      value: "900m · Nậm Lúc Waterfall summit" },
        { icon: "calendar-check",  label: "Departure days",    value: "Thu · Flexible for groups of 3+" },
        { icon: "license",         label: "Licence",           value: "Required for self-ride · backseat available" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
    },

    discountPolicy: {
      rules: [
        { label: "Group 10+",      value: "20% off per person" },
        { label: "Min age",        value: "15 years old (fitness & safety requirement)" },
      ],
    },

    itinerary: [
      {
        day: 1,
        title: "Cave, Jungle & Waterfall",
        slots: [
          "06:00 Breakfast — chicken phở at Sơn Râu, Sa Pa",
          "06:30 Car: depart Sa Pa · drive to Bình Lư, Lai Châu (1h15)",
          "06:20 Motor: vehicle check, waiver sign · 06:30 depart Sa Pa (1h30 to cave)",
          "07:45 Car: Tiên Sơn Cave · 08:00 Motor: Tiên Sơn Cave",
          "08:45 Car: depart for Nậm Lúc trailhead (2h15) · 09:00 Motor: depart (2h30)",
          "11:00 Car: arrive trailhead (430m) · 11:30 Motor: arrive trailhead (430m)",
          "11:00 Car / 11:30 Motor: trek begins — primary forest, gaining altitude",
          "13:00 Car / 13:30 Motor: lunch at the waterfall",
          "13:30 Car / 14:00 Motor: summit push to 900m",
          "14:30 Car / 15:00 Motor: play, swim, explore at the waterfall",
          "15:00 Car / 15:30 Motor: descend to 500m · motorbike taxi picks up",
          "15:30 Car / 16:00 Motor: xe ôm back to trailhead (430m)",
          "16:00 Car: depart for Linh Ứng Temple (1h30) · 16:30 Motor: depart for Sa Pa (3h)",
          "17:30 Car only: Linh Ứng Temple (1,250m) — sunset over Lai Châu city",
          "18:15 Car only: depart for Sa Pa",
          "19:30 Motor: arrive Sa Pa",
          "20:15 Car: arrive Sa Pa",
        ],
      },
    ],

    pitch: {
      headline: "Nậm Lúc doesn't appear on maps that tourists use. That's why it's worth going.",
      bullets: [
        "80km past the last coach road — trailhead is a jungle clearing at 430m, no tourism infrastructure",
        "470m climb through primary forest, lunch cooked and eaten at the waterfall's edge",
        "Car option: Linh Ứng Temple at 1,250m — one of the northwest's best sunsets, almost no one knows it",
      ],
      closingLine: "One day. One waterfall. Nothing packaged about it.",
    },

    valueAnchor: {
      headline: "From $61. For a waterfall most northwest travellers walk past without knowing exists.",
      paragraphs: [
        "Nậm Lúc is not on any standard tour operator's menu because getting there requires: a driver who knows the road, motorbike taxi contacts at the trailhead, and a guide who's done the forest route before. We have all three, built into the price.",
        "Included: private transport Sa Pa ↔ Lai Châu all day, motorbike taxi in and out of the jungle, cave entrance, jungle lunch, full-day host, Unlock Challenge, welcome pack. Min group 3, max 12 — this never runs as a coach tour.",
      ],
      compareTable: [
        { metric: "Waterfall access",     typical: "No equivalent for foreign tourists — we pioneered this",  us: "5-hour jungle trek, no road" },
        { metric: "Other tourists",       typical: "No equivalent for foreign tourists — we pioneered this",  us: "Likely just your group" },
        { metric: "Altitude range",       typical: "No equivalent for foreign tourists — we pioneered this",  us: "430m → 900m trek + 1,250m sunset" },
        { metric: "Lunch",                typical: "No equivalent for foreign tourists — we pioneered this",  us: "Cooked & eaten in the forest" },
        { metric: "Sunset (Car option)",  typical: "No equivalent for foreign tourists — we pioneered this",  us: "Linh Ứng Temple · 1,250m" },
        { metric: "Unlock Challenge",     typical: "No equivalent for foreign tourists — we pioneered this",  us: "Included" },
      ],
    },

    storytelling: {
      headline: "The waterfall has no gift shop. That's the whole point.",
      paragraphs: [
        "Nậm Lúc is not easy to find. It doesn't appear on Google Maps with a pin. The road to the trailhead exists because locals built it — not because tour operators needed it. The motorbike taxi drivers at the clearing at 430 metres are the same men who take villagers in and out when the forest road allows it.",
        "The trek goes through primary tropical forest — not the kind that's been cleared and planted back, but the kind that closes in around you within five minutes of starting. The canopy is thick enough that heavy rain barely reaches the trail. When the waterfall appears after the final climb, there is no viewing platform, no railing, no food stall. Just water, rock, and the sound of the jungle.",
        "The car option ends the day at Linh Ứng Temple, a Buddhist monastery at 1,250m on the ridge above Lai Châu city. The monks built it for prayer, not for tourism. The view over the valley from the terrace is the kind that makes you stop talking. We get there for the last hour of light.",
      ],
      pullImage: "/tours/into-nam-luc/pull.webp",
    },

    elevationProfile: [
      { time: "06:00", label: "Sa Pa · Meet & phở",        elevation: 1500, icon: "food",     highlight: false },
      { time: "07:45", label: "Tiên Sơn Cave",             elevation: 700,  icon: "cave",     highlight: true  },
      { time: "11:00", label: "Trek begins",               elevation: 430,  icon: "hike",     highlight: false },
      { time: "13:00", label: "Lunch in the jungle",       elevation: 700,  icon: "food",     highlight: false },
      { time: "14:30", label: "Nậm Lúc Summit",           elevation: 900,  icon: "peak",     highlight: true  },
      { time: "15:00", label: "Trekking out",              elevation: 900,  icon: "hike",     highlight: false },
      { time: "15:30", label: "Motorbike taxi",            elevation: 500,  icon: "van",      highlight: false },
      { time: "16:00", label: "To Linh Ứng Temple",       elevation: 430,  icon: "van",      highlight: false },
      { time: "17:30", label: "Sunset · Linh Ứng",        elevation: 1250, icon: "landmark", highlight: true  },
      { time: "20:15", label: "Back in Sa Pa",             elevation: 1500, icon: "resort",   highlight: false },
    ],
    elevationMax: 1500,

    activityCards: [
      {
        badge: "cave", badgeLabel: "Cave",
        time: "07:45 – 08:45",
        title: "Tiên Sơn Cave",
        desc: "A limestone cave system on the Lai Châu side of O Quy Hồ — stalactites, stalagmites, and an underground stream. Not on the Sa Pa tourist circuit. The cave sits at 750m in Tam Đường district, where the valley opens wide before the jungle starts.",
        highlight: false,
      },
      {
        badge: "trek", badgeLabel: "Motorbike taxi",
        time: "11:00 – 11:30",
        title: "Into the Jungle — Motorbike Taxi to the Trailhead",
        desc: "The car stops at 430m. From here, the only way in is motorbike taxis that thread through the final stretch of jungle track. Morning Vietnam arranges this. The 30-minute ride is itself an introduction to the forest before the trek begins.",
        highlight: false,
      },
      {
        badge: "trek", badgeLabel: "Trek",
        time: "11:30 – 14:30",
        title: "Nậm Lúc Waterfall Trek — Primary Forest to 900m",
        desc: "The full route gains 470 metres from the trailhead at 430m to the summit at 900m through primary tropical forest. No trail markers — that's what the guide is for. The waterfall base sits at 500m; the return route dips to 350m on a rough jungle track before xe ôm back to 430m. The forest is dense, the trail is real, and there's nothing touristy about any of it.",
        highlight: true,
      },
      {
        badge: "free", badgeLabel: "Waterfall",
        time: "13:00 – 15:00",
        title: "Nậm Lúc Waterfall — Swim & Explore",
        desc: "At the base: a pool fed by highland streams running off the ridge above. The water is cold and clear. Time here is unstructured — eat, swim, photograph, rest. No timetable on this section. The return motorbike taxi picks you up when you're ready.",
        highlight: true,
      },
      {
        badge: "landmark", badgeLabel: "Sunset",
        time: "17:30 – 18:15 · Car only",
        title: "Linh Ứng Temple — Sunset at 1,250m",
        desc: "A Buddhist monastery on the ridge at 1,250m above Lai Châu city. Built by monks, not for tourists — but the terrace has an unobstructed view over the entire valley. One of the best sunset positions in the northwest. Car option only: motorbike guests return directly to Sa Pa.",
        highlight: true,
      },
    ],

    welcomePack: {
      ...DEFAULT_WELCOME_PACK,
      intro: "At the start of the day, your host hands you a Morning Vietnam pack. One item in particular earns its place on the trek.",
    },

    seasonality: {
      intro: "The forest is always there. The trail has a season.",
      months: [
        { name: "Jan", level: "best" },
        { name: "Feb", level: "best" },
        { name: "Mar", level: "best" },
        { name: "Apr", level: "good" },
        { name: "May", level: "wet"  },
        { name: "Jun", level: "wet"  },
        { name: "Jul", level: "wet"  },
        { name: "Aug", level: "wet"  },
        { name: "Sep", level: "good" },
        { name: "Oct", level: "best" },
        { name: "Nov", level: "best" },
        { name: "Dec", level: "best" },
      ],
      notes: [
        { title: "Best conditions (Oct – Apr)", desc: "Dry trail, clear forest, maximum visibility at Linh Ứng Temple. October–November gives you rice terraces in the valley and sharp afternoon light on the ridge. January–February the mornings are cool and crisp — perfect for a long forest climb." },
        { title: "Wet season (May – Sep)",      desc: "The jungle section is wetter and muddier. The waterfall runs higher and louder — more dramatic, more slippery on the rocks. We check trail conditions each morning and adjust the route if needed. The cave visit is unaffected either way." },
      ],
    },

    faqs: [
      { q: "Car or motorbike — which should I choose?", a: "Car includes Linh Ứng Temple at sunset — a monastery at 1,250m with one of the best views in Lai Châu. Motorbike skips the sunset but costs less and ends earlier (Sa Pa by 19:30). The waterfall trek is the same either way." },
      { q: "Do I need to be fit for the trek?", a: "Yes — moderate fitness required. The trek gains 470m of altitude (430m → 900m) over roughly 3 hours, on uneven forest trail with no technical sections. Minimum age 15. If you can walk comfortably uphill for 90 minutes, you can do this." },
      { q: "Do I need a motorbike licence?", a: "Yes for self-ride — valid licence with motorcycle endorsement required. Backseat (pillion) is available without a licence. Let us know when booking." },
      { q: "What is the motorbike taxi and is it safe?", a: "Motorbike taxis are the standard way locals travel into areas where cars can't go. Morning Vietnam arranges them directly; the drivers know the jungle track. It's a 30-minute ride each way on a narrow forest road." },
      ...DEFAULT_FAQS.slice(2),
    ],

    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
    upcomingDates: ["Wed 22 Jul", "Thu 23 Jul"],
  },

  // ── Unlock Lai Châu ──────────────────────────────────────────────────────
  {
    slug:        "unlock-lai-chau",
    name:        "Unlock Lai Châu",
    region:      "north",
    duration:    ["2D1N"],
    price:       "from $160",
    priceUSD:    160,
    priceVND:    4190000,
    tagline:     "Hanoi to Lai Châu direct — caves, villages, a waterfall, and a sunset monastery. No Sa Pa required.",
    description: "Skip Sa Pa entirely. Take the overnight bus from Hanoi straight into Lai Châu city — then spend two full days in a valley most northwest travellers never reach. Day 1: Động PuSamCap, Lao Chải 1 village, Thác Tác Tình waterfall, sunset and homestay at Sì Thâu Chải. Day 2: full jungle trek to Nậm Lúc Waterfall, then Chùa Linh Ứng at dusk — the highest viewpoint in Lai Châu. Sleeper bus back to Hanoi overnight. Car or motorbike — same two days, different way of taking them in.",
    highlights: [
      "Động PuSamCap — one of the largest cave systems in Lai Châu province",
      "Lao Chải 1 village — H'Mông community, local host, no tourist infrastructure",
      "Thác Tác Tình — waterfall swim in the valley",
      "Overnight at Sì Thâu Chải — Dao village homestay above the clouds",
      "Day 2: full Nậm Lúc Waterfall trek — 430m → 900m through primary forest",
      "Chùa Linh Ứng at 1,250m — the best sunset viewpoint in Lai Châu",
      "Sleeper bus both ways — zero overlap with the standard Sa Pa circuit",
    ],
    included: [
      "Overnight sleeper bus Hanoi ↔ Lai Châu (both ways)",
      "Private car / motorbike, full 2 days",
      "All meals: Day 1 breakfast → Day 2 dinner",
      "Homestay at Sì Thâu Chải (Local Dao homestay)",
      "Hotel (brief stay on arrival morning & departure night)",
      "All activity & entrance fees",
      "Motorbike taxi into Nậm Lúc jungle (Day 2)",
      "Dedicated Morning Vietnam host",
      "Unlock Challenge",
      "Welcome pack",
    ],
    hub:         "Hanoi",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  false,
    image:       "/tours/lai-chau-motortour/15.webp",
    panoramicImage: "/tours/sapa-trekking-classic/panoramic.jpg",
    gallery: [
      { src: "/tours/unlock-lai-chau/1.webp",  alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/2.webp",  alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/3.webp",  alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/4.webp",  alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/5.webp",  alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/6.webp",  alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/7.webp",  alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/8.webp",  alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/9.webp",  alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/10.webp", alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/11.webp", alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/12.webp", alt: "Unlock Lai Châu" },
      { src: "/tours/unlock-lai-chau/13.webp", alt: "Unlock Lai Châu" },
    ],
    selectorMode: 'vehicle-only',

    durationOptions: [
      {
        id:       "car",
        label:    "By car",
        price:    184,
        priceVND: 4820000,
        tagline:  "",
        ctaLabel: "I'm in →",
        ctaNote:  "No payment now · Pay 14 days before · Free cancellation until then",
        waText:   "Hi Morning Vietnam — I'd like to book Unlock Lai Châu (By Car, $184/person)",
      },
      {
        id:       "motor",
        label:    "By motorbike",
        price:    160,
        priceVND: 4190000,
        tagline:  "Semi-auto 125cc · same two days, same route — felt through every curve. Licence required for self-ride. Mondays.",
        ctaLabel: "I'm in →",
        ctaNote:  "Valid motorbike licence required for self-ride · backseat available · No payment now · Free cancellation",
        waText:   "Hi Morning Vietnam — I'd like to book Unlock Lai Châu (By Motorbike, $160/person)",
      },
    ],

    tripInfo: {
      "car": [
        { icon: "map-pin",         label: "Pickup",            value: "Old Quarter, Hanoi · Sun · 21:30" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "car",             label: "Vehicle",           value: "Sleeper bus (HN ↔ Lai Châu) + private car" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast + lunch + dinner × 2 days" },
        { icon: "home",            label: "Accommodation",     value: "Local Dao Homestay · Sì Thâu Chải" },
        { icon: "mountain",        label: "Max altitude",      value: "1,250m · Linh Ứng Temple" },
        { icon: "calendar-check",  label: "Departure days",    value: "Sun nights · Flexible for groups of 3+" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
      "motor": [
        { icon: "map-pin",         label: "Pickup",            value: "Old Quarter, Hanoi · Mon · 21:30" },
        { icon: "users",           label: "Group size",        value: "3 – 12 people" },
        { icon: "motorbike",       label: "Vehicle",           value: "Sleeper bus (HN ↔ Lai Châu) + semi-auto 125cc Honda" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast + lunch + dinner × 2 days" },
        { icon: "home",            label: "Accommodation",     value: "Local Dao Homestay · Sì Thâu Chải" },
        { icon: "mountain",        label: "Max altitude",      value: "1,250m · Linh Ứng Temple" },
        { icon: "calendar-check",  label: "Departure days",    value: "Mon nights · Flexible for groups of 3+" },
        { icon: "license",         label: "Licence",           value: "Required for self-ride · backseat available" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
    },

    discountPolicy: {
      rules: [
        { label: "Group 10+",  value: "20% off per person" },
        { label: "Min age",    value: "15 years old" },
      ],
    },

    itinerary: [
      {
        day: 0,
        title: "Night — Hanoi → Lai Châu",
        slots: [
          "21:30  Board sleeper bus at Old Quarter, Hanoi",
          "05:00  Arrive Lai Châu city — check in to hotel, freshen up",
        ],
      },
      {
        day: 1,
        title: "Cave, Village & Waterfall",
        slots: [
          "06:15  Vehicle check · Car: meet your driver · Motor: inspect bike, sign waiver",
          "06:45 – 07:30  Breakfast in Lai Châu city",
          "07:30  Drive to Động PuSamCap (30 min)",
          "08:00 – 09:30  Explore PuSamCap Cave — limestone galleries, stalactites, underground stream",
          "09:30  Drive to Lao Chải 1 village (1h)",
          "10:30 – 11:30  Explore the village with your local host",
          "11:30 – 13:00  Lunch at Lao Chải 1 and afternoon rest",
          "13:00  Drive to Thác Tác Tình (45 min)",
          "13:45 – 15:00  Hike to the waterfall · swim",
          "15:00  Drive to Sì Thâu Chải (15 min)",
          "15:15 – 18:15  Explore the Dao village · sunset from the ridge",
          "19:00 – 21:00  Dinner with happy water at the homestay",
          "21:00  Rest",
        ],
      },
      {
        day: 2,
        title: "Jungle, Summit & The Light",
        slots: [
          "07:30 – 08:15  Breakfast at the homestay — clouds still on the peaks",
          "08:15  Drive to Nậm Lúc Waterfall trailhead (3h)",
          "11:15 – 13:15  Trek begins at 430m — primary forest, gaining altitude",
          "13:15 – 13:45  Lunch break on the trail",
          "13:45 – 14:45  Summit push to 900m",
          "14:45 – 15:15  Play, swim, explore at the waterfall",
          "15:15  Descend · xe ôm picks up at 500m",
          "15:45  Xe ôm back to trailhead (430m)",
          "16:15  Drive to Linh Ứng Temple (1h30)",
          "17:45 – 18:30  Sunset at Chùa Linh Ứng — 1,250m above Lai Châu city",
          "18:30  Check in to hotel · rest",
          "20:00 – 22:00  Dinner — Lai Châu specialities with happy water",
          "22:00  Board sleeper bus back to Hanoi",
        ],
      },
    ],

    pitch: {
      headline: "Lai Châu is northwest Vietnam without the tourist circuit. You get there overnight.",
      bullets: [
        "Sleeper bus Hanoi → Lai Châu direct — no Sa Pa leg, no extra day, arrive at dawn",
        "Day 1: cave, H'Mông village, waterfall, Dao homestay above the valley — none of it on a standard menu",
        "Day 2: jungle trek to Nậm Lúc waterfall, then the highest viewpoint in Lai Châu at dusk",
      ],
      closingLine: "Two nights on a sleeper bus. Two days in Lai Châu. Nothing wasted.",
    },

    valueAnchor: {
      headline: "From $160. For two full days in the part of the northwest that doesn't get visited.",
      paragraphs: [
        "The price includes both sleeper buses, private car or motorbike for two full days, all meals from Day 1 breakfast through Day 2 dinner, homestay at Sì Thâu Chải, hotel (arrival morning and departure night), all entrance fees, motorbike taxi into the Nậm Lúc jungle, full-day host, Unlock Challenge, and welcome pack.",
        "Min group 3, max 12. Departs Monday nights — flexible for private groups of 3 or more.",
      ],
      compareTable: [
        { metric: "Departure point",    typical: "Sa Pa (requires prior travel)",       us: "Hanoi direct — no Sa Pa needed" },
        { metric: "Cave",               typical: "None on standard circuits",           us: "Động PuSamCap — Lai Châu's largest" },
        { metric: "Villages",           typical: "Tourist villages with gift shops",    us: "Lao Chải 1 + Sì Thâu Chải — no tourist infrastructure" },
        { metric: "Overnight",          typical: "Hotel in Sa Pa",                      us: "Local Dao homestay · Sì Thâu Chải" },
        { metric: "Day 2 waterfall",    typical: "Not available on standard tours",     us: "Full Nậm Lúc jungle trek · 430m → 900m" },
        { metric: "Unlock Challenge",   typical: "Not available",                       us: "Included" },
      ],
    },

    storytelling: {
      headline: "The bus arrives before the city wakes up. That's exactly the point.",
      paragraphs: [
        "Lai Châu city at 5am is quiet in a way Sa Pa never is. The market vendors are setting up. The streets smell like woodsmoke and phở. The sleeper bus from Hanoi pulls in and the day begins before most tourists in the northwest have had breakfast.",
        "Day 1 runs south through the valley. Động PuSamCap is a limestone cave system that sits an hour from Lai Châu city — galleries of stalactites, an underground stream, and almost no other visitors. From there, Lao Chải 1: a H'Mông village where the blacksmith forge is still the centre of the community. Lunch in the village. Then Thác Tác Tình — a waterfall in a narrow gorge where the water is cold and the afternoon light comes through the trees at an angle. By sunset, you're at Sì Thâu Chải, a Dao village on the ridge, watching the light leave the valley from the homestay terrace.",
        "Day 2 goes deep. The drive to the Nậm Lúc trailhead takes three hours and ends at a clearing at 430m. From there, the forest closes in. The trek gains 470 metres through primary jungle to the waterfall base, then pushes to the summit at 900m. The water is loud, the pool is cold, and there is no one else here. The day ends at Linh Ứng Temple — a Buddhist monastery at 1,250m on the ridge above the city. The monks built it for prayer. The view is consequence, not intention.",
      ],
      pullImage: "/tours/lai-chau-motortour/15.webp",
    },

    elevationProfile: [
      { time: "21:30", label: "Depart Hanoi",                    elevation: 20,   icon: "van",      highlight: false, day: 0 },
      { time: "05:00", label: "Arrive Lai Châu, quick nap",      elevation: 900,  icon: "resort",   highlight: false, day: 1 },
      { time: "08:00", label: "PuSamCap Cave",                   elevation: 1025, icon: "cave",     highlight: true,  day: 1 },
      { time: "10:30", label: "Lao Chải 1 Village",              elevation: 1160, icon: "village",  highlight: false, day: 1 },
      { time: "11:30", label: "Local lunch with Mong People",    elevation: 1160, icon: "food",     highlight: false, day: 1 },
      { time: "13:45", label: "Swim at Tác Tình Waterfall",      elevation: 1000, icon: "water",    highlight: true,  day: 1 },
      { time: "15:15", label: "Sì Thâu Chải · Sunset",          elevation: 1450, icon: "hike",     highlight: true,  day: 1 },
      { time: "07:30", label: "Breakfast in the middle of cloud",elevation: 1450, icon: "food",     highlight: false, day: 2 },
      { time: "08:15", label: "To Nậm Lúc Waterfall",           elevation: 1250, icon: "van",      highlight: false, day: 2 },
      { time: "11:15", label: "Trek begins · 430m",              elevation: 430,  icon: "hike",     highlight: false, day: 2 },
      { time: "13:15", label: "Lunch on trail",                  elevation: 700,  icon: "food",     highlight: false, day: 2 },
      { time: "14:45", label: "Nậm Lúc Waterfall Summit",       elevation: 900,  icon: "peak",     highlight: true,  day: 2 },
      { time: "15:45", label: "Motorbike taxi out · 430m",       elevation: 430,  icon: "van",      highlight: false, day: 2 },
      { time: "17:45", label: "Linh Ứng Temple · 1,250m",       elevation: 1250, icon: "landmark", highlight: true,  day: 2 },
      { time: "18:30", label: "Private time",                    elevation: 900,  icon: "free",     highlight: false, day: 2 },
      { time: "22:00", label: "Bus back to Hanoi",               elevation: 900,  icon: "return",   highlight: false, day: 2 },
    ],
    elevationMax: 1450,

    activityCards: [
      {
        badge: "cave", badgeLabel: "Cave",
        time: "08:00 – 09:30 · Day 1",
        title: "Động PuSamCap",
        desc: "One of the largest cave systems in Lai Châu province. Limestone galleries formed over millions of years, with stalactites, stalagmites, and an underground stream running through the lower chambers. The cave sits an hour south of Lai Châu city, in a karst ridge that most travellers drive past without stopping. No crowds, no light show — just the cave.",
        highlight: true,
      },
      {
        badge: "village", badgeLabel: "Village",
        time: "10:30 – 13:00 · Day 1",
        title: "Lao Chải 1 — H'Mông Village",
        desc: "A working H'Mông community in the valley below Sì Thâu Chải — not a display village, not on any coach tour route. Your local host walks you through the rhythms of daily life: the forge, the fields, the weavers. Lunch is cooked in the village and eaten with the family.",
        highlight: false,
      },
      {
        badge: "water", badgeLabel: "Waterfall",
        time: "13:45 – 15:00 · Day 1",
        title: "Thác Tác Tình",
        desc: "A waterfall in a narrow valley gorge at 1,000m — the water comes off the ridge above Sì Thâu Chải and drops into a pool cold enough to stop conversation. The hike in is 30 minutes through scrub forest. The swim is the reward.",
        highlight: false,
      },
      {
        badge: "village", badgeLabel: "Homestay",
        time: "15:15 – overnight · Day 1",
        title: "Sì Thâu Chải — Dao Village Overnight",
        desc: "A Dao village at 1,450m on the ridge above the valley. Your host family has been running the homestay for years — dinner is local, the happy water is local, and the view at sunset is the kind that takes a while to leave. Morning comes with cloud on the peaks and coffee that makes you stay at the table longer than you planned.",
        highlight: true,
      },
      {
        badge: "trek", badgeLabel: "Trek",
        time: "11:15 – 15:15 · Day 2",
        title: "Nậm Lúc Waterfall — Full Jungle Trek",
        desc: "The trailhead is a clearing at 430m where the road ends. From there: primary tropical forest, no trail markers, and 470 metres of altitude gain to the summit at 900m. The route passes the waterfall base at 500m before pushing to the top. Return is by xe ôm from 500m back to 430m — the trail is too steep and rough to walk out. Two hours up, two hours down, lunch on the trail. Nothing packaged about it.",
        highlight: true,
      },
      {
        badge: "landmark", badgeLabel: "Sunset",
        time: "17:45 – 18:30 · Day 2",
        title: "Chùa Linh Ứng — 1,250m above Lai Châu",
        desc: "A Buddhist monastery on the ridge above Lai Châu city, at 1,250m. The monks built it for practice; the terrace happened to become the best sunset viewpoint in the entire province. The valley spreads out below, the city lights come on as the light leaves the peaks. We arrive for the last hour before dark.",
        highlight: true,
      },
    ],

    welcomePack: {
      ...DEFAULT_WELCOME_PACK,
      intro: "On the night bus from Hanoi, your host hands you a Morning Vietnam pack. Each item was chosen for what two days in Lai Châu will ask of you.",
    },

    seasonality: {
      intro: "Lai Châu has weather of its own — drier and clearer than Sa Pa in most seasons.",
      months: [
        { name: "Jan", level: "best" },
        { name: "Feb", level: "best" },
        { name: "Mar", level: "best" },
        { name: "Apr", level: "good" },
        { name: "May", level: "wet"  },
        { name: "Jun", level: "wet"  },
        { name: "Jul", level: "wet"  },
        { name: "Aug", level: "wet"  },
        { name: "Sep", level: "good" },
        { name: "Oct", level: "best" },
        { name: "Nov", level: "best" },
        { name: "Dec", level: "best" },
      ],
      notes: [
        { title: "Best conditions (Oct – Apr)", desc: "Dry trails, clear skies, and the best light for the homestay sunrise at Sì Thâu Chải. October–November the rice terraces in the valley are golden. January–February the air is crisp and the cave system is at its most atmospheric." },
        { title: "Wet season (May – Sep)",      desc: "The Nậm Lúc jungle trek gets muddier and the trail is more demanding. The waterfall runs higher and louder. We monitor trail conditions daily and adjust if needed. PuSamCap Cave and the village visits are unaffected." },
      ],
    },

    faqs: [
      { q: "Car or motorbike — which should I choose?", a: "Both options run the same itinerary across both days. Car is more comfortable for the long drives and easier for those who prefer to focus on the scenery and the people rather than the road. Motorbike gives you the physical experience of the altitude and the valley — every kilometre is felt differently on two wheels. The trek, homestay, and cave are identical either way." },
      { q: "Do I need a motorbike licence?", a: "Yes for self-ride — a valid licence with motorcycle endorsement is required. Backseat (pillion) is available without a licence. Let us know when booking and we'll arrange accordingly." },
      { q: "Do I need to be fit for the Day 2 trek?", a: "Moderate fitness required for Day 2. The Nậm Lúc trek gains 470m of altitude (430m → 900m) over roughly 3 hours on uneven jungle trail. No technical climbing. Minimum age 15. Day 1 is lighter — cave, village, a short waterfall hike." },
      { q: "What is the homestay like at Sì Thâu Chải?", a: "A Local Dao family homestay — traditional house, communal dinner, shared sleeping area (mattresses on platform beds with blankets). No luxury. Running water and a basic bathroom. The dinner, the happy water, and the sunrise from the terrace are the experience." },
      ...DEFAULT_FAQS.slice(2),
    ],

    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
    upcomingDates: ["Fri 24 Jul"],
  },
];

export function getTourBySlug(slug: string) {
  return tours.find((t) => t.slug === slug);
}
