import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const productNames = [
  'Zero-Gravity Yo-Yo',
  'Invisible Dog Leash',
  'Dehydrated Water',
  'Instant Plant Seeds',
  'Portable Black Hole',
  'Self-Solving Rubik\'s Cube',
  'The Unlosable Sock Pair',
  'Bottomless Snack Bag',
];

const productDescriptions = [
  'It comes back up, but does it ever come down? Experience the thrill of uncertainty with every flick.',
  'Perfect for walks with your imaginary friend. Finally, a leash that understands the need for personal space.',
  'Just add water! Each can contains enough powder to make up to one gallon of refreshing H2O. Caution: Do not consume powder directly.',
  'Tired of waiting for nature? So are we. From seed to full-grown oak in under 30 seconds. Soil not included.',
  'Misplaced your keys? Annoying neighbor? Small existential dread? Make it all disappear with our patented pocket singularity.',
  'Impress your friends and question your own intelligence. It solves itself, but the real puzzle is how.',
  'The revolution in laundry technology. Each sock is quantum-entangled with its partner, ensuring they can never be separated. Or can they?',
  'A caloric paradox wrapped in a burlap sack. Reaches into the bag and pull out a different snack every time. Never repeats. Maybe.',
];

const productPrices = [1299, 499, 199, 2499, 9999, 3500, 1599, 5000];

export const products: Product[] = PlaceHolderImages.map((img, index) => ({
  id: img.id,
  name: productNames[index] || `Virtual Product ${index + 1}`,
  description: productDescriptions[index] || 'An amazing virtual product.',
  price: productPrices[index] || 1000,
  imageUrl: img.imageUrl,
  imageHint: img.imageHint,
}));
