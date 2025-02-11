import { NextFunction, Request, Response } from "express";
import { z } from "zod";
import ValidationError from "../domain/errors/validationError";
import Order from "../infrastructure/schemas/Order";
import { getAuth } from "@clerk/express";
import NotFoundError from "../domain/errors/not-found-error";
import mongoose from "mongoose";

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
    })
  ),
});

export const createOrder = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = req.body;
    // console.log(order);
    const result = orderSchema.safeParse(order);

    if (!result.success) {
      throw new ValidationError("Invalid order data");
    }
    
    const items = result.data.items.map(item => ({
      ...item,
      product: {
        ...item.product,
        _id: mongoose.Types.ObjectId.isValid(item.product._id)
          ? new mongoose.Types.ObjectId(item.product._id)
          : item.product._id, 
      }
    }));
    
    const userId = getAuth(req).userId;

    const newOrder = await Order.create({
      userId: "123",
      items: items,
    });

    res.status(201).json(newOrder);
  } catch (error) {
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
    const order = await Order.findById(id);
    if (!order) {
      throw new NotFoundError("Order not found");
    }
    res.status(200).json(order);
  } catch (error) {
    next(error);
  }
};