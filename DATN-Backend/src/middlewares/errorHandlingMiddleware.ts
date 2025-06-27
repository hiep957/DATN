import { StatusCodes } from "http-status-codes";
// Middleware xử lý lỗi tập trung trong ứng dụng Back-end NodeJS (ExpressJS)
import e, { Request, Response, NextFunction } from "express";

type resError = {
  statusCode: number;
  message: string;
  stack?: string;
};

export const errorHandlingMiddleware = (
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Mặc định là 500 nếu không có statusCode
  if (!err.statusCode) err.statusCode = StatusCodes.INTERNAL_SERVER_ERROR;

  // Tạo ra một biến responseError để kiểm soát những gì muốn trả về
  const responseError: resError = {
    statusCode: err.statusCode,
    message: err.message || StatusCodes[err.statusCode], // Nếu lỗi mà không có message thì lấy ReasonPhrases chuẩn theo mã Status Code
    // stack: err.stack
  };

  console.error({
    statusCode: err.statusCode,
    message: err.message,
    stack: err.stack,
  });

  // Trả responseError về phía Front-end
  res.status(responseError.statusCode).json(responseError);
};

export default errorHandlingMiddleware;
