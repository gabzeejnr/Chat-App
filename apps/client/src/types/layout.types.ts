import type { LucideIcon } from "lucide-react";
import type { ComponentType } from "react";


interface SidebarProps {
    title: string;
    icon: LucideIcon | ComponentType<any>;
    iconProps?: Record<string, unknown>
    link: `/${string}`;
    bottom?: true;
}

interface PaginationProps {
    page: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    onPageChange: (page: number) => void;
}


export type { PaginationProps, SidebarProps }