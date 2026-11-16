import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AUTH } from "../apis/axios";
import { Eye, EyeOff } from "../libs";
import { useUser } from "../context/UserContext";
import ThemeButton from "../components/Buttons";
import type { SubmitEvent } from "react";
import type { User } from "@chat-app/shared";

export default function Login() {
    const { setUser } = useUser();
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    async function handleLogin(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        try {
            const { data } = await AUTH.post<{
                message: string;
                data: NonNullable<User>
            }>("/login", { email, password });
            setUser(data.data);
            navigate("/", { replace: true });
        } catch (err) {
            console.error(err);
        }
    }

    return (
        <form onSubmit={handleLogin} className="w-full p-8 flex flex-col gap-6">
            <div>
                <p className="text-sm text-muted">Welcome back</p>
                <h3 className="text-2xl font-semibold mt-2 text-foreground">
                    Sign in to your account
                </h3>
            </div>

            <input type="email" autoComplete="email" placeholder="Email address" value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
            />

            <div className="relative">
                <input type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="Password" value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none focus:border-accent"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)} className="absolute top-1/2 -translate-y-1/2 right-5 transition-all duration-500">
                    {showPassword ? <EyeOff strokeWidth={1.5} /> : <Eye strokeWidth={1.5} />}
                </button>
            </div>


            <ThemeButton type="submit">Sign in</ThemeButton>

            <p className="text-sm text-center text-muted">
                New here?{" "}
                <Link to="/auth/register" className="font-semibold text-accent">
                    Create an account
                </Link>
            </p>
        </form>
    );
}
