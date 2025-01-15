import { categoryDTO } from "../domain/dto/category";
import NotFoundError from "../domain/errors/not-found-error";
import ValidationError from "../domain/errors/validationError";
import Category from "../infrastructure/schemas/Category";
import { Request , Response , NextFunction } from "express";
import { z} from "zod";

const categories = [
    {id: "1", name: "Headphoones"},
    {id: "2", name: "Smart Speakers"},
    {id: "3", name: "Smart Watch"},
    {id: "4", name: "Smartphones"},
    {id: "5", name: "Accessories"}

];
// Get All Categories
export const getCategories = async (
  req : Request, 
  res:Response, 
  next: NextFunction
) => { 
  try {
    const data = await Category.find();
    return res.status(200).json(data).send();
  } catch (error) {
    next(error);
    
  }
  
};

//Create A New Category
export const createCategory = async (
  req : Request, 
  res:Response , 
  next: NextFunction
) => {
  try {
    const result = categoryDTO.safeParse(req.body);
    if (!result.success) {
      throw new ValidationError("Invalid category data");
    }

    await Category.create(result.data);
    return res.status(201).send();
  } catch (error) {
    next(error);
  }
 
};

//Read Single Category 
export const getCategory = async (
  req :Request, 
  res :Response , 
  next: NextFunction
) => {
    try {
      const id = req.params.id;
      const category = await Category.findById(id);
    
      if (!category) {
        throw new NotFoundError("Categoory not found");
      }
      return res.status(200).json(category).send();
      
    } catch (error) {
      next(error);
    }
    
  };

//Update A Category
export const updateCategory = async (
  req : Request, 
  res:Response , 
  next: NextFunction
) => {
    try {
      const id = req.params.id;
    const category = await Category.findByIdAndUpdate(id, req.body);
  
    if(!category){
      throw new NotFoundError("Category not found");
    }
    return res.status(200).send(category); 
    } catch (error) {
      next(error);
    }
  
  };

  //Delete A Category
  export const deleteCategory = async (
    req : Request, 
    res:Response , 
    next: NextFunction) => {
    try {
      const id = req.params.id;
      const category = await Category.findByIdAndDelete(id);
      if(!category) {
        throw new NotFoundError("Category not found");
      }
        
        return res.status(204).send()
      
    } catch (error) {
      next(error);
    }
  
  };