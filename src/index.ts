import express, { ErrorRequestHandler } from "express";
import "dotenv/config";
import { productRouter } from "./api/product";
import { connectDB } from "./infrastructure/db";
import globalErrorHandlingMiddleware from "./api/middleware/global-error-handling-middleware";
import { categoryRouter } from "./api/category";
import { orderRouter } from "./api/order";
import { clerkMiddleware } from "@clerk/express";
import cors from 'cors';
import { paymentsRouter } from "./api/payment";


const app = express();

app.use(cors({ 
    origin: "http://localhost:5173" ,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']}));

app.use(express.json()); // For parsing JSON requests
app.use(clerkMiddleware({
    publishableKey: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    secretKey: process.env.VITE_CLERK_SECRET_KEy,
}));



app.use("/api/products", productRouter);
app.use("/api/categories", categoryRouter);
app.use("/api/orders", orderRouter);
app.use("/api/payments", paymentsRouter);



app.use(globalErrorHandlingMiddleware);


connectDB();
app.listen(3000, () => console.log(`Server running on port ${3000}`));