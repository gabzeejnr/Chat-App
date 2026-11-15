import {
    createContext, useCallback, useContext,
    useEffect, useMemo, useState
} from "react";
import { appName } from "../data";
import type { ReactNode } from "react";
import type { ThemeContextProp } from "../types";

const ThemeContext = createContext<ThemeContextProp | null>(null);

export default function ThemeProvider({ children }: { children: ReactNode }) {
    // ================================================================================================
    // USESTATES AND VARIABLES ======================
    // ================================================================================================
    
    const STORAGE_KEY = `${appName}-theme`;
    const [theme, setTheme] = useState<ThemeContextProp["theme"]>(function () {
        if (typeof window === "undefined") return "light";
        const saved = localStorage.getItem(STORAGE_KEY);
        return (saved === "light" || saved === "dark") ? saved : "light"
    });
    const toggleTheme = useCallback(function (theme?: ThemeContextProp["theme"]) {
        if (typeof theme === "string") {
            setTheme(theme);
        } else {
            setTheme((prev) => (prev === "light" ? "dark" : "light"));
        }
    }, []);
    // ================================================================================================
    // USEEFFECTS AND FUNCTIONS =====================
    // ================================================================================================

    useEffect(function () {
        localStorage.setItem(STORAGE_KEY, theme);
        document.documentElement.setAttribute("data-theme", theme)
    }, [theme])


    const value = useMemo(() => ({
        theme,
        toggleTheme
    }), [theme, toggleTheme])

    return (
        <ThemeContext value={value}>
            {children}
        </ThemeContext>
    )
}

export function useTheme(): ThemeContextProp {
    const ctx = useContext(ThemeContext);
    if (!ctx) throw new Error("useTheme must be used in a ThemeProvider");
    return ctx
}