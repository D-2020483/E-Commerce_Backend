import NotFoundError from "../domain/errors/not-found-error";
import Product from "../infrastructure/schemas/Product";
import { Request , Response , NextFunction } from "express";

const products = [
  {
    categoryId: "675eec72bbda71bc840cf9f2",
    image: "/assets/products/airpods-max.png",
    id: "1",
    name: "AirPods Max",
    price: "549.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "675eec97bbda71bc840cf9f4",
    image: "/assets/products/echo-dot.png",
    id: "2",
    name: "Echo Dot",
    price: "99.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "2",
    image: "/assets/products/pixel-buds.png",
    id: "3",
    name: "Galaxy Pixel Buds",
    price: "99.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "675eec72bbda71bc840cf9f2",
    image: "/assets/products/quietcomfort.png",
    id: "4",
    name: "Bose QuiteComfort",
    price: "249.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "3",
    image: "/assets/products/soundlink.png",
    id: "5",
    name: "Bose SoundLink",
    price: "119.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "5",
    image: "/assets/products/apple-watch.png",
    id: "6",
    name: "Apple Watch 9",
    price: "699.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "4",
    image: "/assets/products/iphone-15.png",
    id: "7",
    name: "Apple Iphone 15",
    price: "1299.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  },
  {
    categoryId: "4",
    image: "/assets/products/pixel-8.png",
    id: "8",
    name: "Galaxy Pixel 8",
    price: "549.00",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas, sequi?",
  }
];


export const getProducts = async (
  req : Request, 
  res: Response, 
  next: NextFunction
) => { 
  try {
    const { categoryId } = req.query;
    if(!categoryId){
    const data = await Product.find();
    return res.status(200).json(data).send();
    }

    const data = await Product.find({categoryId});
    return res.status(200).json(data).send();

  } catch (error) {
    next(error);
    
  }
  
};

export const createProduct = async (
  req : Request, 
  res: Response , 
  next: NextFunction 
) => {
  try {
    await Product.create(req.body)
    return res.status(201).send();
  } catch (error) {
    next(error);
  }
 
};

export const getProduct = async (
  req : Request, 
  res: Response , 
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id).populate("categoryId");
  
    if (!product) {
      throw new NotFoundError("product not found");
    }
    return res.status(200).json(product).send();
    
  } catch (error) {
    next(error);
  }
  
};

export const deleteProduct = async (
  req : Request, 
  res: Response , 
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const product = await Product.findByIdAndDelete(id);
    if(!product) {
      throw new NotFoundError("product not found");
    }
      return res.status(204).send();
    
  } catch (error) {
    next(error);
  }

};

export const updateProduct = async (
  req : Request, 
  res: Response , 
  next: NextFunction
) => {
  try {
  const id = req.params.id;
  const product = await Product.findByIdAndUpdate(id , req.body);

  if(!product){
    throw new NotFoundError("product not found");
  }
  return res.status(200).send(product); 
  } catch (error) {
    next(error);
  }

};