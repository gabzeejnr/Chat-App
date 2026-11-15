import type { Friend } from "@chat-app/shared";

export default function ChatArea({ username }: { username: Friend["username"] }) {
    return (
        <section className="flex-2 relative flex flex-col h-full">
            <div className="flex absolute inset-x-0 mx-auto max-w-full  h-20 shadow-md shadow-gray-300 rounded-2xl">
                <input type="text" placeholder={`Chat with ${username}`} />
            </div>
        </section>
    )
}