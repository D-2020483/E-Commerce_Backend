import { NextFunction, Request, Response } from "express";
import Order from "../infrastructure/schemas/Order";
import Product from "../infrastructure/schemas/Product";

export const handleWebhook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { type, data } = req.body;

  if (type === "succeeded") {
    try {
      // Find the order and update its payment status
      const order = await Order.findByIdAndUpdate(
        data.orderId, 
        { paymentStatus: "PAID" },
        { new: true }
      );

      if (!order) {
        console.error("Order not found:", data.orderId);
        res.status(404).json({ error: "Order not found" });
        return;
      }

      // Update inventory for each item in the order
      for (const item of order.items) {
        const product = await Product.findById(item.product._id);
        if (!product) {
          console.error("Product not found:", item.product._id);
          continue;
        }

        // Find the default variant or first available variant
        const variant = product.variants.find(v => v.name === 'default') || product.variants[0];
        if (variant) {
          variant.stock = Math.max(0, variant.stock - item.quantity);
          await product.save();
        }
      }

      res.status(200).send();
    } catch (error) {
      console.error("Error processing payment webhook:", error);
      res.status(500).json({ error: "Error processing payment" });
    }
  } else {
    res.status(200).send();
  }
};