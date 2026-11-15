import { NavLink } from "react-router-dom";
import { useMediaQuery } from "../hooks";
import { SIDEBAR_DATA } from "../data";
import type { Dispatch, SetStateAction } from "react";
import { MessageCircle } from "lucide-react";

type SidebarItemData = (typeof SIDEBAR_DATA)[number];
type BadgeData = { count: number; danger?: boolean }


const BADGES: Partial<Record<SidebarItemData["link"], BadgeData>> = {
    "/chats": {
        count: 43,
        danger: true
    },
    "/new-friends": {
        count: 4
    },
};


export default function AppSidebar({ sidebarOpen, setSidebarOpen, }: { sidebarOpen: boolean; setSidebarOpen: Dispatch<SetStateAction<boolean>> }) {
    const close = () => setSidebarOpen(false);
    const topItems = SIDEBAR_DATA.filter(data => !data.bottom);
    const bottomItems = SIDEBAR_DATA.filter(data => data.bottom);
    const itemBase = "group relative flex w-16 flex-col items-center gap-1.5 rounded-xl px-1 py-2.5 text-[11px] leading-tight text-sidebar-muted transition-colors duration-150 hover:bg-sidebar-active hover:text-sidebar-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent";
    const isMobile = !useMediaQuery("(min-width: 64rem)");


    const renderItem = (data: SidebarItemData) => {
        const badge = BADGES[data.link];

        return (
            <NavLink key={data.link} to={data.link} end onClick={close}
                className={({ isActive }) =>
                    `${itemBase} ${isActive
                        ? "bg-sidebar-active text-sidebar-fg"
                        : ""
                    }`
                }
            >
                <span className="relative flex">
                    <data.icon className={`size-5 transition-colors ${data.link === "/accounts" ? "" : "group-hover:text-sidebar-fg"}`} />
                    {badge && (
                        <span aria-label={`${badge.count} notifications`} className={`absolute -top-2 -right-2.5 flex h-4 min-w-4 items-center justify-center rounded-full px-1 text-[10px] font-semibold text-white ring-2 ring-sidebar ${badge.danger
                            ? "bg-danger"
                            : "bg-sidebar-badge"
                            }`
                        }>{badge.count > 99 ? "99+" : badge.count}</span>
                    )}
                </span>
                <span className="text-center">{data.title}</span>
            </NavLink>
        );
    };

    return (
        <aside aria-hidden={isMobile && !sidebarOpen} inert={isMobile && !sidebarOpen} className={`${sidebarOpen ? "translate-x-0" : "-translate-x-full"
            } absolute inset-y-0 left-0 z-50 flex h-full w-20 shrink-0 flex-col items-center bg-sidebar py-4 shadow-md transition-transform duration-300 ease-out lg:relative lg:z-auto lg:translate-x-0 lg:shadow-none`}
        >
            <div className="text-white mb-6">
                <MessageCircle />
            </div>
            <nav aria-label="Main navigation" className="flex w-full flex-col items-center gap-2">{topItems.map(renderItem)}</nav>

            <nav aria-label="Account navigation" className="mt-auto flex w-full flex-col items-center gap-2">
                <hr className="mb-2 w-8 border-sidebar-border" />
                {bottomItems.map(renderItem)}
            </nav>
        </aside>
    );
}