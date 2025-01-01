import * as mongoose from "mongoose";
import { model } from "mongoose";

// Định nghĩa schema cho một bộ { mô tả - link - short-time }
const itemSchema = new mongoose.Schema(
  {
    description: { type: String, required: true }, // Mô tả
    link: { type: String, required: true }, // Link
    voucher_code: { type: String, required: true },
    time: { type: String, required: true, default: "0h" },
  },
  {
    _id: false, // Không cần tạo _id riêng cho các item
  }
);

// Định nghĩa schema cho mỗi tiêu đề và danh sách các bộ trong đó
const titleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true }, // Tiêu đề
    items: [itemSchema],
  },
  {
    _id: false,
  }
);

// Schema tổng thể cho bài đăng thông tin
const dealSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    titles: [titleSchema],
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

export default model("deals", dealSchema);
