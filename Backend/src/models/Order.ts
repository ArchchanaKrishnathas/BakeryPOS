import mongoose, { Schema, Document } from "mongoose";

export interface IOrderProduct {
  productId: mongoose.Types.ObjectId;
  quantity: number;
}

export interface IOrder extends Document {
  userId: mongoose.Types.ObjectId;
  products: IOrderProduct[];
  totalAmount: number;
  status: "pending" | "shipped" | "delivered" | "cancelled";
}

const orderSchema = new Schema<IOrder>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", orderSchema);
