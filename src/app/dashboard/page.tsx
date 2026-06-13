"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getMe } from "@/lib/api";

export default function DashboardPage() {
    const [user, setUser] = useState<{ name: string; email: string; role: string; emailVerified: boolean } | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const data = await getMe();
                setUser(data);
            } catch {
                // token expired or invalid — middleware will redirect
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    return (
        <DashboardLayout>
            {loading ? (
                <div className="flex items-center justify-center h-64">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
            ) : (
                <>
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-[24px] font-bold text-white tracking-tight mb-1">
                            Welcome back, {user?.name?.split(" ")[0]}
                        </h1>
                        <p className="text-[13px] text-[#6A6A6A]">Here's what's happening with your account.</p>
                    </div>

                    {/* Email verification warning */}
                    {user && !user.emailVerified && (
                        <div className="bg-yellow-500/8 border border-yellow-500/20 rounded-xl px-5 py-4 mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EAB308" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                                <p className="text-[13px] text-yellow-400">Please verify your email address to access all features.</p>
                            </div>
                            <button className="text-[12px] text-yellow-400 font-medium underline">Resend email</button>
                        </div>
                    )}

                    {/* Quick stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        {[
                            { label: "Tickets purchased", value: "0", icon: "🎟" },
                            { label: "Events attended", value: "0", icon: "📅" },
                            { label: "Account status", value: "Active", icon: "✅" },
                        ].map(stat => (
                            <div key={stat.label} className="bg-[#252525] border border-[#2E2E2E] rounded-xl p-5">
                                <p className="text-[22px] mb-1">{stat.icon}</p>
                                <p className="text-[22px] font-bold text-white tracking-tight mb-1">{stat.value}</p>
                                <p className="text-[12px] text-[#6A6A6A]">{stat.label}</p>
                            </div>
                        ))}
                    </div>

                    {/* Quick actions */}
                    <div className="bg-[#252525] border border-[#2E2E2E] rounded-xl p-6 mb-6">
                        <h2 className="text-[14px] font-semibold text-white mb-4">Quick actions</h2>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/browse"
                                className="flex items-center gap-3 p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg hover:border-[#3A3A3A] transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                                </svg>
                                <div>
                                    <p className="text-[13px] font-medium text-white">Browse events</p>
                                    <p className="text-[11px] text-[#6A6A6A]">Discover events near you</p>
                                </div>
                            </Link>
                            <Link href="/dashboard/tickets"
                                className="flex items-center gap-3 p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg hover:border-[#3A3A3A] transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v2z" />
                                </svg>
                                <div>
                                    <p className="text-[13px] font-medium text-white">My tickets</p>
                                    <p className="text-[11px] text-[#6A6A6A]">View your purchased tickets</p>
                                </div>
                            </Link>
                            <Link href="/dashboard/profile"
                                className="flex items-center gap-3 p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg hover:border-[#3A3A3A] transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                                </svg>
                                <div>
                                    <p className="text-[13px] font-medium text-white">Edit profile</p>
                                    <p className="text-[11px] text-[#6A6A6A]">Update your information</p>
                                </div>
                            </Link>
                            <Link href="/dashboard/settings"
                                className="flex items-center gap-3 p-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg hover:border-[#3A3A3A] transition-colors">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="3" />
                                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
                                </svg>
                                <div>
                                    <p className="text-[13px] font-medium text-white">Settings</p>
                                    <p className="text-[11px] text-[#6A6A6A]">Change your password</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </>
            )}
        </DashboardLayout>
    );
}