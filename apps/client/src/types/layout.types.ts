import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";


interface SidebarProps {
    title: string;
    icon: LucideIcon | ComponentType<{ className?: string }>;
    link: `/${string}`;
    bottom?: true;
    onClick?:()=>void;
}


export type { SidebarProps }