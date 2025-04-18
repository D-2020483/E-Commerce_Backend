import mongoose from "mongoose";

const VariantSchema = new mongoose.Schema({
  name: { type: String, required: true }, 
  stock: { type: Number, required: true, default: 0 },
});

const ProductSchema = new mongoose.Schema({
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  variants: [
    {
      name: { type: String, required: true },
      stock: { type: Number, required: true },
    }
  ], 
  
});

export default mongoose.model("Product", ProductSchema);