import { useState } from "react";
import { Outlet } from "react-router-dom";
import { useMediaQuery } from "../hooks";
import AppSidebar from "../components/Sidebar";
import Header from "../components/Header";

export default function AppLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isLargeScreen = useMediaQuery("(min-width: 64rem)");

    return (
        <main className="flex flex-col h-screen overflow-hidden bg-foreground">
            <Header setSidebarOpen={setSidebarOpen} />
            <div className="relative flex min-h-0 flex-1">
                <AppSidebar setSidebarOpen={setSidebarOpen} sidebarOpen={sidebarOpen || isLargeScreen} />
                {sidebarOpen && !isLargeScreen && (
                    <button
                        type="button"
                        aria-label="Close navigation menu"
                        onClick={() => setSidebarOpen(false)}
                        className="absolute inset-0 z-40 bg-black/40 lg:hidden"
                    />
                )}
                <div className="min-w-0 flex-1 overflow-y-auto mt-5 mr-3 p-5 bg-white rounded-t-2xl">
                    <Outlet />
                </div>
            </div>
        </main>
    )
}