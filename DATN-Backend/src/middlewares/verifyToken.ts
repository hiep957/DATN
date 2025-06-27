import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../utils/ApiError";
import { TokenUtils } from "../utils/TokenUtils";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.accessToken;
  
  if (!token) {
    throw new UnauthorizedError("Access token is missing");
  }

  try {
    const decoded = TokenUtils.verifyAccessToken(token);
    (req as any).user = decoded;
    console.log("Decoded token:", decoded); // Log the decoded token for debugging
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid or expired access token");
  }
};
