import mongoose, { Schema, Document } from "mongoose";

interface IOrderShopee extends Document {
  orderId: string;
  status: string;
  checkoutId: string;
  time: string;
  itemId: string;
  productName: string;
  commission: number;
  user_id: mongoose.Schema.Types.ObjectId | null; // Thêm user_id
}

const orderShopeeSchema = new Schema({
  orderId: { type: String, required: true },
  status: { type: String, required: true },
  checkoutId: { type: String, required: true },
  time: { type: String, required: true },
  itemId: { type: String, required: true },
  productName: { type: String, required: true },
  commission: { type: Number, required: true },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Kiểu ObjectId để liên kết với User
    ref: "User", // Liên kết với bảng User
    default: null, // Mặc định là null
  },
});

const OrderShopee = mongoose.model<IOrderShopee>(
  "OrderShopee",
  orderShopeeSchema
);

export default OrderShopee;
