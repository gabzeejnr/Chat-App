import { Router } from "express";
import type { Router as RouterType } from "express";
import { addMessage } from "../../controllers/chat.controller.js";

const testRoute: RouterType = Router();

testRoute.get("/send", addMessage);

export { testRoute }