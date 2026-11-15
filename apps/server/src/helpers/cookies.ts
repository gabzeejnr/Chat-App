import { env } from "node:process";
import type { Response, CookieOptions } from "express";

const secure = env.NODE_ENV === "production";
const path = "/";
const sameSite: CookieOptions["sameSite"] = secure ? "none" : "lax"

function setTokenCookie(
    res: Response,
    tokenName: string,
    token: string,
    maxAge: number
) {
    res.cookie(tokenName, token, {
        httpOnly: true,
        secure,
        sameSite,
        maxAge,
        path
    })
}

function clearTokenCookie(res: Response, tokenName: string) {
    res.clearCookie(tokenName, {
        httpOnly: true,
        secure,
        sameSite,
        path
    })
}


export { setTokenCookie, clearTokenCookie }