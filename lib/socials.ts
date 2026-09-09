import { FaFacebookF, FaGoogle, FaInstagram, FaYelp } from 'react-icons/fa6'

/** Google Business Profile Place ID for Havana Heating and Air. */
export const GOOGLE_PLACE_ID = 'ChIJeQvcSDdmxWARyQusQgy2nI4'

/**
 * Opens the listing's reviews on google.com rather than in Maps.
 * Google redirects this to a search page pinned to the listing by id, so no
 * competitor results appear.
 */
export const googleReviewsUrl = `https://search.google.com/local/reviews?placeid=${GOOGLE_PLACE_ID}`

/** Opens the star-rating form for this listing (Google sign-in if needed). */
export const googleWriteReviewUrl = `https://search.google.com/local/writereview?placeid=${GOOGLE_PLACE_ID}`

export const socials = [
  {
    label: 'Yelp',
    href: 'https://www.yelp.com/biz/havana-heating-and-air-escondido-2',
    icon: FaYelp,
  },
  {
    label: 'Google Reviews',
    href: googleReviewsUrl,
    icon: FaGoogle,
  },
  { label: 'Instagram', href: 'https://www.instagram.com/havanaheatingandair', icon: FaInstagram },
  { label: 'Facebook', href: '#', icon: FaFacebookF },
] as const
