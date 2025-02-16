import express from "express";
import { handleWebhook } from "../Application/payment";

export const paymentsRouter = express.Router();

paymentsRouter.route("/webhook").post(handleWebhook);
