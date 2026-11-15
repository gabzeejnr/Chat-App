import { appName } from "../data";
import { Outlet } from "react-router-dom";
import styles from "./AuthLayout.module.scss";

export default function UserAuthentication() {
    return (
        <main className={`${styles["auth-layout"]} min-h-screen flex items-center justify-center px-5`}>
            <div className="w-full max-w-md flex flex-col items-center gap-12">
                <h2 className="text-4xl">{appName}</h2>
                <section className={`${styles["auth-content"]} w-full`}>
                    <Outlet />
                </section>
            </div>
        </main>
    );
}
