import express from "express";
import { getOrdersByUser, placeOrder } from "../application/order";
import { asyncHandler } from "../utils";

export const orderRouter = express.Router()

//orderRouter.route('/').post(asyncHandler(placeOrder))
//orderRouter.route('/:id').get(asyncHandler(getOrdersByUser))