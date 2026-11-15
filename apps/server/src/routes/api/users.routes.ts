import { Router } from "express";
import type { Router as RouterType } from "express";
import { discoverUsers, getUser } from "../../controllers/users.controllers.js";

const usersRouter: RouterType = Router();

usersRouter.get("/discover", discoverUsers);
usersRouter.get("/:id", getUser);

export { usersRouter }