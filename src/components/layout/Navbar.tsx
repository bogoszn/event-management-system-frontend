"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuth, getUser, isAuthenticated } from "@/lib/auth";

export default function Navbar() {
    const router = useRouter();
    const [authed, setAuthed] = useState(false);
    const [user, setUser] = useState<{ name: string; role: string } | null>(null);

    useEffect(() => {
        setAuthed(isAuthenticated());
        setUser(getUser());
    }, []);

    const handleLogout = () => {
        clearAuth();
        router.push("/");
    };

    return (
        <nav className="h-14 border-b border-[#2A2A2A] flex items-center justify-between px-12 bg-[#1E1E1E]">
            <Link href="/" className="font-bold text-[17px] tracking-tight text-white">
                entri<span className="text-[#4CAF82]">.</span>ng
            </Link>

            <div className="flex items-center gap-8">
                <Link href="/browse" className="text-[13px] text-[#9A9A9A] hover:text-white transition-colors">
                    Browse
                </Link>
                <Link href="#" className="text-[13px] text-[#9A9A9A] hover:text-white transition-colors">
                    For organizers
                </Link>
            </div>

            <div className="flex items-center gap-2">
                {authed ? (
                    <>
                        <span className="text-[13px] text-[#9A9A9A] mr-2">{user?.name}</span>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 text-[13px] border border-[#3A3A3A] rounded-lg text-white hover:bg-[#2A2A2A] transition-colors"
                        >
                            Sign out
                        </button>
                    </>
                ) : (
                    <>
                        <Link href="/login" className="px-4 py-2 text-[13px] border border-[#3A3A3A] rounded-lg text-white hover:bg-[#2A2A2A] transition-colors">
                            Sign in
                        </Link>
                        <Link href="/register" className="px-4 py-2 text-[13px] bg-white rounded-lg text-[#111] font-semibold hover:bg-[#E8E8E8] transition-colors">
                            Get started
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}