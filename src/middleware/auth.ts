import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/AppError";
import jwt, { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { AuthRequest } from "../types";
export const authenticateToken = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return AppError.unauthorized('Access token required')
    }

    jwt.verify(token, process.env.JWT_SECRET!, (err, user: any) => {
        if (err) {
            return AppError.forbidden('Invalid or expired token')
        }
        req.user = user;
        next()
    })
}

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Admin access required' });
    }
    next();
};

export const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error) {
    if (error instanceof TokenExpiredError) {
      throw AppError.unauthorized("Token expired");
    }
    if (error instanceof JsonWebTokenError) {
      throw AppError.unauthorized("Invalid token");
    }
    throw AppError.unauthorized("Token verification failed");
  }
};
