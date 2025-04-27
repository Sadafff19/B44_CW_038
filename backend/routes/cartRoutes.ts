import { Router } from 'express';
import { verifyFirebaseToken } from '../middlewares/auth';
import { Cart } from '../models/Cart';
import { Product } from '../models/Product';

const router = Router();

/* helper – create doc on first access */
async function getOrCreateCart(userId: string) {
  let cart = await Cart.findOne({ userId });
  if (!cart) cart = await Cart.create({ userId, items: [] });
  return cart;
}

/* GET /api/cart   – current cart */
router.get('/', verifyFirebaseToken, async (req, res) => {
  const cart = await getOrCreateCart(req.user!._id);
  res.json(cart);
});

/* POST /api/cart   – add or change qty
   { productId, qty = 1 }                                          */
router.post('/', verifyFirebaseToken, async (req, res) => {
  const { productId, qty = 1 } = req.body;
  if (!productId) return res.status(400).json({ error: 'productId required' });

  /* optional: verify product exists */
  const productExists = await Product.exists({ _id: productId });
  if (!productExists) return res.status(404).json({ error: 'Product not found' });

  const cart = await getOrCreateCart(req.user!._id);

  const idx = cart.items.findIndex(i => i.productId.equals(productId));
  if (idx === -1) cart.items.push({ productId, qty });
  else            cart.items[idx].qty = qty;

  await cart.save();
  res.json(cart);
});

/* DELETE /api/cart/:productId – remove line */
router.delete('/:productId', verifyFirebaseToken, async (req, res) => {
  const { productId } = req.params;
  const cart = await getOrCreateCart(req.user!._id);

  cart.items = cart.items.filter(i => !i.productId.equals(productId));
  await cart.save();
  res.json(cart);
});

/* (optional) DELETE /api/cart – clear */
router.delete('/', verifyFirebaseToken, async (req, res) => {
  const cart = await getOrCreateCart(req.user!._id);
  cart.items = [];
  await cart.save();
  res.json(cart);
});

export default router;