// Central content file for The Barn (Kingsland Barn) website.
// Edit copy here rather than inside components/pages where possible.

export const siteConfig = {
  name: 'The Barn',
  fullName: 'Kingsland Barn',
  region: 'Vale of Glamorgan, Wales',
  email: 'Hello@Kingsland.co.uk',
  tagline:
    'A place to slow down, breathe deeply and enjoy the beauty of the Welsh countryside.',
  metaDescription:
    'The Barn (Kingsland Barn) is a luxury countryside holiday let in the Vale of Glamorgan, Wales — a heated pool, a wood burner, and the Heritage Coast on your doorstep.',
};

export const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Directions', href: '/directions' },
  { label: 'Explore the Area', href: '/explore' },
  { label: 'Before You Leave', href: '/before-you-leave' },
];

export type Tone = 'coast' | 'sage' | 'gold' | 'stone' | 'sand';

export const sitePhotos = {
  hero: {
    src: '/images/hero-pool.jpg',
    width: 1024,
    height: 576,
    alt: 'The heated outdoor pool at The Barn at golden hour, with countryside views beyond',
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
    src: '/images/directions-track.jpg',
    width: 1428,
    height: 1071,
    alt: 'The private track and gate leading to The Barn',
  },
  directionsAfterDark: {
    src: '/images/directions-after-dark.jpg',
    width: 1428,
    height: 1071,
    alt: 'The Barn lit up after dark, with the kitchen visible through the door',
  },
  poolSafety: {
    src: '/images/hero-pool.jpg',
    width: 1024,
    height: 576,
    alt: 'The heated outdoor pool at The Barn',
  },
};

