import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description?: string;
  image?: string;
}

const productSchema: Schema = new Schema<IProduct>({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String },
  image: { type: String },
}, { timestamps: true });

export default mongoose.model<IProduct>("Product", productSchema);
