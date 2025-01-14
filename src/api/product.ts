import express from "express";
import {
    getProducts , 
    createProduct , 
    getProduct , 
    deleteProduct , 
    updateProduct
} from "../application/product"
import { asyncHandler } from "../utils";


export const productRouter = express.Router()

productRouter
.route('/')
.get(asyncHandler(getProducts))
.post(asyncHandler(createProduct))
productRouter
.route('/:id')
.get(asyncHandler(getProduct))
.delete(asyncHandler(deleteProduct))
.patch(asyncHandler(updateProduct))