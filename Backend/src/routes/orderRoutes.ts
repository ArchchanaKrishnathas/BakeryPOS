import express, { Request, Response } from "express";
import { authenticate } from "../middleware/authMiddleware";
import { authorizeRoles } from "../middleware/roleMiddleware";
import Order from "../models/Order";
import Product from "../models/Product";
import ActivityLog from "../models/ActivityLog";
import User from "../models/User";

const router = express.Router();

router.post(
  "/place",
  authenticate,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { products } = req.body;

      if (!products || !Array.isArray(products) || products.length === 0) {
        res.status(400).json({ error: "Products are required." });
        return;
      }

      for (const item of products) {
        if (!item.productId || typeof item.quantity !== "number" || item.quantity <= 0) {
          res.status(400).json({ error: "Each product must have a valid productId and quantity > 0." });
          return;
        }
      }

      let totalAmount = 0;

      for (const item of products) {
        const product = await Product.findById(item.productId);

        if (!product) {
          res.status(404).json({ error: `Product not found: ${item.productId}` });
          return;
        }

        if (product.stockQuantity < item.quantity) {
          res.status(400).json({ error: `Insufficient stock for ${product.name}` });
          return;
        }

        totalAmount += product.price * item.quantity;
        product.stockQuantity -= item.quantity;
        await product.save();
      }

      const order = await Order.create({
        userId: req.user?.userId,
        products,
        totalAmount,
        status: "pending",
      });

      const points = Math.floor(totalAmount / 10);
      await User.findByIdAndUpdate(req.user?.userId, { $inc: { loyaltyPoints: points } });

      await ActivityLog.create({
        userId: req.user?.userId,
        action: `Placed an order with ID: ${order._id}`,
      });

      res.status(201).json({ message: "Order placed successfully", order });
    } catch (err) {
      console.error("Error placing order:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

router.get(
  "/admin",
  authenticate,
  authorizeRoles("admin", "staff"),
  async (req: Request, res: Response): Promise<void> => {
    try {
      const orders = await Order.find()
        .populate("userId", "username email")
        .populate("products.productId", "name price");

      res.status(200).json(orders);
    } catch (err) {
      console.error("Error retrieving orders:", err);
      res.status(500).json({ error: "Failed to retrieve orders" });
    }
  }
);

export default router;
