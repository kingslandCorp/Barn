// Central content file for The Family Barn (@ Kingsland) website.
// Edit copy here rather than inside components/pages where possible.

export const siteConfig = {
  name: 'The Family Barn',
  fullName: '@ Kingsland',
  region: 'Vale of Glamorgan, Wales',
  email: 'Hello@Kingsland.co.uk',
  tagline:
    'A place to slow down, breathe deeply and enjoy the beauty of the Welsh countryside.',
  metaDescription:
    'The Family Barn (@ Kingsland) is a luxury countryside holiday let in the Vale of Glamorgan, Wales — a heated pool, a wood burner, and the Heritage Coast on your doorstep.',
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Directions', href: '/directions' },
  { label: 'Explore the Area', href: '/explore' },
  { label: 'Events', href: '/events' },
  { label: 'Before You Leave', href: '/before-you-leave' },
];

export type Tone = 'coast' | 'sage' | 'gold' | 'stone' | 'sand';

export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  label: string;
  caption: string;
  span?: boolean; // take a wider tile in the masonry grid
};

export const sitePhotos = {
  hero: {
    src: '/images/Herobarn.avif',
    width: 1200,
    height: 900,
    alt: 'The Family Barn at Kingsland, Vale of Glamorgan',
  },
  warmWelcome: {
    src: '/images/welcome-prosecco-view.jpg',
    width: 1071,
    height: 1428,
    alt: 'A glass of prosecco on the kitchen counter, with the Vale of Glamorgan countryside through the open door',
    label: 'Evening, from the kitchen counter',
  },
  discoverTheVale: {
    src: '/images/view-golden-hour.jpg',
    width: 1280,
    height: 834,
    alt: 'Golden hour sunlight over the fields surrounding The Barn',
    label: 'Golden hour over the Vale',
  },
  directionsTrack: {
    src: '/images/Mainentrance.avif',
    width: 1200,
    height: 900,
    alt: 'The main entrance and private track leading to The Barn',
  },
  directionsAfterDark: {
    src: '/images/nightview.jpg',
    width: 1428,
    height: 1071,
    alt: 'The Barn lit up after dark, with the kitchen visible through the open door',
  },
  poolSafety: {
    src: '/images/Poolmain.avif',
    width: 1200,
    height: 900,
    alt: 'The heated outdoor pool at The Barn',
  },
};

export const poolPhotos = {
  main: {
    src: '/images/Poolmain.avif',
    width: 1200,
    height: 900,
    alt: 'The heated outdoor pool at The Barn',
  },
  minor: [
    { src: '/images/Pool1.avif', width: 1200, height: 1017, alt: 'The outdoor pool, second view' },
    { src: '/images/Pool3.avif', width: 1200, height: 900, alt: 'The outdoor pool, third view' },
  ],
};

export const viewPhotos: GalleryPhoto[] = [
  {
    src: '/images/views.avif',
    width: 1200,
    height: 853,
    label: 'The view',
    caption: 'Rolling countryside, right from the garden',
    span: true,
  },
  {
    src: '/images/patio1.avif',
    width: 720,
    height: 540,
    label: 'The patio',
    caption: 'Morning coffee with a view',
  },
  {
    src: '/images/gallery-sunset.jpg',
    width: 1428,
    height: 1071,
    label: 'Sunset over the Vale',
    caption: 'The best hour of the day, every day',
  },
  {
    src: '/images/gallery-fields.jpg',
    width: 1280,
    height: 960,
    label: 'The fields',
    caption: 'Fields and hedgerows, right from the garden',
  },
];

