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
  { label: 'Location', href: '/directions' },
  { label: 'Explore the Area', href: '/explore' },
  { label: 'Events', href: '/events' },
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
  image?: { src: string; width: number; height: number; alt: string };
  useArt?: boolean; // show original illustrated artwork instead of a photo or icon
}[] = [
  {
    icon: 'Waves',
    title: 'Heated outdoor pool',
    description: 'Warm water waiting for you, whatever the Welsh weather decides to do.',
    image: {
      src: '/images/Poolmain.avif',
      width: 1200,
      height: 900,
      alt: 'The heated outdoor pool at The Barn',
    },
  },
  {
    icon: 'Flame',
    title: 'Wood burner',
    description: 'Curl up beside the fire once the sun dips and the evening cools.',
    image: {
      src: '/images/fireplace.jpg',
      width: 1071,
      height: 1428,
      alt: 'The wood burner, lit, with a basket of logs beside it',
    },
  },
  {
    icon: 'Trees',
    title: 'Woodland walks',
    description: 'A leaf-strewn path through the woodland right around The Barn.',
    image: {
      src: '/images/walk.jpg',
      width: 615,
      height: 410,
      alt: 'A woodland walking path near The Family Barn at Kingsland',
    },
  },
  {
    icon: 'Wifi',
    title: 'Wi-Fi',
    description: 'Stay connected if you need to, or switch off entirely. Your call.',
  },
  {
    icon: 'Trees',
    title: 'Countryside views',
    description: 'Rolling fields, quiet lanes and hedgerows, right from the front door.',
  },
  {
    icon: 'PawPrint',
    title: 'Dog friendly',
    description: 'Bring the whole family along — four legs are always welcome here.',
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
  url?: string;
};

export const dayTrips: DayOutSpot[] = [
  {
    name: 'Cefn Mably Farm Park',
    description:
      'A big hit with younger ones — friendly farm animals, an indoor fun house, and plenty of space to run around whatever the weather.',
    image: {
      src: '/images/Cefn.jpg',
      width: 307,
      height: 163,
      alt: 'Cefn Mably Farm Park, aerial view',
    },
    url: 'https://www.cefnmablyfarmpark.com/',
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
    url: 'https://www.ciww.com/',
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
    url: 'https://www.cardiffdevils.com/',
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
    url: 'https://www.techniquest.org/',
  },
  {
    name: 'Riding on the Beach, Ogmore',
    description:
      'Trek by horseback along the River Ewenny and out onto the open sand at Ogmore — suitable for beginners and experienced riders alike.',
    image: {
      src: '/images/horse.jpg',
      width: 540,
      height: 370,
      alt: 'Riders on horseback along Ogmore beach',
    },
    url: 'https://www.rideonthebeach.co.uk/',
  },
  {
    name: 'Surf Lessons, Porthcawl',
    description:
      'Beginner-friendly surf lessons at Rest Bay — boards, wetsuits and qualified instructors all included.',
    image: {
      src: '/images/surf.jpg',
      width: 638,
      height: 480,
      alt: 'A surfer riding a wave at Porthcawl',
    },
    url: 'https://www.porthcawlsurf.co.uk/',
  },
  {
    name: 'Mountain Biking, BikePark Wales',
    description:
      "The UK's biggest mountain bike park — graded trails for every level, plus a minibus uplift so it's downhill all the way back.",
    image: {
      src: '/images/bike.jpg',
      width: 547,
      height: 365,
      alt: 'A mountain biker riding a forest trail at BikePark Wales',
    },
    url: 'https://www.bikeparkwales.com',
  },
  {
    name: 'Hiking Pen y Fan',
    description:
      "The highest peak in South Wales — a rewarding, well-marked summit walk with some of the best views the Beacons have to offer.",
    image: {
      src: '/images/hike.jpg',
      width: 518,
      height: 386,
      alt: 'Hikers on the summit path to Pen y Fan',
    },
    url: 'https://bannaubrycheiniog.org/',
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
  sortDate: string; // ISO format YYYY-MM-DD, used only for ordering this list
  venue: string;
  description: string;
  url: string;
  image?: {
    src: string;
    width: number;
    height: number;
    alt: string;
  };
  placeholderImage?: string;
};

// Real events, checked at time of writing — dates for recurring annual events
// can shift, so it's worth a periodic re-check against each official site.
// Kept in chronological order by sortDate.
export const cardiffEvents: CardiffEvent[] = [
  {
    name: 'FA Community Shield',
    category: 'Big Events & Concerts',
    date: 'Sunday 16 August 2026',
    sortDate: '2026-08-16',
    venue: 'Principality Stadium',
    description: "Arsenal v Manchester City — English football's traditional season curtain-raiser.",
    url: 'https://www.principalitystadium.wales/events-and-ticket-information/',
    image: {
      src: '/images/jamhead1.jpg',
      width: 600,
      height: 450,
      alt: 'FA Community Shield at Principality Stadium',
    },
  },
  {
    name: 'Cardiff Half Marathon',
    category: 'Festivals',
    date: 'Sunday 4 October 2026',
    sortDate: '2026-10-04',
    venue: 'Starts at Cardiff Castle',
    description:
      "Wales' largest mass-participation event — a flat, fast route past the city's best-known landmarks.",
    url: 'https://www.cardiffhalfmarathon.co.uk/',
    image: {
      src: '/images/Cardiff.jpg',
      width: 597,
      height: 335,
      alt: 'Cardiff Bay waterfront, part of the Half Marathon route',
    },
  },
  {
    name: 'Wales v Japan',
    category: 'Rugby & Internationals',
    date: 'Saturday 7 November 2026',
    sortDate: '2026-11-07',
    venue: 'Principality Stadium',
    description: 'Nations Championship — the first of three home autumn fixtures for Wales.',
    url: 'https://www.principalitystadium.wales/events-and-ticket-information/',
    image: {
      src: '/images/jamhead2.jpg',
      width: 600,
      height: 450,
      alt: 'Wales v Japan, Nations Championship',
    },
  },
  {
    name: 'Wales v New Zealand',
    category: 'Rugby & Internationals',
    date: 'Saturday 14 November 2026',
    sortDate: '2026-11-14',
    venue: 'Principality Stadium',
    description: 'Nations Championship — Wales take on the All Blacks in Cardiff.',
    url: 'https://www.principalitystadium.wales/events-and-ticket-information/',
    image: {
      src: '/images/jamhead3.jpg',
      width: 600,
      height: 450,
      alt: 'Wales v New Zealand, Nations Championship',
    },
  },
  {
    name: 'Cardiff Winter Wonderland',
    category: 'Festivals',
    date: 'Expected mid-November 2026 – early January 2027',
    sortDate: '2026-11-15',
    venue: 'Cardiff Bay & Cardiff Castle grounds',
    description:
      'An undercover ice rink, big wheel, funfair and festive market — a Cardiff Christmas tradition. Exact 2026/27 dates confirmed closer to the time.',
    url: 'https://cardiffbay.co.uk/listings/cardiff-winter-wonderland/',
    image: {
      src: '/images/Winter.jpg',
      width: 600,
      height: 450,
      alt: 'Cardiff Winter Wonderland ice rink and festive lights',
    },
  },
  {
    name: 'Wales v Australia',
    category: 'Rugby & Internationals',
    date: 'Saturday 21 November 2026',
    sortDate: '2026-11-21',
    venue: 'Principality Stadium',
    description: "Nations Championship — Wales close out their home autumn series against the Wallabies.",
    url: 'https://www.principalitystadium.wales/events-and-ticket-information/',
    image: {
      src: '/images/jamhead4.jpg',
      width: 600,
      height: 450,
      alt: 'Wales v Australia, Nations Championship',
    },
  },
  {
    name: 'UB40 feat. Ali Campbell',
    category: 'Big Events & Concerts',
    date: 'Wednesday 9 December 2026',
    sortDate: '2026-12-09',
    venue: 'Utilita Arena Cardiff',
    description: 'The reggae legends bring their biggest hits to the arena stage.',
    url: 'https://www.utilitaarenacardiff.co.uk/',
    image: {
      src: '/images/jamhead5.jpg',
      width: 600,
      height: 450,
      alt: 'UB40 feat. Ali Campbell at Utilita Arena Cardiff',
    },
  },
  {
    name: 'Morrissey',
    category: 'Big Events & Concerts',
    date: 'Thursday 10 December 2026',
    sortDate: '2026-12-10',
    venue: 'Utilita Arena Cardiff',
    description: 'The former Smiths frontman brings his solo tour to Cardiff.',
    url: 'https://www.utilitaarenacardiff.co.uk/',
    image: {
      src: '/images/jamhead6.jpg',
      width: 600,
      height: 450,
      alt: 'Morrissey at Utilita Arena Cardiff',
    },
  },
  {
    name: 'Wales v Ireland',
    category: 'Rugby & Internationals',
    date: 'Saturday 20 February 2027',
    sortDate: '2027-02-20',
    venue: 'Principality Stadium',
    description: 'Six Nations Championship — Wales host Ireland in Cardiff.',
    url: 'https://www.principalitystadium.wales/events-and-ticket-information/',
    image: {
      src: '/images/jamhead7.jpg',
      width: 600,
      height: 450,
      alt: 'Wales v Ireland, Six Nations Championship',
    },
  },
  {
    name: 'Wales v England',
    category: 'Rugby & Internationals',
    date: 'Saturday 6 March 2027',
    sortDate: '2027-03-06',
    venue: 'Principality Stadium',
    description: 'Six Nations Championship — the Anglo-Welsh clash returns to Cardiff.',
    url: 'https://www.principalitystadium.wales/events-and-ticket-information/',
    image: {
      src: '/images/jamhead8.jpg',
      width: 600,
      height: 450,
      alt: 'Wales v England, Six Nations Championship',
    },
  },
  {
    name: 'Gabrielle',
    category: 'Big Events & Concerts',
    date: 'Saturday 17 April 2027',
    sortDate: '2027-04-17',
    venue: 'Utilita Arena Cardiff',
    description: "The Brit Award-winning singer performs her classic hits live.",
    url: 'https://www.utilitaarenacardiff.co.uk/',
    image: {
      src: '/images/jamhead9.jpg',
      width: 600,
      height: 450,
      alt: 'Gabrielle at Utilita Arena Cardiff',
    },
  },
  {
    name: "What's On at Cardiff Castle",
    category: 'Cardiff Castle',
    date: 'Ongoing — check current listings',
    sortDate: '9999-12-31',
    venue: 'Cardiff Castle',
    description:
      'A rolling programme of summer concerts, family events and outdoor cinema in the castle grounds throughout the year.',
    url: 'https://www.cardiffcastle.com/events/',
    image: {
      src: '/images/Castle.jpg',
      width: 547,
      height: 365,
      alt: 'A concert crowd at Cardiff Castle at dusk',
    },
  },
];

export const houseRules: { icon: string; title: string; description: string }[] = [
  {
    icon: 'Wifi',
    title: 'Wi-Fi',
    description: 'Network: Kingslandbarn — Password: K!ngl@nd26',
  },
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
    title: 'Only booked guests in the house',
    description: 'Please let us know in advance if anyone else will be joining you or staying over.',
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
    icon: 'PawPrint',
    title: 'No dogs upstairs',
    description: 'Dogs are very welcome downstairs, but please keep them out of the bedrooms.',
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
  {
    icon: 'Clock',
    title: 'Check-in from 4pm, check-out by 10am',
    description: "This gives us time to get the Barn ready and looking its best for the next guests.",
  },
  {
    icon: 'Footprints',
    title: 'Shoes off, please',
    description: 'Boots and wellies at the door — we just ask that muddy footwear stays outside.',
  },
  {
    icon: 'Heart',
    title: 'Treat the Barn like home',
    description: "We've furnished it with care — please treat it the same way you'd treat your own place.",
  },
];

export const poolRules: { icon: string; title: string; description: string }[] = [
  {
    icon: 'Users',
    title: 'Maximum occupancy: 6 people',
    description: "It's a 14' x 28' pool — please keep numbers in the water at any one time to 6 or fewer, so it stays comfortable and safe.",
  },
  {
    icon: 'ArrowDownToLine',
    title: 'No diving anywhere in the pool',
    description:
      "The pool is 6'6\" at its deepest point — plenty for swimming, but not necessarily safe for diving depending on entry point and approach.",
  },
  {
    icon: 'AlertTriangle',
    title: 'No jumping into the deep end',
    description: 'Please enter the water carefully rather than jumping in, especially at the deep end.',
  },
  {
    icon: 'UserCheck',
    title: 'Children must be supervised by an adult at all times',
    description: 'Please keep a close eye on children whenever they are in or around the pool.',
  },
  {
    icon: 'Waves',
    title: 'Non-swimmers: stay in the shallow end',
    description: 'The shallow end is nearest the house — non-swimmers should stay there unless accompanied by a confident swimmer.',
  },
  {
    icon: 'UserX',
    title: 'No swimming alone',
    description: 'Always have someone else with you when using the pool, even during the day.',
  },
  {
    icon: 'Wine',
    title: 'No alcohol or glass poolside',
    description: 'Please save the drinks (and any glassware) for after your swim — plastic or reusable cups only in the pool area.',
  },
  {
    icon: 'Footprints',
    title: 'No running or rough play',
    description: 'Wet tiles can be slippery — please keep things calm in and around the pool.',
  },
  {
    icon: 'Droplets',
    title: 'Shower before entering',
    description: 'A quick rinse before you get in keeps the water clean and clear for everyone.',
  },
  {
    icon: 'Clock',
    title: 'Pool closed outside advertised hours',
    description: "Please stick to the pool's advertised opening hours — let us know if these aren't clear.",
  },
  {
    icon: 'CloudLightning',
    title: 'Closed during thunderstorms or unsafe weather',
    description: 'Please stay out of the pool during storms, high winds, or any other unsafe conditions.',
  },
  {
    icon: 'ShieldAlert',
    title: 'No lifeguard on duty',
    description: 'The pool is unsupervised — all guests swim entirely at their own risk. In a genuine emergency, call 999 immediately.',
  },
];

export const localSupermarkets: {
  name: string;
  mapQuery: string;
  image?: { src: string; width: number; height: number; alt: string };
}[] = [
  {
    name: 'Waitrose, Cowbridge',
    mapQuery: 'Waitrose, Cowbridge, Wales',
    image: {
      src: '/images/waitrose-cowbridge.jpg',
      width: 800,
      height: 600,
      alt: 'Waitrose supermarket in Cowbridge',
    },
  },
  {
    name: 'Co-op, St Athan',
    mapQuery: 'Co-op, St Athan, Wales',
    image: {
      src: '/images/coop-st-athan.jpg',
      width: 800,
      height: 600,
      alt: 'Co-op supermarket in St Athan',
    },
  },
  {
    name: 'Filco, Llantwit Major',
    mapQuery: 'Filco, Llantwit Major, Wales',
    image: {
      src: '/images/filco-llantwit.jpg',
      width: 800,
      height: 600,
      alt: 'Filco Foodhall in Llantwit Major',
    },
  },
];

export const departureChecklist: { icon: string; title: string; description: string }[] = [
  { icon: 'Utensils', title: 'Dishwasher', description: 'Please empty it and leave it switched off.' },
  { icon: 'Lightbulb', title: 'Lights', description: 'Turn off all lights around the property.' },
  { icon: 'DoorClosed', title: 'Doors', description: 'Lock all external doors on your way out.' },
  { icon: 'AppWindow', title: 'Windows', description: 'Close and secure every window.' },
  {
    icon: 'BookOpen',
    title: 'Sign the guest book',
    description: 'Leave us a note about your stay — future guests (and we!) love reading them.',
  },
  { icon: 'Shirt', title: 'Towels', description: 'Leave used towels in the bathroom, not packed in your bags.' },
  { icon: 'Recycle', title: 'Recycling', description: 'Sort recycling into the bins provided outside.' },
  {
    icon: 'KeyRound',
    title: 'Keys',
    description:
      "Take one last cheeky look around — under the bed, behind the sofa — then pop the keys back in the lockbox before you head off.",
  },
];
