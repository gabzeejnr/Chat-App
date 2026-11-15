import { z } from "zod";

export const userLoginZod = z.object({
    email: z.string().includes("@").includes("."),
    password: z.string().min(8, "Password must be at least 8 characters long").regex(/[^A-Za-z-0-9]/, { message: "Password must contain at least one special character." })
})



export type LoginInput = z.infer<typeof userLoginZod>