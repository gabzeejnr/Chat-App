import { useUser } from "../context/UserContext";
import { useTheme } from "../context/ThemeContext";
import type { ThemeContextProp } from "../types";

export default function Settings() {
    const { toggleTheme } = useTheme()

    async function copyText() {
        if ("clipboard" in navigator) {

            await navigator.clipboard.writeText(document.getElementById("copy-text")?.textContent!)
            alert(await navigator.clipboard.readText());
        }
    }

    const { logOut } = useUser();
    const handleLogOut = async () => {
        try {
            await logOut();
        } catch (err) {
            console.error(err);
        }
    }
    return (
        <div className="flex flex-col gap-4">
            <section>
                <dd className="font-bold text-xl tracking-wide">Personal Information</dd>
                <p id="copy-text">Some random ahh shii</p>
                <button type="button" title="Copy This Text" onClick={copyText} className="border p-2 text-primary hover:bg-primary-hover hover:text-white transition-colors duration-300 rounded-md cursor-pointer">Copy  This Text</button>
            </section>
            <section>
                <dd className="font-bold text-xl tracking-wide">Personal Information</dd>
                <div>
                    <div>
                        <span className="font-semibold">Theme{" "}</span>
                        <select name="theme" id="theme" className="border rounded-md p-1"
                            onChange={(e) => toggleTheme(e.currentTarget.value as ThemeContextProp["theme"])}
                        >
                            <option>System</option>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                    </div>
                </div>
            </section>
            <section>
                <dd className="font-bold text-xl tracking-wide">Personal Information</dd>
            </section>
            <button type="button" title="Sign Out" onClick={handleLogOut}
                className="bg-danger p-3 rounded-md cursor-pointer font-medium text-white"
            >Sign Out</button>
        </div>
    )
}