import { Router } from "express";
import { changePassword, followUser, getUser, getUsersFollowing,getUsersNotFollowing, loginUser, registerUser, resetPassword, updateUser, verifyCode, verifyUser } from "../Controllers/usersController.js";
import { userAuth } from "../Middleware/usersMiddleware.js";

export const userRouter = Router()

userRouter.get('/following/',userAuth,getUsersFollowing)
userRouter.get('/notfollowing/',userAuth,getUsersNotFollowing)
userRouter.get('/verify/',userAuth,verifyUser)
userRouter.get('/:user_id',userAuth,getUser)
userRouter.put('/update/',userAuth,updateUser)
userRouter.post('/register/',registerUser)
userRouter.post('/login/',loginUser)
userRouter.post('/forgotpwd/',resetPassword)
userRouter.post('/verifycode/',verifyCode)
userRouter.post('/changepwd/',changePassword)
userRouter.post('/follow/', userAuth,followUser)
