import { Router } from "express";
import { userAuth } from "../Middleware/usersMiddleware.js";
import { createComments, createPost, getComments, getPosts } from "../Controllers/postsController.js";

export const postRouter = Router()


postRouter.post("/create", userAuth,createPost)
postRouter.get("/", userAuth,getPosts)
postRouter.get("/comments/:post_id", userAuth,getComments)
postRouter.post("/comment", userAuth,createComments)