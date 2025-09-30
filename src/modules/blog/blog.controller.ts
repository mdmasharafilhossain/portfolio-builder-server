
import { AuthRequest } from "../../types";
import { catchAsync } from "../../utils/catchAsync";
import { createBlogSchema } from "./blog.schema";
import { blogService, BlogService } from "./blog.service";



export class BlogController {
    createBlog = catchAsync<AuthRequest>(async (req, res) => {
 
  const { body } = createBlogSchema.parse({ body: req.body });

  const authorId = req.user!.id;

  const blog = await blogService.createBlog(body, authorId);

  res.status(201).json({
    success: true,
    data: blog,
    message: "Blog created successfully",
  });
});



}

export const blogController = new BlogController();