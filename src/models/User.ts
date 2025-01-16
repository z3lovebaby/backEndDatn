import * as mongoose from "mongoose";
import { model } from "mongoose";
interface IUserModel extends mongoose.Model<any> {
  resetLuotQuay(): Promise<void>;
}
const userSchema = new mongoose.Schema({
  email: { type: String, required: true },
  email_verified: { type: Boolean, required: true, default: false },
  verification_token: { type: String, required: true },
  verification_token_time: { type: Date, required: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  reset_password_token: { type: String, required: false },
  reset_password_token_time: { type: Date, required: false },
  name: { type: String, required: true },
  soDu: { type: Number, required: true, default: 0 },
  soDuKhaDung: { type: Number, required: true, default: 0 },
  type: { type: String, required: true },
  status: { type: String, required: true },
  luotQuay: { type: Number, required: true, default: 1 },
  gift: { type: Number, required: true, default: 0 },
  created_at: { type: Date, required: true, default: new Date() },
  updated_at: { type: Date, required: true, default: new Date() },
});
userSchema.statics.resetLuotQuay = async function () {
  await this.updateMany({}, { $set: { luotQuay: 1 } });
  console.log("Số lượt chơi đã được reset về 1 cho tất cả người dùng");
};
export default model<any, IUserModel>("users", userSchema);
