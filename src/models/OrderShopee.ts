import mongoose, { Schema, Document } from "mongoose";

interface IOrderShopee extends Document {
  orderId: string;
  status: string;
  checkoutId: string;
  time: string;
  itemId: string;
  productName: string;
  commission: number;
}

const orderShopeeSchema = new Schema({
  orderId: { type: String, required: true },
  status: { type: String, required: true },
  checkoutId: { type: String, required: true },
  time: { type: String, required: true },
  itemId: { type: String, required: true },
  productName: { type: String, required: true },
  commission: { type: Number, required: true },
});

const OrderShopee = mongoose.model<IOrderShopee>(
  "OrderShopee",
  orderShopeeSchema
);
export default OrderShopee;
