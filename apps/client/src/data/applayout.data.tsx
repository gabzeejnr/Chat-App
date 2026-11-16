import { useMemo } from "react";
import { MessageCircle, UsersRound, UserRoundPlus, Settings } from "../libs";
import ProfilePicture from "../components/Avatar"
import { useUser } from "../context/UserContext";
import type { SidebarProps } from "../types";


function useSidebarData(): SidebarProps[] {
    const { user } = useUser();
    return useMemo(() => [
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
            icon: ProfilePicture,
            iconProps: { size: 7, url: user?.avatarUrl, name: user?.displayName },
            link: "/accounts",
            bottom: true
        },
        {
            title: "Settings",
            icon: Settings,
            link: "/settings",
            bottom: true
        }
    ], [user?.avatarUrl, user?.displayName]);
}



export { useSidebarData }