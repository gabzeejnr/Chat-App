import { userIdError } from "../libs/index.js";
import type { UUID } from "node:crypto";
import type { Request, Response } from "express";

async function sendMessage(req: Request<{}, {}, {}, { friendshipId?: UUID }>, res: Response): Promise<void> {
    try {
        const userId = res.locals.user?.userId;
        if (!userId) {
            res.status(401).json(userIdError);
            return;
        }

        const { friendshipId } = req.query;
        if (!friendshipId) {
            res.status(400)
            return;
        }

    } catch (err) {

    }
}

export { sendMessage }