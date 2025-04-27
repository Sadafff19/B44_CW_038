import { Router } from 'express'
import { verifyFirebaseToken } from '../middlewares/auth'
import { Order } from '../models/Order'
import { Product } from '../models/Product'
import { isFarmer } from '../middlewares/isFarmer'

const router = Router()

// @desc   Create a new order
// @route  POST /api/orders
router.post('/', verifyFirebaseToken, async (req, res) => {
  const { items, totalAmount } = req.body

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order items are required' })
  }

  // Optional: Validate products and stock
  for (const item of items) {
    const product = await Product.findById(item.productId)
    if (!product) return res.status(404).json({ error: 'Product not found' })
    if (product.stock < item.qty) {
      return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
    }
    product.stock -= item.qty
    await product.save()
  }

  const order = await Order.create({
    consumerId: req.user?._id,
    items,
    totalAmount,
    status: 'PENDING'
  })

  res.status(201).json({ message: 'Order placed', order })
})

// @desc   Get logged-in consumer's orders
// @route  GET /api/orders/mine
router.get('/mine', verifyFirebaseToken, async (req, res) => {
  const orders = await Order.find({ consumerId: req.user?._id })
    .populate('items.productId')
    .sort({ createdAt: -1 })

  res.json(orders)
})

// @desc   Get incoming orders for farmer
// @route  GET /api/orders/farmer
router.get('/farmer', verifyFirebaseToken, isFarmer, async (req, res) => {
  const orders = await Order.find({ 'items.farmerId': req.user?._id })
    .populate('items.productId')
    .populate('consumerId')
    .sort({ createdAt: -1 })

  // Filter items belonging to this farmer
  const filtered = orders.map(order => ({
    _id: order._id,
    consumer: order.consumerId,
    createdAt: order.createdAt,
    status: order.status,
    items: order.items.filter(i => i.farmerId?.toString() === req.user?._id.toString())
  }))

  res.json(filtered)
})

// @desc   Get single order by ID
// @route  GET /api/orders/:id
router.get('/:id', verifyFirebaseToken, async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('items.productId')
    .populate('consumerId')

  if (!order) return res.status(404).json({ error: 'Order not found' })

  if (
    order.consumerId.toString() !== req.user?._id.toString() &&
    !req.user?.role.includes('ADMIN')
  ) {
    return res.status(403).json({ error: 'Access denied' })
  }

  res.json(order)
})

// @desc   Update order status (e.g., mark as delivered)
// @route  PATCH /api/orders/:id/status
router.patch('/:id/status', verifyFirebaseToken, async (req, res) => {
  const order = await Order.findById(req.params.id)
  const { status } = req.body

  if (!order) return res.status(404).json({ error: 'Order not found' })

  // Only the buyer or admin should update their own order
  if (
    order.consumerId.toString() !== req.user?._id.toString() &&
    req.user?.role !== 'ADMIN'
  ) {
    return res.status(403).json({ error: 'Unauthorized' })
  }

  order.status = status
  await order.save()

  res.json({ message: 'Order updated', order })
})

export default router