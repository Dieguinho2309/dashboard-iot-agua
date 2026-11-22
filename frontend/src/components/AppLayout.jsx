import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { isMock } from "../lib/api";

export default function AppLayout({ readings, children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const live = !isMock && readings.status === "ok";

    return (
        <div className="flex min-h-dvh bg-[#0b101e] text-slate-300">
            <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} live={live} />

            <div className="flex min-w-0 flex-1 flex-col">
                <Header
                    onMenu={() => setMenuOpen(true)}
                    live={live}
                    status={readings.status}
                    error={readings.error}
                />

                <main className="flex flex-1 flex-col gap-5 p-4 sm:p-6">
                    {children}
                    <Footer />
                </main>
            </div>
        </div>
    );
}
