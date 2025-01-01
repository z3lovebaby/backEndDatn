import * as mongoose from "mongoose";
import { model } from "mongoose";

const lenhRutSchema = new mongoose.Schema({
  name: { type: String, required: true },
  stk: { type: String, required: true },
  bank: { type: String, required: true },
  money: { type: Number, require: true },
  email: { type: String, required: true },
  status: { type: String, required: true, default: "Đang chờ xử lý" },
  msg: {
    type: String,
    required: true,
    default: "Yêu cầu của bạn đang đươc xử lý nhé!",
  },
  created_at: { type: Date, required: true, default: new Date() },
  updated_at: { type: Date, required: true, default: new Date() },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  }, // Thêm liên kết đến bảng users
});

export default model("lenhRut", lenhRutSchema);
