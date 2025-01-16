import * as mongoose from "mongoose";
import { model } from "mongoose";

const shopSchema = new mongoose.Schema(
  {
    image: { type: String, required: true },
    name: { type: String, required: true },
    rate: { type: Number, required: true, min: 0, max: 5 },
    followers: { type: Number, required: true, min: 0 },
    address: { type: String, required: true },
    link: { type: String, required: true },
    status: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default model("shops", shopSchema);
