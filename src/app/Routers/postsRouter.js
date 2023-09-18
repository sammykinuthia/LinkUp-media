import { Router } from "express";
import { userAuth } from "../Middleware/usersMiddleware.js";
import { createComments, createPost, deletePost, getComments, getPosts, getPostsExplore, getSinglePost, likeComment, likePost } from "../Controllers/postsController.js";

export const postRouter = Router()


postRouter.post("/create", userAuth,createPost)
postRouter.get("/", userAuth,getPosts)
postRouter.get("/:post_id", userAuth, getSinglePost)
postRouter.get("/explore", userAuth,getPostsExplore)
postRouter.get("/comments/:post_id", userAuth,getComments)
postRouter.post("/comment", userAuth,createComments)
postRouter.post("/likepost", userAuth,likePost)
postRouter.post("/likecomment", userAuth,likeComment)
postRouter.delete("/:post_id", userAuth,deletePost)