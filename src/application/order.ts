import NotFoundError from "../domain/errors/not-found-error";
import Order from "../infrastructure/schemas/Order";
import OrderItem from "../infrastructure/schemas/Oderitem";
import Product from "../infrastructure/schemas/Product";
import { NextFunction } from "express";


//place orders
export const placeOrder = async (
    req : Request , 
    res : Response , 
    next : NextFunction) => {
    try {
        const {userId, items} = req.body;

        //validate input
        if(!userId || !items || !items.length){
            throw new NotFoundError("Check All rhe fileds are filled")
        };

        //Calculate the total amount
        let totalAmmount = 0;

        for(const item of items){
            const product = await Product.findById(item.productId);
            if(!product){
                return res.status(404).json({message : `Product not found: ${item.productId}`});
            }
            totalAmmount += product.price*item.quantity;
        }

        //Create the order
        const order = await Order.create({userId, totalAmmount});

        //Create Order items
        for(const item of items){
            const product = await product.findById(item.productId);
            await OrderItem.create({
                orderId:order._id,
                productId: product._id,
                quantity: item.quantity,
                price:product.price,
            });
        } 

        res.status(201).json({message: "Order placed successfully", orderId:order._id});
    } catch (error) {
        next(error)
    }
};

export const getOrdersByUser = async(
    req : Request, 
    res : Response  , 
    next : NextFunction
)=> {
    try {
        const {userId} = req.params;

        //Find orders for the user
        const orders = await Order.find({ userId }).populate("userId");

        if(!orders.length){
            return res.status(404).json({message: "No orders found for this user"});
        }
        res.status(200).json(orders);
    } catch (error) {
        next(error);
    }
};