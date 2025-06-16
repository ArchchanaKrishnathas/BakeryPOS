// ===== 5. Loyalty Points Example (controllers/orderController.ts) =====
import User from "../models/User";

const increaseLoyaltyPoints = async (userId: string, amount: number) => {
  const points = Math.floor(amount / 10); // 1 point per Rs.10 spent
  await User.findByIdAndUpdate(userId, { $inc: { loyaltyPoints: points } });
};

// Call this after successful order creation
// await increaseLoyaltyPoints(order.userId.toString(), order.totalAmount);
