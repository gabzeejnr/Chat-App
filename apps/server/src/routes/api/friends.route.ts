import { Router } from "express";
import { validateSchema } from "../../middlewares/zod.middleware.js";
import { acceptFriendRequestZod, rejectFriendRequestZod, sendFriendRequestZod } from "../../apis/friends.js";
import { acceptFriendRequest, getFriend, getFriendRequests, rejectFriendRequest, sendFriendRequest } from "../../controllers/friends.controller.js";
import type { Router as RouterType } from "express";

const friendRouter: RouterType = Router();

friendRouter.get("", getFriend);
friendRouter.get("/friend-requests", getFriendRequests);
friendRouter.post("/friend-requests", validateSchema(sendFriendRequestZod), sendFriendRequest)
friendRouter.post("/accept-request", validateSchema(acceptFriendRequestZod), acceptFriendRequest)
friendRouter.post("/reject-request", validateSchema(rejectFriendRequestZod), rejectFriendRequest)

export { friendRouter }