import * as mongoose from "mongoose";
import { model, Schema, Document, Model } from "mongoose";

// Định nghĩa Schema cho UserOrder
const userOrderSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId, // Liên kết 1-1 với bảng Users
    ref: "users", // Tên mô hình User
    required: true,
    unique: true, // Đảm bảo mỗi user_id chỉ xuất hiện một lần
  },
  orders: [
    {
      type: mongoose.Schema.Types.ObjectId, // Liên kết với bảng OrderShopees
      ref: "OrderShopee", // Tên mô hình OrderShopee
    },
  ],
  count: {
    type: Number,
    default: 0, // Mặc định bắt đầu từ 0
  },
});

// Định nghĩa kiểu cho UserOrder với phương thức tĩnh
interface IUserOrder extends Document {
  name: string;
  user_id: mongoose.Types.ObjectId;
  orders: mongoose.Types.ObjectId[];
  count: number;
}

interface IUserOrderModel extends Model<IUserOrder> {
  resetCounts: () => Promise<void>;
}

// Thêm phương thức tĩnh vào schema
userOrderSchema.statics.resetCounts = async function () {
  await this.updateMany({}, { count: 0 });
  console.log("Reset 'count' về 0 cho tất cả UserOrder");
};

// Khởi tạo mô hình với kiểu dữ liệu đã khai báo
const UserOrder = model<IUserOrder, IUserOrderModel>(
  "UserOrder",
  userOrderSchema
);

export default UserOrder;
