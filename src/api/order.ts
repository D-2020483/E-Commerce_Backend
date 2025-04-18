import express from "express";
import { createOrder, getOrder, getOrdersByUserId} from "../Application/order";
import { isAuthenticated } from "./middleware/authentication-middleware";

export const orderRouter = express.Router();

orderRouter.route("/").post(createOrder);
orderRouter.route("/:id").get(getOrder);
orderRouter.route("/user/my-orders").get(isAuthenticated, getOrdersByUserId);