export const galleryItems: GalleryPhoto[] = [
  {
    src: '/images/lounge.jpg',
    width: 1428,
    height: 1071,
    label: 'The living room',
    caption: 'Deep sofas, stone walls, slow evenings',
    span: true,
  },
  {
    src: '/images/downstairs.jpg',
    width: 1428,
    height: 1071,
    label: 'Kitchen & living',
    caption: 'Open-plan, and built for cooking together',
    span: true,
  },
  {
    src: '/images/kitchen.avif',
    width: 1200,
    height: 900,
    label: 'The kitchen',
    caption: 'Morning coffee, evening wine — good times all day',
  },
  {
    src: '/images/mainbedroom.avif',
    width: 1200,
    height: 900,
    label: 'Main bedroom',
    caption: 'Quiet, restful, dressed in soft linen',
  },
  {
    src: '/images/bedroom2.avif',
    width: 1200,
    height: 900,
    label: 'Second bedroom',
    caption: 'Just as peaceful, just as comfortable',
  },
  {
    src: '/images/mainbathroom.avif',
    width: 1200,
    height: 900,
    label: 'Main bathroom',
    caption: 'Bright, clean, beautifully finished',
  },
  {
    src: '/images/mainbathroom2.avif',
    width: 1200,
    height: 1600,
    label: 'Bathroom detail',
    caption: 'The little touches that make it feel like home',
  },
  {
    src: '/images/downstairsshower.avif',
    width: 1200,
    height: 1600,
    label: 'Downstairs shower room',
    caption: 'Handy for muddy boots and pool towels alike',
  },
  {
    src: '/images/Hallway.jpg',
    width: 1071,
    height: 1428,
    label: 'The staircase',
    caption: 'Light pours in from the skylight above',
  },
  {
    src: '/images/office.avif',
    width: 1200,
    height: 900,
    label: 'A quiet corner to work',
    caption: 'If you must — Wi-Fi included',
  },
  {
    src: '/images/bathsoap.avif',
    width: 1200,
    height: 900,
    label: 'A little luxury',
    caption: 'Small details, taken care of',
  },
];

export const stayHighlights: {
  icon: string;
  title: string;
  description: string;
}[] = [
  {
    icon: 'Waves',
    title: 'Heated outdoor pool',
    description: 'Warm water waiting for you, whatever the Welsh weather decides to do.',
  },
  {
    icon: 'Flame',
    title: 'Wood burner',
    description: 'Curl up beside the fire once the sun dips and the evening cools.',
  },
  {
    icon: 'PawPrint',
    title: 'Dog friendly',
    description: 'Bring the whole family along — four legs are always welcome here.',
  },
  {
    icon: 'Wifi',
    title: 'Wi-Fi',
    description: 'Stay connected if you need to, or switch off entirely. Your call.',
  },
  {
    icon: 'Trees',
    title: 'Countryside walks',
    description: 'Rolling fields, quiet lanes and hedgerows, right from the front door.',
  },
  {
    icon: 'Umbrella',
    title: 'Coastal beaches nearby',
    description: "Wales' dramatic Heritage Coast is just a short drive away.",
  },
];

export const arrivalSteps: { step: number; title: string; description: string }[] = [
  {
    step: 1,
    title: 'Through the main gate',
    description: 'Drive through the gate and onto the main drive.',
  },
  {
    step: 2,
    title: 'Follow the track left',
    description: 'Turn left and follow the track in front of the barns.',
  },
  {
    step: 3,
    title: 'Park up on the gravel',
    description:
      'Park between field and the barns — there is plenty of space, no need to be precious about it.',
  },
  {
    step: 4,
    title: 'Face towards the barn or field',
    description: "Turn your car to face the barn, so we don't have any runaways.",
  },
];

export const what3words = {
  words: '///resurgent.nature.known',
  url: 'https://what3words.com/resurgent.nature.known',
};

export const mapEmbedSrc =
  'https://www.google.com/maps?q=51.435480,-3.409444&z=13&output=embed';

export const parkingInfo = {
  title: 'Parking',
  description:
    "There's informal parking for several cars between the field and the barns. No permits, no restrictions",
};

export const afterDarkInfo = {
  title: 'Arriving after dark',
  description:
    "The track has no street lighting, so take it slowly — your headlights and the barn's outside lights will guide you in. If you're unsure, call ahead and we'll talk you through it.",
};

export type AreaPlace = {
  name: string;
  description: string;
  tags: string[];
  tone: Tone;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
};

export type AreaCategory = {
  id: string;
  title: string;
  intro: string;
  closingNote?: string;
  places: AreaPlace[];
};

