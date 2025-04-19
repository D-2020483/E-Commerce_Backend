import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ValidationError from "../domain/errors/validationError";
import Order from "../infrastructure/schemas/Order";
import Product from "../infrastructure/schemas/Product";
import { getAuth } from "@clerk/express";
import NotFoundError from "../domain/errors/not-found-error";
import mongoose from "mongoose";
import Address from "../infrastructure/schemas/Address";

const orderSchema = z.object({
  items: z.array(
    z.object({
      product: z.object({
        _id: z.string(), 
        name: z.string(),
        price: z.string(),
        image: z.string(),
        description: z.string(),
      }),
      quantity: z.number(),
    }),
  ),
  shippingAddress: z.object({
    line_1: z.string().min(1, "Address line 1 is required"),
    line_2: z.string().min(1, "Address line 2 is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(1, "State/Province is required"),
    zip_code: z.string().min(1, "Zip Code is required"),
    phone: z.string().regex(/^\+?[1-9]\d{1,14}$/, "Invalid phone number format"),
  }),
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = req.body;
    console.log("Received order data:", order);
    const result = orderSchema.safeParse(order);

    if (!result.success) {
      console.log("Validation error:", result.error);
      throw new ValidationError("Invalid order data");
    }

    // Validate stock levels for all items
    for (const item of result.data.items) {
      const product = await Product.findById(item.product._id);
      if (!product) {
        throw new NotFoundError(`Product not found: ${item.product._id}`);
      }

      // Get the default variant or first variant
      const variant = product.variants.find(v => v.name === 'default') || product.variants[0];
      if (!variant) {
        throw new ValidationError(`No variants found for product: ${product.name}`);
      }

      if (variant.stock < item.quantity) {
        throw new ValidationError(`Insufficient stock for ${product.name}. Available: ${variant.stock}, Requested: ${item.quantity}`);
      }
    }
    
    const userId = getAuth(req).userId;
    const addressId = await Address.create({
      ...result.data.shippingAddress,
    });

    const createdOrder = await Order.create({
      userId: userId || "user_2ssdkR3frHTMU1SRkCIQqVns8eI",
      items: result.data.items,
      addressId: addressId._id,
    });

    // Populate the address details
    const populatedOrder = await Order.findById(createdOrder._id).populate({
      path: "addressId",
      model: "Address",
    });

    res.status(201).json(populatedOrder);
  } catch (error) {
    console.error("Order creation error:", error);
    next(error);
  }
};

export const getOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const order = await Order.findById(id).populate({
      path: "addressId",
      model: "Address",
    });
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};

export const getOrdersByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const userId = getAuth(req).userId;

    const orders = await Order.find({ userId }).populate({
      path: "addressId",
      model: "Address",
    });

    res.status(200).json(orders); 
  } catch (error) {
    next(error);
  }
};
