"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { clearAuth, getUser, isAuthenticated } from "@/lib/auth";

const navItems = [
    {
        label: "Overview",
        href: "/dashboard",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
            </svg>
        ),
    },
    {
        label: "My Tickets",
        href: "/dashboard/tickets",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
            </svg>
        ),
    },
    {
        label: "Profile",
        href: "/dashboard/profile",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
            </svg>
        ),
    },
    {
        label: "Settings",
        href: "/dashboard/settings",
        icon: (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="3" />
                <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
        ),
    },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }
        setUser(getUser());
    }, [router]);

    const handleLogout = () => {
        clearAuth();
        router.push("/");
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] flex flex-col">
            {/* Top navbar */}
            <nav className="h-14 border-b border-[#2A2A2A] flex items-center justify-between px-8 bg-[#1E1E1E] flex-shrink-0">
                <Link href="/" className="font-bold text-[17px] tracking-tight text-white">
                    entri<span className="text-[#4CAF82]">.</span>ng
                </Link>
                <div className="flex items-center gap-3">
                    <span className="text-[13px] text-[#9A9A9A]">{user?.email}</span>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 text-[13px] border border-[#3A3A3A] rounded-lg text-white hover:bg-[#2A2A2A] transition-colors"
                    >
                        Sign out
                    </button>
                </div>
            </nav>

            <div className="flex flex-1">
                {/* Sidebar */}
                <aside className="w-56 border-r border-[#2A2A2A] flex flex-col py-6 px-4 flex-shrink-0">
                    {/* User info */}
                    <div className="mb-8 px-2">
                        <div className="w-10 h-10 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center mb-3">
                            <span className="text-[14px] font-semibold text-white">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>
                        <p className="text-[13px] font-semibold text-white truncate">{user?.name}</p>
                        <p className="text-[11px] text-[#6A6A6A] capitalize">{user?.role}</p>
                    </div>

                    {/* Nav items */}
                    <nav className="flex flex-col gap-1">
                        {navItems.map(item => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] transition-colors ${isActive
                                            ? "bg-[#2A2A2A] text-white font-medium"
                                            : "text-[#7A7A7A] hover:text-white hover:bg-[#252525]"
                                        }`}
                                >
                                    <span className={isActive ? "text-white" : "text-[#5A5A5A]"}>
                                        {item.icon}
                                    </span>
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Browse events link */}
                    <div className="mt-auto px-2">
                        <Link
                            href="/browse"
                            className="flex items-center gap-2 text-[12px] text-[#6A6A6A] hover:text-white transition-colors"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            Browse events
                        </Link>
                    </div>
                </aside>

                {/* Main content */}
                <main className="flex-1 p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}