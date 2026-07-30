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
