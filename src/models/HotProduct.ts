import mongoose from "mongoose";

const hotProductSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Đường dẫn ảnh của sản phẩm
    name: { type: String, required: true }, // Tên sản phẩm
    shop: { type: String, required: true }, // Tên shop
    price: { type: Number, required: true, min: 0 }, // Giá sản phẩm
    commission: { type: Number, required: true, min: 0, max: 100 }, // Hoa hồng (%)
    link: { type: String, required: true }, // Link tới sản phẩm
    category: { type: String, required: true }, // Loại mặt hàng
    status: { type: Boolean, default: true }, // Trạng thái sản phẩm (bật/tắt)
  },
  { timestamps: true }
);

export default mongoose.model("hotproducts", hotProductSchema);
