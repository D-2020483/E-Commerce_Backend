import mongoose from "mongoose";

const addressSchema = new mongoose.Schema({
  line_1: { type: String, required: true },
  line_2: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zip_code: { type: String, required: true },
  phone: { type: String, required: true },
});

export default mongoose.model("Address", addressSchema);