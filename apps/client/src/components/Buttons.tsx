import type { ThemeButton } from "../types";



export default function ThemeButton({
    label,
    children,
    className,
    ...buttonProps
}: ThemeButton) {
    return (
        <button {...buttonProps} className={`bg-green-700 text-white font-medium px-5 py-3 rounded-xl
            shadow-[6px_6px_0px_0px_rgb(59,130,246)] transition-all duration-200
            hover:bg-green-600 hover:shadow-[4px_4px_0px_0px_rgb(59,130,246)] hover:translate-x-1 hover:translate-y-0.5
            active:shadow-none active:translate-x-2 active:translate-y-1.5
            focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 ${className ?? ""}`}
        >{label ?? children}</button>
    )
}