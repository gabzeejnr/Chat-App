import { MessageCircle, UsersRound, UserRoundPlus, Settings } from "lucide-react";
import Avatar from "../components/Avatar"
import type { SidebarProps } from "../types";


const SIDEBAR_DATA: SidebarProps[] = [
    {
        title: "Friends",
        icon: UsersRound,
        link: "/friends"
    },
    {
        title: "Messages",
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
        icon: Avatar,
        iconProps: { size: 4 },
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