import { Router } from "express";
import type { Router as RouterType } from "express";
import { addMessage, getMessages } from "../../controllers/chat.controller.js";

const testRoute: RouterType = Router();

testRoute.post("/send-message", addMessage);
testRoute.get("/messages", getMessages);

export { testRoute }