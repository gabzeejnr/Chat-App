import { z } from "zod";


const sendFriendRequestZod = z.object({ receiverId: z.string().uuid() })
const acceptFriendRequestZod = z.object({ requestId: z.string().uuid() })
const rejectFriendRequestZod = z.object({ requestId: z.string().uuid() })
const getFriendZod = z.object({ id: z.string().uuid() })


type SendFriendRequestInput = z.infer<typeof sendFriendRequestZod>
type AcceptFriendRequestInput = z.infer<typeof acceptFriendRequestZod>
type RejectFriendRequestInput = z.infer<typeof rejectFriendRequestZod>
type GetFriendInput = z.infer<typeof getFriendZod>

export { sendFriendRequestZod, acceptFriendRequestZod, rejectFriendRequestZod, getFriendZod }
export type { SendFriendRequestInput, AcceptFriendRequestInput, RejectFriendRequestInput, GetFriendInput }