import express from "express";
import { 
    createCategory, 
    deleteCategory, 
    getCategories, 
    getCategory, 
    updateCategory 
} from "../application/category";
import { asyncHandler } from "../utils";

export const categoryRouter = express.Router()

categoryRouter
.route('/')
.get(asyncHandler(getCategories))
.post(asyncHandler(createCategory))
categoryRouter
.route('/:id')
.get(asyncHandler(getCategory))
.patch(asyncHandler(updateCategory))
.delete(asyncHandler(deleteCategory))