export const amenities: {
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
    title: 'Fast Wi-Fi',
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

export type GalleryPhoto = {
  src: string;
  width: number;
  height: number;
  label: string;
  caption: string;
  span?: boolean; // take a wider tile in the masonry grid
};

export const galleryItems: GalleryPhoto[] = [
  {
    src: '/images/hero-pool.jpg',
    width: 1024,
    height: 576,
    label: 'The pool',
    caption: 'Heated, and yours for the whole stay',
    span: true,
  },
  {
    src: '/images/gallery-kitchen-living.jpg',
    width: 1428,
    height: 1071,
    label: 'Kitchen & living',
    caption: 'Open-plan, and built for cooking together',
  },
  {
    src: '/images/gallery-woodburner.jpg',
    width: 1071,
    height: 1428,
    label: 'The wood burner',
    caption: 'Lit and ready for when the evening cools',
  },
  {
    src: '/images/gallery-bedroom.jpg',
    width: 1071,
    height: 1428,
    label: 'The bedrooms',
    caption: 'Quiet, restful, dressed in soft linen',
  },
  {
    src: '/images/gallery-living-room.jpg',
    width: 1428,
    height: 1071,
    label: 'The living room',
    caption: 'Deep sofas, stone walls, slow evenings',
    span: true,
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
    label: 'The view',
    caption: 'Fields and hedgerows, right from the garden',
  },
  {
    src: '/images/gallery-kitchen-detail.jpg',
    width: 1421,
    height: 988,
    label: 'The kitchen island',
    caption: 'Marble, morning coffee, evening wine',
  },
  {
    src: '/images/gallery-office-nook.jpg',
    width: 1024,
    height: 768,
    label: 'A quiet corner to work',
    caption: 'If you must — fast Wi-Fi included',
  },
];

export const arrivalSteps: { step: number; title: string; description: string }[] = [
  {
    step: 1,
    title: 'Through the first gate',
    description: 'Drive through the first gate and continue onto the private track.',
  },
  {
    step: 2,
    title: 'Follow the track left',
    description: 'Turn left and follow the track around towards the barns.',
  },
  {
    step: 3,
    title: 'Park by the tree',
    description:
      'Park between the old tree and the barns — there is plenty of space, no need to be precious about it.',
  },
  {
    step: 4,
    title: 'Face towards the barn',
    description: 'Turn your car to face the barn, so you are ready for an easy departure.',
  },
];

export const what3words = {
  words: '///example.words.here',
  url: 'https://what3words.com/example.words.here',
  note: 'Replace this with your exact ///what3words address before launch.',
};

export const mapEmbedSrc =
  'https://www.google.com/maps?q=Llanmaes,Vale+of+Glamorgan,Wales&output=embed';

export const parkingInfo = {
  title: 'Parking',
  description:
    "There's informal parking for several cars between the tree and the barns. No permits, no restrictions — just leave enough room for anyone arriving after you.",
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
};

export type AreaCategory = {
  id: string;
  title: string;
  intro: string;
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
      },
      {
        name: 'Nash Point',
        description:
          'Twin lighthouses standing above the cliffs, with coastal paths in both directions. Time it right and the sunsets here are unforgettable.',
        tags: ['Lighthouse', 'Coastal walks', 'Sunset views'],
        tone: 'gold',
      },
    ],
  },
  {
    id: 'food-drink',
    title: 'Food & Drink',
    intro: 'From village pubs to independent cafés, the Vale does not go hungry.',
    places: [
      {
        name: 'The Blacksmith Arms',
        description:
          'A cosy village pub in Llanmaes, a short drive from the Barn, known for its warm welcome and honest, seasonal food.',
        tags: ['Llanmaes', 'Village pub', 'Seasonal menu'],
        tone: 'sage',
      },
      {
        name: 'The Duke of Wellington',
        description:
          'A Cowbridge favourite for a relaxed pint or a proper Sunday lunch after a morning at the coast.',
        tags: ['Cowbridge', 'Sunday lunch', 'Local favourite'],
        tone: 'stone',
      },
      {
        name: 'Cowbridge Cafés',
        description:
          'Independent coffee shops and delis line the high street — perfect for slow mornings and picnic supplies.',
        tags: ['Independent coffee', 'Delis', 'Picnic supplies'],
        tone: 'sand',
      },
    ],
  },
  {
    id: 'towns-villages',
    title: 'Towns & Villages',
    intro: 'Historic market towns and quiet coastal villages, all within easy reach.',
    places: [
      {
        name: 'Cowbridge',
        description:
          'A handsome Georgian market town with independent boutiques, excellent food, and genuine historic charm.',
        tags: ['Boutiques', 'Food', 'Historic charm'],
        tone: 'gold',
      },
      {
        name: 'Llantwit Major',
        description:
          'One of the oldest settlements in Wales, with a Blue Flag beach and centuries of history to explore.',
        tags: ['Beach', 'History', 'Coastal walks'],
        tone: 'coast',
      },
      {
        name: 'St Athan',
        description: 'A quiet village with useful local amenities and easy access to the coast road.',
        tags: ['Local attractions', 'Convenient stop'],
        tone: 'sage',
      },
    ],
  },
  {
    id: 'family-activities',
    title: 'Family Activities',
    intro: 'Castles, gardens and coastal paths to fill long summer days.',
    places: [
      {
        name: 'Ogmore Castle',
        description:
          'Atmospheric ruins beside the River Ewenny — a favourite for stepping-stone crossings and picnics.',
        tags: ['Castle', 'Picnics', 'Free to explore'],
        tone: 'stone',
      },
      {
        name: 'Dunraven Bay & Heritage Coast Walk',
        description:
          'Walled walled gardens above the bay and one of the best short coastal walks in the Vale.',
        tags: ['Coastal walks', 'Gardens', 'National Trust'],
        tone: 'sage',
      },
      {
        name: 'Dyffryn Gardens',
        description:
          'Grand Edwardian gardens with room to roam, a lovely stop for a slower family day.',
        tags: ['Gardens', 'National Trust', 'Family friendly'],
        tone: 'sand',
      },
      {
        name: 'Barry Island',
        description:
          'Classic seaside fun — a sandy beach, an arcade-lined promenade and a traditional pleasure park.',
        tags: ['Beach', 'Pleasure park', 'Summer activities'],
        tone: 'coast',
      },
    ],
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
