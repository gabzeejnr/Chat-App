import { Router } from "express";
import type { Router as RouterType } from "express";

const healthRouter: RouterType = Router();

healthRouter.get("/health", (_req, res)=>{
    res.status(200).json({
        message: "Api looking good",
        dateCreated: new Date().toUTCString()
    })
})

export { healthRouter }