import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";


interface SidebarProps {
    title: string;
    icon: LucideIcon | ComponentType<any>;
    iconProps?: Record<string, unknown>
    link: `/${string}`;
    bottom?: true;
}


export type { SidebarProps }