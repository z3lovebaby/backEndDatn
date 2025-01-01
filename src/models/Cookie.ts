import * as mongoose from "mongoose";
import { model } from "mongoose";

const cookieSchema = new mongoose.Schema(
  {
    cookie: { type: String, required: true },
  },
  {
    timestamps: true, // Tự động thêm `createdAt` và `updatedAt`
  }
);

export default model("cookies", cookieSchema);
