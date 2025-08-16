import { NextFunction, Request, Response } from "express";

export const parseBodyData = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.body.bodyData) {
    try {
      req.body = JSON.parse(req.body.bodyData);
    } catch (error) {
      res.status(400).json({
        success: false,
        message: "Invalid JSON format in bodyData",
      });
      return;
    }
  }
  next();
};
