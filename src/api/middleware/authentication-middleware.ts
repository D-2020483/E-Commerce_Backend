import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
    req: Request, 
    res: Response, 
    next:NextFunction
) => {
    try {
        const  auth = getAuth(req);
        if (!auth.userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        next();

    } catch (error) {
        return res.status(401).json({ message: "Unauthorized" });
    }
};