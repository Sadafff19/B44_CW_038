import mongoose, { Schema, Types } from 'mongoose';

export interface ICartItem {
  productId: Types.ObjectId;
  qty:       number;
}

export interface ICart extends mongoose.Document {
  userId: Types.ObjectId;
  items:  ICartItem[];
}

const cartItemSchema = new Schema<ICartItem>({
  productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
  qty:       { type: Number, min: 1, default: 1 },
});

const cartSchema = new Schema<ICart>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', unique: true },
  items:  { type: [cartItemSchema], default: [] },
});

export const Cart = mongoose.model<ICart>('Cart', cartSchema);