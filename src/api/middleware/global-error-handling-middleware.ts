import { Request, Response, NextFunction } from "express";

const globalErrorHandlingMiddleware = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(error);
  if (error.name === "NotFoundError") {
    res
      .status(404)
      .json({
        message: error.message,
      })
      .send();
    return;
  } else if (error.name === "ValidationError") {
    res
      .status(400)
      .json({
        message: error.message,
      })
      .send();
    return;
  } else {
    res
      .status(500)
      .json({
        message: error.message,
      })
      .send();
    return;
  }
};

export default globalErrorHandlingMiddleware;