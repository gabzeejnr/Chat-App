import { Router } from "express";
import { healthRouter } from "./health.route.js";
import { authRouter } from "./auth.route.js";
import { friendRouter } from "./friends.route.js";
import { usersRouter } from "./users.routes.js";
import { testRoute } from "./test.routes.js";
import { requireAuth } from "../../middlewares/auth.middleware.js";
import type { Router as RouterType } from "express";

const apiRouter: RouterType = Router();

apiRouter.use(healthRouter);
apiRouter.use("/auth", authRouter);
apiRouter.use(requireAuth);
apiRouter.use("/users", usersRouter);
apiRouter.use("/friends", friendRouter);
apiRouter.use("/test", testRoute)

export { apiRouter }