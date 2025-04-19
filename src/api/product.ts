import express from "express";
import {
    getProducts , 
    createProduct , 
    getProduct , 
    deleteProduct , 
    updateProduct,
    checkoutProduct,
    updateProductStock,
} from "../Application/product"


export const productRouter = express.Router()

productRouter
.route('/')
.get(getProducts)
.post(createProduct)

productRouter
.route('/:id')
.get(getProduct)
.delete(deleteProduct)
.patch(updateProduct)

productRouter.route("/checkout").post(checkoutProduct)

// Add new route for updating stock
productRouter.route("/:productId/stock").put(updateProductStock)