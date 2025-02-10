import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
    req: Request, 
    res: Response, 
    next:NextFunction
) => {
    if(!getAuth(req).userId) {
        throw new Error("Not Authenticated");
    }
    next();
};