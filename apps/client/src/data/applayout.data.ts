import { MessageCircle, UsersRound, UserRoundPlus, Settings } from "lucide-react";
import { UserAvatar } from "../components/Avatar"
import type { SidebarProps } from "../types";


const SIDEBAR_DATA: SidebarProps[] = [
    {
        title: "Friends",
        icon: UsersRound,
        link: "/friends"
    },
    {
        title: "Chats",
        icon: MessageCircle,
        link: "/chats"
    },
    {
        title: "Add Friends",
        icon: UserRoundPlus,
        link: "/new-friends"
    },
    {
        title: "Accounts",
        icon: UserAvatar,
        iconProps: { size: 7 },
        link: "/accounts",
        bottom: true
    },
    {
        title: "Settings",
        icon: Settings,
        link: "/settings",
        bottom: true
    }
];



export { SIDEBAR_DATA }