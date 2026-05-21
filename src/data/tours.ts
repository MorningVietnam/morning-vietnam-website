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
export interface DurationOption  { id: string; label: string; price: number | null; tagline: string; ctaLabel: string; ctaNote: string; waText: string }
export interface ElevationPoint  { time: string; label: string; elevation: number; icon?: string; highlight?: boolean; durationOnly?: string }
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
  gallery?:          GalleryItem[];
  durationOptions?:  DurationOption[];
  itinerary?:        ItineraryDay[];
  pitch?:            PitchBlock | Record<string, PitchBlock>;
  valueAnchor?:      ValueAnchorBlock | Record<string, ValueAnchorBlock> | null;
  storytelling?:     Storytelling;
  elevationProfile?: ElevationPoint[];
  elevationMax?:     number;
  activityCards?:    ActivityCard[];
  tripInfo?:         Record<string, TripInfoItem[]>;
  welcomePack?:      WelcomePack;
  seasonality?:      Seasonality;
  faqs?:             FAQ[];
  unlockChallenge?:  UnlockChallenge | null;
}

// ── Shared defaults ────────────────────────────────────────────────────────

const DEFAULT_FAQS: FAQ[] = [
  { q: "What's the maximum group size?",  a: "Max 8 people. We never combine groups. Sometimes we run with 4–5 if that's the booking." },
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
    price:       "From $61/person",
    tagline:     "One man changed a nation. One day to understand why.",
    description: "Follow the physical places that shaped Hồ Chí Minh — from Ba Đình Square to the secret wartime base deep in Ba Vì forest. End at a mountain temple built by the people, not the state. Includes Unlock challenge at K9 Đá Chông.",
    highlights:  [
      "Lăng Chủ tịch Hồ Chí Minh + Nhà sàn + Bảo tàng",
      "K9 Đá Chông — wartime secret base (Unlock Challenge here)",
      "Hoàng hôn tại Đền Thờ Bác Hồ, VQG Ba Vì",
      "Trưa tại Bình Hoa Quán — local Northwestern dishes",
      "2D1N option: Amour Resort Ba Vì + hiking rừng nhiệt đới",
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

    // Duration-based pricing — used by duration switcher in [slug].astro
    durationOptions: [
      {
        id:       "1day",
        label:    "1 Day",
        price:    61,
        tagline:  "Hanoi → Ba Vì → back by 20:00",
        ctaLabel: "I'm doing the 1-day  →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Ho Chi Minh: A Life (1 Day, $61)",
      },
      {
        id:       "2d1n",
        label:    "2 Days 1 Night",
        price:    146,
        tagline:  "Add a night in Ba Vì forest + hiking morning",
        ctaLabel: "I want the full 2 days  →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Ho Chi Minh: A Life (2 Days 1 Night, $146)",
      },
    ],

    itinerary: [
      {
        day: 1,
        title: "The Life",
        slots: [
          "07:30 Có mặt tại điểm tập kết — Phố Cổ Hà Nội",
          "07:30 – 10:50 Lăng Chủ tịch Hồ Chí Minh · Nhà sàn · Bảo tàng HCM",
          "10:50 – 12:10 Di chuyển ra Ba Vì",
          "12:10 – 13:10 Trưa tại Bình Hoa Quán",
          "13:10 – 13:50 Di chuyển đến K9 Đá Chông",
          "13:50 – 15:20 Tham quan K9 Đá Chông + Unlock Challenge",
          "15:20 – 16:05 Di chuyển vào Vườn Quốc Gia Ba Vì",
          "16:05 – 18:05 Thăm Đền Thờ Bác Hồ · đón hoàng hôn",
          "18:05 – 20:05 Di chuyển về Hà Nội (1-day kết thúc tại đây)",
        ],
      },
      {
        day: 2,
        title: "Into the Forest (2D1N only)",
        slots: [
          "18:05 – 18:30 Di chuyển về Amour Resort Ba Vì",
          "18:30 – 20:00 Ăn tối trong rừng thông · Amour Resort",
          "20:00 – 22:00 Thời gian tự do",
          "07:30 – 08:30 Ăn sáng · chuẩn bị",
          "08:30 – 11:30 Hiking rừng nhiệt đới · thác · VQG Ba Vì",
          "11:30 – 13:30 Di chuyển về Hà Nội · kết thúc hành trình",
        ],
      },
    ],

    // ── Extended ──
    priceUSD: 61,
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
      paragraphs: [
        "You're going to spend real time here — not the polite 20 minutes of a standard city tour, but the kind of morning where a place stops being a monument and starts being a story. Ba Đình Square at 07:30, before the tour buses arrive. The stilt house he chose over the Presidential Palace next door. The pagoda two minutes from his desk. Three places. One man's deliberate, unhurried life.",
        "Then the road out of Hanoi. Past the city edge, into Ba Vì — where the jungle starts and the city noise stops. K9 Đá Chông is where Hồ Chí Minh worked in secret during the American War — and where his body was preserved in the forest before being brought back to the Mausoleum. Not a famous site. Not on most itineraries. Exactly the kind of place where the real story lives.",
        "The Unlock challenge happens here, in the forest. No phones for directions. No guidebook answers. Your group reads the place the way he had to — by paying attention.",
        "The day ends at dusk inside Vườn Quốc Gia Ba Vì, at the temple the people built after his will.",
      ],
      closingLine: "",
    },
    valueAnchor: {
      "1day": {
        headline: "$52. Twelve hours in the places that shaped a nation.",
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
        headline: "$102. Two days — the mausoleum, the secret forest base, a night in Ba Vì.",
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
      { time: "16:05", label: "Đền Thờ Bác · Sunset",     elevation: 1296, icon: "temple",   highlight: true  },
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
      { q: "Tour bắt đầu từ đâu?",          a: "Điểm tập kết tại Phố Cổ Hà Nội lúc 07:30. Chúng tôi sẽ gửi địa chỉ chính xác sau khi xác nhận booking." },
      { q: "Có cần leo nhiều không?",        a: "Phần Đền Thờ Bác Hồ yêu cầu leo hơn 1.320 bậc thang. Không quá khắt khe về thể lực nhưng cần sức khỏe bình thường và giày phù hợp." },
      { q: "K9 Đá Chông có gì đặc biệt?",   a: "Đây là căn cứ bí mật thời kháng chiến chống Mỹ nơi Bác Hồ làm việc — và là nơi thi hài Người được gìn giữ trước khi đưa về Lăng ở Hà Nội. Địa điểm này không có trên hầu hết các tour thông thường." },
      { q: "Phiên bản 2 ngày 1 đêm có gì thêm?", a: "Thêm đêm nghỉ tại Amour Resort Ba Vì (rừng thông), bữa tối và sáng included, và buổi hiking rừng nhiệt đới trong VQG Ba Vì vào sáng ngày 2." },
      ...DEFAULT_FAQS.slice(0, 2),
    ],
    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
  },

  // ── Sa Pa · Lai Châu ──────────────────────────────────────────────────────
  {
    slug:        "lai-chau-motortour",
    name:        "Sa Pa · Lai Châu",
    region:      "north",
    duration:    ["2D1N"],
    price:       "from $185",
    tagline:     "Overnight sleeper bus, motorbike or car, ethnic minority villages, a tropical forest trek, and a glass bridge at sunset.",
    description: "Leave Hanoi at night. Wake up in the mist of Sa Pa. Spend two days riding through Vietnam's highest mountain pass into Lai Châu — a valley most travelers never find — then back through jungle trails and a glass bridge at 900m. Home by sunrise.",
    highlights: [
      "O Quy Hồ Pass — Vietnam's highest at 2,050m",
      "Tiên Sơn Cave · Bình Lư, Lai Châu",
      "Lao Chải Hmong village + traditional blacksmith forge",
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
    languages:   ["EN", "FR", "DE"],
    comingSoon:  false,
    image:       "/tours/lai-chau-motortour/17.webp",

    elevationMax: 2050,

    durationOptions: [
      {
        id:       "car",
        label:    "Car Tour",
        price:    185,
        tagline:  "Private car + driver. Sit back, watch the pass unfold through the window.",
        ctaLabel: "Book Car Tour →",
        ctaNote:  "No payment now. Spot held, pay 14 days before. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Lai Châu (Car Tour, $185/person)",
      },
      {
        id:       "motor",
        label:    "Motor Tour",
        price:    203,
        tagline:  "Self-ride or backseat on our semi-auto 125cc. The pass earns the view.",
        ctaLabel: "Book Motor Tour →",
        ctaNote:  "Valid motorbike licence required for self-ride. No payment now. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Sa Pa · Lai Châu (Motor Tour, $203/person)",
      },
    ],

    itinerary: [
      {
        day: 0,
        title: "Night — Hanoi → Sa Pa",
        slots: [
          "21:30 Tập kết tại Phố Cổ Hà Nội",
          "22:00 Lên xe sleeper bus đi Sa Pa",
          "05:30 Đến Sa Pa",
        ],
      },
      {
        day: 1,
        title: "Into the Northwest",
        slots: [
          "05:30 Ăn sáng phở gà Sơn Râu",
          "06:00 Nhận xe (motorbike: Mr Cò · car: xe riêng)",
          "06:30 Cafe nhìn ra thung lũng Mường Hoa",
          "07:30 Xuất phát — qua đèo O Quy Hồ 2,050m",
          "09:15 Tham quan Động Tiên Sơn · Bình Lư, Lai Châu",
          "10:15 Bản Lao Chải — Homestay Cứ A Lồng",
          "11:00 Khám phá bản với local guide",
          "12:00 Ăn trưa & nghỉ trưa",
          "13:30 Trải nghiệm lò rèn người H'Mông",
          "14:45 Di chuyển đến Thác Tác Tình",
          "16:15 Tắm thác",
          "17:45 Đón hoàng hôn tại Sì Thâu Chải",
          "18:00 Ăn tối · Homestay A Pao",
        ],
      },
      {
        day: 2,
        title: "Jungle, Glass & Home",
        slots: [
          "07:00 Khám phá bản Sì Thâu Chải — làng cổ tích người Dao",
          "08:00 Trekking rừng nhiệt đới + ăn trưa giữa rừng",
          "14:15 Di chuyển về Cầu Kính Rồng Mây",
          "15:30 Cầu Kính Rồng Mây + ngắm hoàng hôn",
          "18:30 Di chuyển về Sa Pa",
          "19:15 Ăn tối tại Sa Pa",
          "20:30 Tự do khám phá Sa Pa",
          "23:00 Xe sleeper bus về Hà Nội",
        ],
      },
    ],

    // ── Extended ──
    priceUSD: 185,
    tripInfo: {
      "car": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, Hanoi · 21:30" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast, lunch, dinner × 2 days" },
        { icon: "car",             label: "Transportation",    value: "Sleeper bus + private car" },
        { icon: "home",            label: "Accommodation",     value: "Homestay A Pao · Sì Thâu Chải" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full trip" },
        { icon: "mountain",        label: "Maximum altitude",  value: "2,050m · Đèo O Quy Hồ" },
        { icon: "map-2",           label: "Elevation gained",  value: "~450m (jungle trek, Day 2)" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
      ],
      "motor": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, Hanoi · 21:30" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Breakfast, lunch, dinner × 2 days" },
        { icon: "motorbike",       label: "Transportation",    value: "Sleeper bus + semi-auto 125cc Honda" },
        { icon: "home",            label: "Accommodation",     value: "Homestay A Pao · Sì Thâu Chải" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full trip" },
        { icon: "mountain",        label: "Maximum altitude",  value: "2,050m · Đèo O Quy Hồ" },
        { icon: "map-2",           label: "Elevation gained",  value: "~450m (jungle trek, Day 2)" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "license",         label: "Licence required",  value: "Valid motorcycle licence for self-ride" },
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
      paragraphs: [
        "Sa Pa gets crowded. Mù Cang Chải gets Instagrammed. Lai Châu doesn't. Not because it's less spectacular — because the only way in crosses O Quy Hồ, Vietnam's highest mountain pass at 2,050 metres, and coaches can't make that run. We can.",
        "Day 1 takes you over the pass, through a limestone cave, into a working Hmong village where the blacksmith still forges tools by hand, across a river gorge to a waterfall, and ends in a Dao village homestay that has never appeared on a hotel booking platform.",
        "Day 2 starts in that same village — exploring its century-old wooden houses — before a 6-hour jungle trek through tropical forest with lunch cooked and eaten on the trail. The afternoon lands you on a glass bridge at 900m above the Lai Châu valley as the light turns gold.",
        "Car or motorbike. The route is the same. The feeling is different. Choose accordingly.",
      ],
      closingLine: "Two days. One mountain pass. A valley most tourists will never find.",
    },
    valueAnchor: {
      headline: "From $119. For a route that exists outside the tourist circuit entirely.",
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
      { time: "22:00", label: "Depart Hanoi",            elevation: 20,   icon: "van",      highlight: false },
      { time: "05:30", label: "Arrive Sa Pa",             elevation: 1600, icon: "resort",   highlight: false },
      { time: "06:30", label: "Mường Hoa Valley Café",   elevation: 900,  icon: "food",     highlight: false },
      { time: "07:30", label: "O Quy Hồ Pass · 2,050m",  elevation: 2050, icon: "peak",     highlight: true  },
      { time: "09:15", label: "Tiên Sơn Cave · Bình Lư", elevation: 560,  icon: "cave",     highlight: true  },
      { time: "10:15", label: "Lao Chải Village",         elevation: 1380, icon: "village",  highlight: false },
      { time: "13:30", label: "Hmong Blacksmith Forge",   elevation: 1380, icon: "culture",  highlight: false },
      { time: "16:15", label: "Thác Tác Tình",            elevation: 620,  icon: "water",    highlight: true  },
      { time: "17:45", label: "Sì Thâu Chải · Sunset",   elevation: 800,  icon: "hike",     highlight: true  },
      { time: "07:00", label: "Dao Village · explore",    elevation: 800,  icon: "landmark", highlight: false },
      { time: "08:00", label: "Jungle Trek begins",       elevation: 800,  icon: "hike",     highlight: true  },
      { time: "14:15", label: "Trail ends · valley",      elevation: 420,  icon: "hike",     highlight: false },
      { time: "15:30", label: "Rồng Mây Glass Bridge",    elevation: 900,  icon: "landmark", highlight: true  },
      { time: "23:00", label: "Sleeper bus to Hanoi",     elevation: 1600, icon: "return",   highlight: false },
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
        title: "Tiên Sơn Cave · Bình Lư, Lai Châu",
        desc: "A limestone cave system in Tam Đường district, Lai Châu — stalactites, stalagmites, and an underground stream. On the Lai Châu side of the pass, off every standard Sapa tour.",
        highlight: false,
      },
      {
        badge: "culture", badgeLabel: "Village",
        time: "10:15 – 14:45",
        title: "Lao Chải Hmong Village + Blacksmith Forge",
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
      { q: "Car or motorbike — which should I choose?", a: "Car if you want to focus on scenery, villages, and people without managing a vehicle. Motorbike if you want to feel the altitude physically — the pass at 2,050m on two wheels is a different experience entirely. Same itinerary either way." },
      { q: "Do I need a motorbike licence?", a: "Yes for self-ride — a valid licence with motorcycle endorsement is required. If you want to ride pillion (backseat with our guide), no licence needed. Let us know when booking." },
      { q: "What type of bikes do you use?",  a: "Semi-automatic 125–150cc Hondas, well-maintained and suitable for mountain roads. The same bikes locals use on these roads every day." },
      { q: "How hard is the jungle trek on Day 2?", a: "Moderate. 6 hours on uneven forest trail with ~450m elevation gain. No technical sections — just long. Good footwear matters. If you can walk 3 hours comfortably, you can do this." },
      ...DEFAULT_FAQS.slice(2),
    ],
    unlockChallenge: DEFAULT_UNLOCK_CHALLENGE,
  },

  // ── Unlock Mai Châu ──────────────────────────────────────────────────────
  {
    slug:        "unlock-mai-chau",
    name:        "Unlock Mai Châu",
    region:      "north",
    tagline:     "The valley that rewards those who stay.",
    description: "Rice terraces, White Thai families, and challenges you won't find in any guidebook. One day minimum. Three days maximum. The valley decides.",
    duration:    ["1 Day", "2D1N", "3D2N"],
    price:       "From $85/person",
    priceUSD:    85,

    durationOptions: [
      {
        id:       "1day",
        label:    "1 Day",
        price:    85,
        tagline:  "Hanoi → Thung Khe → Mai Châu → back by 10:30 PM",
        ctaLabel: "I'm doing the 1-day →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Unlock Mai Châu (1 Day, $85)",
      },
      {
        id:       "2d1n",
        label:    "2 Days 1 Night",
        price:    145,
        tagline:  "Hanoi → Thung Khe → Mai Châu → overnight → back Day 2",
        ctaLabel: "I'm doing the 2-day →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Unlock Mai Châu (2 Days 1 Night, $145)",
      },
      {
        id:       "3d2n",
        label:    "3 Days 2 Nights",
        price:    225,
        tagline:  "Hanoi → Mai Châu → Pà Cò → Cao Phong → back Day 3",
        ctaLabel: "I'm doing the 3-day →",
        ctaNote:  "No payment now. We hold your spot, you pay 14 days before departure. Free cancellation up to 7 days out.",
        waText:   "Hi Morning Vietnam — I'd like to book Unlock Mai Châu (3 Days 2 Nights, $225)",
      },
    ],

    tripInfo: {
      "1day": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, 06:00" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full day" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "credit-card",     label: "Payment method",    value: "Cash" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "1,000m · Thung Khe Pass" },
      ],
      "2d1n": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, 06:00" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "home",            label: "Accommodation",     value: "Homestay Trường Huy" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full trip" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "credit-card",     label: "Payment method",    value: "Cash" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "1,200m · Chiều Cave area" },
      ],
      "3d2n": [
        { icon: "map-pin",         label: "Meeting point",     value: "Old Quarter, 06:00" },
        { icon: "tools-kitchen-2", label: "Meals",             value: "Included" },
        { icon: "bus",             label: "Transportation",    value: "Private van, round trip" },
        { icon: "home",            label: "Accommodation",     value: "Night 1: Homestay Trường Huy · Night 2: A La Homestay" },
        { icon: "user-check",      label: "Guide",             value: "Dedicated host, full trip" },
        { icon: "sun",             label: "Best season",       value: "Oct – Apr" },
        { icon: "calendar-check",  label: "Free cancellation", value: "Up to 7 days before" },
        { icon: "lock-open",       label: "Unlock Challenge",  value: "Included" },
        { icon: "credit-card",     label: "Payment method",    value: "Cash" },
        { icon: "tag",             label: "Admission fee",     value: "Included" },
        { icon: "mountain",        label: "Maximum altitude",  value: "1,200m · Pà Cò" },
      ],
    },

    hub:         "Hanoi",
    languages:   ["EN", "FR", "DE"],
    comingSoon:  false,
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
        headline: "$79. Work out what that covers.",
        paragraphs: [
          "Transport from Hanoi (return), lunch, dinner, all activity fees, cave entrance, dedicated host for 12 hours. The Unlock Challenge included.",
          "Most day tours to Mai Châu charge $40–50 for a bus seat, a buffet, and a photo stop. This is what the other $29–39 buys: actual access, small group, and a guide who knows the valley personally.",
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
        headline: "$140. Two days, everything included — do the math.",
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
        headline: "$205. Three days, two valleys, two cultures. The math is embarrassing.",
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
  },

  // ── Mai – Mộc in 1 Trip ──────────────────────────────────────────────────
  {
    slug:        "mai-moc-in-1-trip",
    name:        "Mai – Mộc in 1 Trip",
    region:      "north",
    duration:    ["3D2N"],
    price:       "",
    tagline:     "Two valleys, two ethnic groups, one trek most people never find.",
    description: "Mai Châu to Mộc Châu in three days. White Thai villages, a cave most tours don't climb to, natural hot springs, a night with a Hmong family at 1,200m, cloud hunting at dawn, and a forest trek connecting two villages that doesn't appear on any standard itinerary.",
    highlights: [
      "Trekking Phiêng Cành → Hang Táu (guide-only route)",
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
    image:      "/tours/mai-moc-in-1-trip/6.webp",

    durationOptions: [
      {
        id:       "3d2n",
        label:    "3 Days 2 Nights",
        price:    null,
        tagline:  "Hanoi → Mai Châu → Pà Cò → Hang Táu → back Day 3",
        ctaLabel: "Send My Inquiry →",
        ctaNote:  "Tell us your travel dates and group size — we'll get back to you within 24 hours.",
        waText:   "Hi Morning Vietnam — I'd like to inquire about Mai – Mộc in 1 Trip (3 Days 2 Nights)",
      },
    ],

    priceUSD: null,

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
        paragraphs: [
          "Most operators run Mai Châu as a loop: bus in, buffet lunch, one village, bus out. Some add a night. A few add cycling. Almost none go further than the valley floor — because going further requires knowing where to go.",
          "The trek from Phiêng Cành to Hang Táu isn't on any operator's menu. It's a 4-hour route through primary forest connecting two Hmong villages, with no trail markers and no way to navigate it without a guide who's walked it before. Luckily, we have the best ones.",
          "Day 1 is Mai Châu — White Thai villages, rice fields, the Unlock Challenge running at golden hour, and dinner with a family who cooks the kind of meal that makes you reconsider everything you thought you knew about homestay food in Vietnam.",
          "Day 2, the road climbs. Pà Cò at 1,200m is not a better version of Mai Châu — it's a completely different place. Different ethnic group. Different food. Different language. Different everything. Most people don't get here because it requires an extra night and a reason to go. The spectacular trek is the reason.",
          "Day 3 dawn: The valley below Hang Kia disappears into the clouds. You're standing above it.",
          "Then the forest. Then Hang Táu — the most beautiful and peaceful isolated primitive village. Then home.",
        ],
        closingLine: "Two valleys. One trip. Nothing like it on the market.",
      },
    },

    valueAnchor: {
      "3d2n": {
        headline: "$246. Three days, two homestays, a trek nobody else is running. Do the math.",
        paragraphs: [
          "Transport Hanoi return, all meals Day 1 lunch through Day 3 dinner, two nights accommodation (Homestay Trường Huy + A La Pà Cò), all activity and entrance fees, Unlock Challenge, dedicated host for 3 days. Nothing to decide or pay on arrival.",
          "The Phiêng Cành → Hang Táu trek alone isn't something you can book independently — it needs a local guide who knows the route, xe ôm coordination at Hang Táu, and timing built around the rest of the itinerary. That's what the host handles.",
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
      paragraphs: [
        "You'll row through Tràng An before 9 AM — before the day-trippers arrive — with a local oarswoman who steers with her feet and knows every cave by the sound it makes when the water rises. The karsts here are the same limestone formations as Hạ Long, but you're in a traditional wooden boat, in near-silence, not on a party cruise.",
        "Hoa Lư was Vietnam's first imperial capital. Most guided tours give it 40 minutes. We stay two hours, with a host who knows the dynastic detail and an Unlock challenge that turns the ancient stone inscriptions into a problem your group has to solve before sundown.",
        "Day two begins at 5:30 AM — optional, but almost everyone comes. 500 steps up Mua Cave to watch the sun spill across the valley below. Then Bích Động pagoda, carved directly into the limestone. Then a village walk that has no script, because the best part of it is always something we didn't plan.",
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
      paragraphs: [
        "The cruise ships anchor offshore. The day-trippers stay on the beach strip. We go into Cát Bà National Park — 17,000 hectares of jungle that rises to 177 metres and contains some of the world's rarest primates. The trail your group walks that afternoon is not on any tour operator's standard route.",
        "The fishing village in the late afternoon is not staged. The families there live by what they pull from the water every morning. Our host grew up on that water. You'll eat dinner at a table where the catch was still swimming two hours earlier, with people who have no reason to perform anything for you.",
        "Day two is kayaking — but not in a line behind a guide. We find the quiet lagoons. The hidden beaches the crowd can't reach without 20 minutes of paddling. The Unlock challenge runs from water level — a navigation puzzle that ends at the best viewpoint on the island.",
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
];

export function getTourBySlug(slug: string) {
  return tours.find((t) => t.slug === slug);
}
