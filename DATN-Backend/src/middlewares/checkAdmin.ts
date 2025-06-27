import { NextFunction, Request, Response } from "express";
import { IAuthRequest } from "../interfaces/Auth";
import { ForbiddenError, UnauthorizedError } from "../utils/ApiError";

export const checkAdmin = (
  req: IAuthRequest,
  res: Response,
  next: NextFunction
) => {
  const user = req.user; // Assuming user is set in req by a previous middleware
  console.log("User in checkAdmin middleware:", user); // Log the user for debugging
  if (!user) {
    throw new UnauthorizedError("User not authenticated");
  }

  if (user.role != "admin") {
    throw new ForbiddenError("Access denied: Admins only");
  }

  next();
};
