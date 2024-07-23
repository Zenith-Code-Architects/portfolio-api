import { getUsers, login, logout, portfolio, signUp, token } from "../controllers/user.js";
import { Router } from "express";
import { checkUserSession } from "../middleware/auth.js";

// Create router
const userRouter = Router();

// Define routes
userRouter.get('/user', getUsers );

userRouter.post('/user/auth/signup', signUp);

userRouter.post('/user/auth/session/login', login);

userRouter.post('/user/auth/token/login', token);

userRouter.post('/user/auth/logout', checkUserSession, logout);

userRouter.get('/user/portfolio/:userName', portfolio)

// export router
export default userRouter 