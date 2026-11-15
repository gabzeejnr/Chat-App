import { z } from "zod";

export const userRegistrationZod = z.object({
    email: z.string().includes("@").includes("."),
    password: z.string().min(8),
    username: z.string(),
    displayName: z.string()
})


export type RegistrationInput = z.infer<typeof userRegistrationZod>