import NotFoundError from "../domain/errors/not-found-error";
import Product from "../infrastructure/schemas/Product";
import ValidationError from "../domain/errors/validationError";

import { Request, Response, NextFunction } from "express";

export const getProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const product = req.body;
    // Ensure at least one variant is provided with stock information
    if (!product.variants || product.variants.length === 0) {
      product.variants = [{ name: 'default', stock: 0 }];
    }
    const createdProduct = await Product.create(product);
    res.status(201).json(createdProduct);
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

    // Validate cart items and check stock
    for (const item of cart) {
      const product = await Product.findById(item.product._id);

      if (!product) {
        throw new NotFoundError(`Product not found: ${item.product._id}`);
      }

      // Use default variant if none specified
      const variantName = item.variantName || 'default';
      const variant = product.variants.find((v) => v.name === variantName);
      
      if (!variant) {
        res.status(400).json({
          message: `Variant ${variantName} not found for product: ${product.name}`,
        });
        return;
      }

      if (variant.stock < item.quantity) {
        res.status(400).json({
          message: `Not enough stock for ${product.name} (${variantName}). Available: ${variant.stock}, Requested: ${item.quantity}`,
        });
        return;
      }

      // Reduce stock
      variant.stock -= item.quantity;
      await product.save();
    }

    res.status(200).json({ message: "Checkout successful. Inventory updated." });
  } catch (error) {
    next(error);
  }
};

export const updateProductStock = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { productId } = req.params;
    const { variantName = 'default', stock } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    // Find the variant
    const variant = product.variants.find(v => v.name === variantName);
    if (!variant) {
      res.status(400).json({
        message: `Variant ${variantName} not found for product: ${product.name}`
      });
      return;
    }

    // Update stock
    variant.stock = stock;
    await product.save();

    res.status(200).json({ 
      message: "Stock updated successfully",
      product
    });
  } catch (error) {
    next(error);
  }
};