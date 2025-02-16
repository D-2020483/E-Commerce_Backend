import { NextFunction, Request, Response } from "express";
import Address from "../infrastructure/schemas/Address";
import ValidationError from "../domain/errors/validationError";
import NotFoundError from "../domain/errors/not-found-error";
import { getAuth } from "@clerk/express";

export const createAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const addressData = req.body;
    const userId = getAuth(req).userId;

    if (!userId) {
      throw new ValidationError("User must be authenticated");
    }

    const address = await Address.create({
      ...addressData,
      userId,
    });

    res.status(201).json(address);
  } catch (error) {
    next(error);
  }
};

export const getAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const address = await Address.findById(id);
    
    if (!address) {
      throw new NotFoundError("Address not found");
    }

    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const addressData = req.body;
    const userId = getAuth(req).userId;

    const address = await Address.findOneAndUpdate(
      { _id: id, userId },
      addressData,
      { new: true }
    );

    if (!address) {
      throw new NotFoundError("Address not found");
    }

    res.status(200).json(address);
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const userId = getAuth(req).userId;

    const address = await Address.findOneAndDelete({ _id: id, userId });

    if (!address) {
      throw new NotFoundError("Address not found");
    }

    res.status(204).send();
  } catch (error) {
    next(error);
  }
}; 