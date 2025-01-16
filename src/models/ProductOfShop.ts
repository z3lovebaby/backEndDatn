import mongoose from "mongoose";

const productOfShopSchema = new mongoose.Schema(
  {
    image: { type: String, required: true }, // Đường dẫn ảnh của sản phẩm
    name: { type: String, required: true },
    shop: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shops",
      required: true,
    }, // Liên kết tới id của bảng shop
    price: { type: Number, required: true, min: 0 },
    commission: { type: Number, required: true, min: 0, max: 100 },
    link: { type: String, required: true }, // Link tới sản phẩm
    category: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("productofshops", productOfShopSchema);
