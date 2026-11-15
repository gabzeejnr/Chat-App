import { Link } from "react-router-dom";
import { Menu, Ellipsis, MessageCircle } from "lucide-react";
import { appName } from "../data";
import type { Dispatch, SetStateAction } from "react";

export default function Header({ setSidebarOpen }: { setSidebarOpen: Dispatch<SetStateAction<boolean>> }) {
    return (
        <header className="flex shrink-0 items-center justify-between px-8 py-3 bg-primary-hover">
            <button type="button" title="Toggle sidebar" onClick={() => setSidebarOpen(p => !p)} className="p-1 hover:border transition-border duration-200 lg:hidden">
                <Menu color="white" />
            </button>
            <div title={appName} className="flex items-center gap-4 select-none">
                <Link to={"/"} className="grid place-items-center p-2 bg-accent rounded-lg">
                    <MessageCircle />
                </Link>
                <h2>{appName}</h2>
            </div>

            <button className="cursor-pointer">
                <Ellipsis />
            </button>
        </header>
    )
}