import type { Product } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const productDetails = [
  { name: 'Zero-Gravity Yo-Yo', description: 'It comes back up, but does it ever come down? Experience the thrill of uncertainty with every flick.', price: 1299, category: 'Toys' },
  { name: 'Invisible Dog Leash', description: 'Perfect for walks with your imaginary friend. Finally, a leash that understands the need for personal space.', price: 499, category: 'Pet Supplies' },
  { name: 'Dehydrated Water', description: 'Just add water! Each can contains enough powder to make up to one gallon of refreshing H2O. Caution: Do not consume powder directly.', price: 199, category: 'Kitchen' },
  { name: 'Instant Plant Seeds', description: 'Tired of waiting for nature? So are we. From seed to full-grown oak in under 30 seconds. Soil not included.', price: 2499, category: 'Garden' },
  { name: 'Portable Black Hole', description: 'Misplaced your keys? Annoying neighbor? Small existential dread? Make it all disappear with our patented pocket singularity.', price: 9999, category: 'Gadgets' },
  { name: 'Self-Solving Rubik\'s Cube', description: 'Impress your friends and question your own intelligence. It solves itself, but the real puzzle is how.', price: 3500, category: 'Toys' },
  { name: 'The Unlosable Sock Pair', description: 'The revolution in laundry technology. Each sock is quantum-entangled with its partner, ensuring they can never be separated. Or can they?', price: 1599, category: 'Apparel' },
  { name: 'Bottomless Snack Bag', description: 'A caloric paradox wrapped in a burlap sack. Reaches into the bag and pull out a different snack every time. Never repeats. Maybe.', price: 5000, category: 'Kitchen' },
  { name: 'Self-Typing Keyboard', description: 'Suffering from writer\'s block? This keyboard finishes your sentences, your emails, and maybe even your novel.', price: 7500, category: 'Productivity' },
  { name: 'The Inspiration Pen', description: 'This pen has been pre-loaded with the brainwaves of history\'s greatest thinkers. Just hold it and wait for genius to strike.', price: 2200, category: 'Productivity' },
  { name: 'Auto-Seasoning Salt Shaker', description: 'Leveraging advanced taste-bud-reading technology, it dispenses the perfect amount of seasoning every time.', price: 1800, category: 'Kitchen' },
  { name: 'Ever-Perfect Mug', description: 'Keeps your coffee piping hot and your iced tea perfectly chilled. Simultaneously. Don\'t ask how.', price: 2800, category: 'Kitchen' },
  { name: 'Mood-Ring T-Shirt', description: 'A shirt that changes color to reflect your emotional state. A great way to warn others... or attract attention.', price: 4200, category: 'Apparel' },
  { name: 'Perpetually Crisp Suit', description: 'Made from a memory-fabric that repels wrinkles and stains. Look sharp, even after sleeping in it.', price: 15000, category: 'Apparel' },
  { name: 'Universal Remote', description: 'Controls everything. Your TV, your smart home, your neighbor\'s garage door, the stock market. Use with caution.', price: 8000, category: 'Gadgets' },
  { name: 'Dream Recorder', description: 'Ever wanted to re-watch that dream where you could fly? Now you can. Side effects may include reality confusion.', price: 25000, category: 'Gadgets' },
];

export const products: Product[] = PlaceHolderImages.map((img, index) => ({
  id: img.id,
  name: productDetails[index]?.name || `Virtual Product ${index + 1}`,
  description: productDetails[index]?.description || 'An amazing virtual product.',
  price: productDetails[index]?.price || 1000,
  category: productDetails[index]?.category || 'Miscellaneous',
  imageUrl: img.imageUrl,
  imageHint: img.imageHint,
}));
