import { CookieOptions, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { loginSchema, registerSchema } from "./auth.schema";
import { authService } from "./auth.service";
import { AuthRequest } from "../../types";
import { AppError } from "../../utils/AppError";

export class AuthController {
     login = catchAsync(async (req: Request, res: Response) => {
  
    const body = loginSchema.parse(req.body);

    const authResponse = await authService.login(body);
    const cookieOptions:CookieOptions = {
    httpOnly: true,        
    secure: true, 
    sameSite: 'none',  
    path: '/',  
   
  };

  
  res.cookie("token", authResponse.token, cookieOptions);

    res.json({
      success: true,
      data: authResponse,
      message: 'Login successful'
    });
  });

  
  register = catchAsync(async (req: Request, res: Response) => {
    
    const body = registerSchema.parse(req.body);

    const authResponse = await authService.register(body);

    res.status(201).json({
      success: true,
      data: authResponse,
      message: 'User registered successfully'
    });
  });
    getProfile = catchAsync(async (req: AuthRequest, res: Response) => {
    if (!req.user) {
      throw AppError.unauthorized('Not authenticated');
    }

    const profile = await authService.getUserProfile(req.user.id);

    res.json({
      success: true,
      data: profile,
      message: 'User profile fetched successfully',
    });
  });
   logout = catchAsync(async (req: Request, res: Response) => {
    // Clear cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
    });

    const message = await authService.logout();

    res.json({
      success: true,
      message,
    });
  });
   verifyToken = catchAsync(async (req: AuthRequest, res: Response) => {
    res.json({
      success: true,
      data: {
        user: req.user,
        
      },
      message: 'Token is valid'
    });
  });

}

export const authController = new AuthController()