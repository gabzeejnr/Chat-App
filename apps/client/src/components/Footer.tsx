import { useUser } from "../context/UserContext";
import { Settings } from "lucide-react";

export default function Footer() {

    const { user, initials } = useUser();

    return (
        <footer className="flex justify-between py-2 px-8 bg-primary-hover mt-auto text-white">
            <div className="flex items-center">
                <div style={{ background: "var(--accent)" }} className="object-center rounded-full border size-12 overflow-hidden">
                    {user?.avatarUrl.length
                        ? <img src={user?.avatarUrl} alt={user?.displayName} className="text-[5px] w-full h-full" />
                        : <div className="h-full w-full grid place-items-center font-bold">{initials}</div>
                    }
                </div>
                <div className="flex flex-col">
                    <span className="font-bold">{user?.displayName}</span>
                    <span>Online</span>
                </div>
            </div>
            <button type="button">
                <Settings />
            </button>
        </footer>
    )
}