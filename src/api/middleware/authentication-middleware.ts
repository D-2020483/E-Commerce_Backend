import { getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";

export const isAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  try {
    const auth = getAuth(req);
    if (!auth.userId) {
      res.status(401).json({ message: "Unauthorized" });
      return; 
    }
    next(); 
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return; 
  }
};