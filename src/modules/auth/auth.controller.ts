import { CookieOptions, Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { loginSchema, registerSchema } from "./auth.schema";
import { authService } from "./auth.service";

export class AuthController {
     login = catchAsync(async (req: Request, res: Response) => {
  
    const {body} = loginSchema.parse(req);

    const authResponse = await authService.login(body);
    const cookieOptions:CookieOptions = {
    httpOnly: true,        
    secure: true, 
    sameSite: 'none',    
   
  };

  
  res.cookie("token", authResponse.token, cookieOptions);

    res.json({
      success: true,
      data: authResponse,
      message: 'Login successful'
    });
  });

  
  register = catchAsync(async (req: Request, res: Response) => {
    
    const {body} = registerSchema.parse(req.body);

    const authResponse = await authService.register(body);

    res.status(201).json({
      success: true,
      data: authResponse,
      message: 'User registered successfully'
    });
  });

}

export const authController = new AuthController()