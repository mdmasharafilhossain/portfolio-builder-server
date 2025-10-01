import { prisma } from "../../config/db";
import { AppError } from "../../utils/AppError";
import { AuthResponse } from "./auth.interface";
import { RegisterInput } from "./auth.schema";
import bcrypt from 'bcryptjs';
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
        } catch (error) {
            console.log(error);
        }
    }
}