export const exploreCategories: AreaCategory[] = [
  {
    id: 'coast-beaches',
    title: 'Coast & Beaches',
    intro:
      "The Heritage Coast is the Vale of Glamorgan's finest asset — dramatic, unspoilt, and never far away.",
    places: [
      {
        name: 'Southerndown Beach',
        description:
          'Dramatic limestone cliffs and a wide stretch of sand, best explored at low tide. One of the most photographed beaches in South Wales, and a favourite summer escape.',
        tags: ['Dramatic cliffs', 'Excellent for walks', 'Popular in summer'],
        tone: 'coast',
        image: {
          src: '/images/southerndown.jpg',
          width: 549,
          height: 364,
          alt: 'Layered limestone cliffs along the Heritage Coast near Southerndown',
        },
      },
      {
        name: 'Nash Point',
        description:
          'Twin lighthouses standing above the cliffs, with coastal paths in both directions. Time it right and the sunsets here are unforgettable.',
        tags: ['Lighthouse', 'Coastal walks', 'Sunset views'],
        tone: 'gold',
        image: {
          src: '/images/Nashpoint.jpg',
          width: 1024,
          height: 640,
          alt: 'Nash Point lighthouse at sunset, Vale of Glamorgan',
        },
      },
      {
        name: 'Barry Island',
        description:
          "O...Whats Occurring! Sandcastles, fish and chips, and unmistakably Welsh charm — Barry Island is a family fave and home of the legendary Gavin & Stacey.",
        tags: ['Sandcastles', 'Fish and chips', 'Gavin & Stacey', 'fairground'],
        tone: 'sand',
        image: {
          src: '/images/Barryisland.jpg',
          width: 554,
          height: 554,
          alt: 'Barry Island beach and promenade on a sunny day',
        },
      },
    ],
  },
  {
    id: 'food-drink',
    title: 'Food & Drink',
    intro: 'From village pubs to independent cafés, the Vale does not go hungry.',
    closingNote:
      'Great beer, welcoming pubs and hidden gems await throughout the Vale — far too many to fit into one list. Get exploring!',
    places: [
      {
        name: 'Thomas',
        description:
          'Our top recommendation for a proper night out — thoughtful, elegant fine dining worth booking well ahead for.',
        tags: ['Fine dining', 'Date night', 'Book ahead'],
        tone: 'gold',
        image: {
          src: '/images/Thomas.jpg',
          width: 400,
          height: 400,
          alt: 'The exterior of Thomas restaurant',
        },
      },
      {
        name: 'BaffleHaus',
        description:
          "Great beer, proper burgers, and a must-visit if you're a petrolhead — expect classic cars parked right outside.",
        tags: ['Craft beer', 'Burgers', 'Petrolhead favourite'],
        tone: 'stone',
        image: {
          src: '/images/bAFFLE.jpg',
          width: 547,
          height: 365,
          alt: 'BaffleHaus pub with a classic sports car parked outside',
        },
      },
      {
        name: 'Thai Elephant',
        description:
          'Genuinely great Thai food and takeaway — no elephants involved, just proper flavour.',
        tags: ['Thai food', 'Takeaway', 'Local favourite'],
        tone: 'sage',
        image: {
          src: '/images/tHAI.jpg',
          width: 335,
          height: 597,
          alt: 'The Thai Elephant restaurant frontage',
        },
      },
    ],
  },
  {
    id: 'towns-villages',
    title: 'City and Towns',
    intro: 'Market towns, coastal villages, and the capital itself — all within easy reach.',
    places: [
      {
        name: 'Cowbridge',
        description:
          'A proper Vale institution — independent boutiques, good coffee, and a market square that rewards a slow, unhurried wander.',
        tags: ['Boutiques', 'Coffee', 'Market square'],
        tone: 'gold',
        image: {
          src: '/images/Cowbridge.jpg',
          width: 723,
          height: 423,
          alt: 'Cowbridge high street lined with independent shops',
        },
      },
      {
        name: 'Llantwit Major',
        description:
          'One of the oldest settlements in Wales — a historic town centre paired with a Blue Flag beach just down the road.',
        tags: ['Beach', 'History', 'Coastal walks'],
        tone: 'coast',
        image: {
          src: '/images/Llantwit.jpg',
          width: 1200,
          height: 600,
          alt: 'The Old White Hart pub in the historic centre of Llantwit Major',
        },
      },
      {
        name: 'Cardiff',
        description:
          "Wales' compact, walkable capital — castle, waterfront, shopping arcades and a buzz that's easy to dip into for the day.",
        tags: ['Capital city', 'Castle', 'Waterfront'],
        tone: 'sage',
        image: {
          src: '/images/Cardiff.jpg',
          width: 597,
          height: 335,
          alt: 'Cardiff Bay waterfront with the Pierhead Building and the Wales Millennium Wheel',
        },
      },
    ],
  },
];

