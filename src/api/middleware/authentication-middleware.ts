import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
    req: Request, 
    res: Response, 
    next:NextFunction
) => {
    const auth = getAuth(req);
    if(!auth || !auth.userId){
        throw new Error("Not Authenticated");
    }
    next();
};