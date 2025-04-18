import mongoose, { Schema, Document } from 'mongoose';

interface Variant {
  name: string;
  stock: number;
}

interface ProductDocument extends Document {
  name: string;
  price: number;
  description: string;
  image: string;
  categoryId: mongoose.Schema.Types.ObjectId;
  variants: Variant[]; 
}

const VariantSchema = new Schema<Variant>({
  name: { type: String, required: true },
  stock: { type: Number, required: true },
});

const ProductSchema = new Schema<ProductDocument>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  categoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  variants: [VariantSchema], 
});

export default mongoose.model<ProductDocument>('Product', ProductSchema);