import { User } from "@prisma/client";
import { prisma } from "../../config/db";
import { AppError } from "../../utils/AppError";
import { AuthResponse } from "./auth.interface";
import { LoginInput, RegisterInput } from "./auth.schema";
import bcrypt from 'bcryptjs';
import jwt ,{ SignOptions } from 'jsonwebtoken';
export class AuthService {


    async register(data: RegisterInput): Promise<AuthResponse> {

        try {
            const { email, password, name } = data;

            const existingUser = await prisma.user.findUnique({
                where: { email }
            })
            if (existingUser) {
                throw AppError.conflict('User already exists')
            }
            const hashedPassword = await bcrypt.hash(password,Number(process.env.bcrypt_salt_rounds))

             const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'USER'
        }
      });
       const token = this.generateToken(user);
       return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
        } catch (error) {
            if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to register user');
        }
    }

    async login(data: LoginInput): Promise<AuthResponse> {
    try {
      const { email, password } = data;

     
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        throw AppError.unauthorized('Invalid credentials');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw AppError.unauthorized('Invalid credentials');
      }

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        token,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw AppError.internalError('Failed to login');
    }
  }
  async getUserProfile(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw AppError.notFound('User not found');
    }

    return user;
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw AppError.internalError('Failed to get user profile');
  }
}
      private generateToken(user: User): string {
    const payload = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return jwt.sign(payload, process.env.JWT_SECRET! as jwt.Secret, {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h'
    } as SignOptions);
  }
}

export const authService = new AuthService()


