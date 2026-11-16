import { Router } from "express";
import type { Router as RouterType } from "express";
import { getMessages, sendMessage } from "../../controllers/conversations.controller.js";
import { validateSchema } from "../../middlewares/zod.middleware.js";
import { sendMessageZod } from "../../apis/conversations.js";

const conversationRouter: RouterType = Router();

conversationRouter.get("/:friendshipId/messages", validateSchema, getMessages);
conversationRouter.post("/:friendshipId/messages", validateSchema(sendMessageZod), sendMessage);

export { conversationRouter }