export type DayOutSpot = {
  name: string;
  description: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
};

export const dayTrips: DayOutSpot[] = [
  {
    name: 'Cardiff Castle Events',
    description:
      "From summer festivals to major touring concerts, the castle grounds come alive after dark — check what's on before you visit.",
    image: {
      src: '/images/Castle.jpg',
      width: 547,
      height: 365,
      alt: 'A concert crowd at Cardiff Castle at dusk',
    },
  },
  {
    name: 'Cardiff International White Water',
    description:
      'White-water rafting and indoor surfing on a man-made rapids course — thrilling for adrenaline seekers of any age.',
    image: {
      src: '/images/CIWW.jpg',
      width: 678,
      height: 452,
      alt: 'Kayakers on the rapids course at Cardiff International White Water',
    },
  },
  {
    name: 'Cardiff Devils',
    description:
      "Ice skating for the family, or catch the Devils live — Cardiff's ice hockey team play a fast, physical, surprisingly loud match.",
    image: {
      src: '/images/Devils.jpg',
      width: 534,
      height: 374,
      alt: 'Cardiff Devils ice hockey players in action',
    },
  },
  {
    name: 'Techniquest',
    description:
      "Cardiff's hands-on science centre — genuinely brilliant for kids, with enough to fill a whole rainy afternoon.",
    image: {
      src: '/images/techniquest.jpg',
      width: 738,
      height: 414,
      alt: 'Interactive science exhibits at Techniquest, Cardiff',
    },
  },
  {
    name: 'Dyffryn Gardens',
    description:
      'Grand Edwardian gardens with room to roam, a lovely stop for a slower family day.',
  },
];

export type CardiffEventCategory =
  | 'Rugby & Internationals'
  | 'Cardiff Castle'
  | 'Big Events & Concerts'
  | 'Festivals';

export type CardiffEvent = {
  name: string;
  category: CardiffEventCategory;
  date: string;
  venue: string;
  description: string;
  url: string;
};

// Real events, checked at time of writing — dates for recurring annual events
// can shift, so it's worth a periodic re-check against each official site.
export const cardiffEvents: CardiffEvent[] = [
  {
    name: 'Wales v Ireland',
    category: 'Rugby & Internationals',
    date: 'Saturday 20 February 2027',
    venue: 'Principality Stadium',
    description: 'Six Nations Championship — Wales host Ireland in Cardiff.',
    url: 'https://www.principalitystadium.wales/events-and-ticket-information/',
  },
  {
    name: 'Wales v England',
    category: 'Rugby & Internationals',
    date: 'Saturday 6 March 2027',
    venue: 'Principality Stadium',
    description: 'Six Nations Championship — the Anglo-Welsh clash returns to Cardiff.',
    url: 'https://www.principalitystadium.wales/events-and-ticket-information/',
  },
  {
    name: 'FA Community Shield',
    category: 'Big Events & Concerts',
    date: 'Sunday 16 August 2026',
    venue: 'Principality Stadium',
    description: "Arsenal v Manchester City — English football's traditional season curtain-raiser.",
    url: 'https://www.principalitystadium.wales/events-and-ticket-information/',
  },
  {
    name: "What's On at Cardiff Castle",
    category: 'Cardiff Castle',
    date: 'Ongoing — check current listings',
    venue: 'Cardiff Castle',
    description:
      'A rolling programme of summer concerts, family events and outdoor cinema in the castle grounds throughout the year.',
    url: 'https://www.cardiffcastle.com/events/',
  },
  {
    name: 'Cardiff Half Marathon',
    category: 'Festivals',
    date: 'Sunday 4 October 2026',
    venue: 'Starts at Cardiff Castle',
    description:
      "Wales' largest mass-participation event — a flat, fast route past the city's best-known landmarks.",
    url: 'https://www.cardiffhalfmarathon.co.uk/',
  },
  {
    name: 'Cardiff Winter Wonderland',
    category: 'Festivals',
    date: 'Expected mid-November 2026 – early January 2027',
    venue: 'Cardiff Bay & Cardiff Castle grounds',
    description:
      'An undercover ice rink, big wheel, funfair and festive market — a Cardiff Christmas tradition. Exact 2026/27 dates confirmed closer to the time.',
    url: 'https://cardiffbay.co.uk/listings/cardiff-winter-wonderland/',
  },
];

