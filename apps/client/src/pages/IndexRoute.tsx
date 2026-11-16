import { MessageCircle } from "../libs"
import { appName } from "../data";

export default function IndexRoute() {
    return (
        <div className="flex items-center justify-center h-full">
            <div className="relative select-none">
                <MessageCircle size={100} strokeWidth={0.5} className="text-primary" />
                <span className="absolute top-1/2 -translate-y-1/2 right-1/2 translate-x-1/2 font-mono text-2xl text-primary">{appName}</span>
            </div>
        </div>
    )
}