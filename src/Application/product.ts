import NotFoundError from "../domain/errors/not-found-error";
import Product from "../infrastructure/schemas/Product";

import { Request, Response, NextFunction } from "express";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { categoryId } = req.query;
    if (!categoryId) {
      const data = await Product.find();
      res.status(200).json(data);
      return;
    }

    const data = await Product.find({ categoryId });
    res.status(200).json(data);
    return;
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {

    const { name, price, description, image, categoryId, stock } = req.body;

    // Validate required fields
    if (!name || !price || !description || !image || !categoryId || stock === undefined) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    await Product.create(req.body);
    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("categoryId");
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(200).json(product);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);

    if (!product) {
      throw new NotFoundError("Product not found");
    }
    res.status(204).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {new: true});

    if (!product) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).send(product);
    return;
  } catch (error) {
    next(error);
  }
};

export const checkoutProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cart = req.body.cart;

    for (const item of cart) {
      const product = await Product.findById(item.productId);

      if (!product) {
        throw new NotFoundError("Product not found");
      }

      if (product.stock < item.quantity) {
        res.status(400).json({
          message: `Not enough stock for product: ${product.name}`,
        });
        return;
      }

      product.stock -= item.quantity;
      await product.save();
    }

    res.status(200).json({ message: "Checkout successful. Inventory updated." });
  } catch (error) {
    next(error);
  }
};