export const houseRules: { icon: string; title: string; description: string }[] = [
  {
    icon: 'CigaretteOff',
    title: 'No smoking indoors',
    description: 'Please smoke outside only, away from open doors and windows.',
  },
  {
    icon: 'PartyPopper',
    title: 'No parties or events',
    description: 'The Barn is a peaceful retreat for registered guests, not a venue.',
  },
  {
    icon: 'UserCheck',
    title: 'Registered guests only',
    description: 'Please let us know in advance if anyone will be joining you.',
  },
  {
    icon: 'Moon',
    title: 'Quiet hours after 10pm',
    description: 'Sound travels in the countryside — thank you for keeping things gentle in the evening.',
  },
  {
    icon: 'PawPrint',
    title: 'Dogs welcome',
    description: 'Well-behaved dogs are very welcome. Please clean up after them.',
  },
  {
    icon: 'Home',
    title: 'Respect neighbouring properties',
    description: 'Our neighbours live here year-round — please be considerate of noise and privacy.',
  },
  {
    icon: 'AlertTriangle',
    title: 'Report any damage',
    description: "Accidents happen — just let us know as soon as possible so we can sort it.",
  },
];

export const poolRules: { icon: string; title: string; description: string }[] = [
  {
    icon: 'ShieldAlert',
    title: 'No lifeguard on duty',
    description: 'The pool is unsupervised. All guests swim entirely at their own risk.',
  },
  {
    icon: 'Users',
    title: 'Supervise children at all times',
    description: 'Children must be closely supervised by an adult whenever they are near the pool.',
  },
  {
    icon: 'ArrowDownToLine',
    title: 'No diving',
    description: 'The pool is not designed for diving or jumping in. Please enter carefully.',
  },
  {
    icon: 'UserX',
    title: 'Never swim alone',
    description: 'Always have someone else with you when using the pool, even during the day.',
  },
  {
    icon: 'Wine',
    title: 'No glass around the pool',
    description: 'Please use the provided plastic or reusable cups in the pool area.',
  },
  {
    icon: 'PhoneCall',
    title: 'Emergency procedures',
    description:
      'In a genuine emergency, call 999 immediately. For anything else pool-related, contact us at Hello@Kingsland.co.uk.',
  },
];

export const departureChecklist: { icon: string; title: string; description: string }[] = [
  { icon: 'Utensils', title: 'Dishwasher', description: 'Please empty it and leave it switched off.' },
  { icon: 'Lightbulb', title: 'Lights', description: 'Turn off all lights around the property.' },
  { icon: 'DoorClosed', title: 'Doors', description: 'Lock all external doors on your way out.' },
  { icon: 'AppWindow', title: 'Windows', description: 'Close and secure every window.' },
  { icon: 'Waves', title: 'Pool cover', description: 'Please replace the pool cover if you were the last to swim.' },
  { icon: 'Shirt', title: 'Towels', description: 'Leave used towels in the bathroom, not packed in your bags.' },
  { icon: 'Recycle', title: 'Recycling', description: 'Sort recycling into the bins provided outside.' },
  { icon: 'KeyRound', title: 'Keys', description: 'Return the keys to the lockbox before you leave.' },
];
