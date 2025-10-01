import express, { Request, Response } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import blogRoutes from './modules/blog/blog.routes'
import authRoutes from './modules/auth/auth.routes'
import projectRoutes from './modules/project/project.routes'
import aboutRoutes from './modules/about/about.route'



 const app = express();
app.use(express.json());
app.use(cookieParser());
// Middlewares
app.use(
  cors({
    // origin: 'http://localhost:5173',
    // origin: 'https://digital-wallet-client-beta.vercel.app',
     credentials: true,
   })
);




// Routes
app.use("/api/blogs", blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/about', aboutRoutes);

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Portfolio Builder Website');
});


export default app;