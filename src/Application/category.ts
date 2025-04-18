import { categoryDTO } from "../domain/dto/category";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validationError";
import Category from "../infrastructure/schemas/Category";
import { Request, Response, NextFunction } from "express";
import { z } from "zod";

export const getCategories = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data = await Category.find();
    res.status(200).json(data);
    return;
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const result:CategoryDTO = (req.body); //Only compile time even if its wronng type in req.body
    const result = categoryDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid category data");
    }

    await Category.create(result.data);
    res.status(201).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const category = await Category.findById(id);
    if (!category) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).json(category);
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndDelete(id);

    if (!category) {
      throw new NotFoundError("Product not found");
    }
    res.status(204).send();
    return;
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, req.body , {new: true});

    if (!category) {
      throw new NotFoundError("Product not found");
    }

    res.status(200).send(category);
    return 
  } catch (error) {
    next(error);
  }
};