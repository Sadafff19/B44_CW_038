import mongoose, { Schema, Document } from 'mongoose'

export interface IOrderItem {
  productId: mongoose.Types.ObjectId
  farmerId?: mongoose.Types.ObjectId
  qty: number
  price: number
}

export interface IOrder extends Document {
  consumerId: mongoose.Types.ObjectId
  items: IOrderItem[]
  totalAmount: number
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED'
}

const orderItemSchema = new Schema<IOrderItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  farmerId: { type: Schema.Types.ObjectId, ref: 'User' },
  qty: { type: Number, required: true },
  price: { type: Number, required: true }
})

const orderSchema = new Schema<IOrder>({
  consumerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  items: [orderItemSchema],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'],
    default: 'PENDING'
  }
}, { timestamps: true })

export const Order = mongoose.model<IOrder>('Order', orderSchema)