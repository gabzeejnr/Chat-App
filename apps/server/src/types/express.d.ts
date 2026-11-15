import type { AccessTokenPayload } from "./users.types.ts";

declare global {
    namespace Express {
        interface Locals {
            validatedBody?: unknown;
            user?: AccessTokenPayload
        }
    }
}

export { };