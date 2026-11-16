import { z } from "zod";

const sendMessageZod = z.object({ content: z.string() });


type SendMessageInput = z.infer<typeof sendMessageZod>


export { sendMessageZod }
export type { SendMessageInput }