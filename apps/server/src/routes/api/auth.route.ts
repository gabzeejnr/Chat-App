import { Router } from "express";
import type { Router as RouterType } from "express";
import { getMe, loginUser, logOut, registerUser } from "../../controllers/auth.controller.js";
import { requireAuth, validateSchema } from "../../middlewares/index.js";
import { userLoginZod, userRegistrationZod } from "../../apis/auth/index.js";

const authRouter: RouterType = Router();

authRouter.get("/me", requireAuth, getMe);
authRouter.post("/login", validateSchema(userLoginZod), loginUser);
authRouter.post("/register", validateSchema(userRegistrationZod), registerUser);
authRouter.post("/logout", requireAuth, logOut);


export { authRouter }