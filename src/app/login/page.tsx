"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { saveTokens, saveUser } from "@/lib/auth";

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPass, setShowPass] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const e: Record<string, string> = {};
        if (!email) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
        if (!password) e.password = "Password is required";
        return e;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setLoading(true);

        // ── MOCK AUTH ──────────────────────────────────────────────
        // No real backend exists yet. This simulates a successful login
        // so the dashboard and other protected pages can be demoed.
        // Replace with a real API call once a backend is available.
        await new Promise(r => setTimeout(r, 600)); // simulate network delay

        const mockUser = {
            id: "mock-user-1",
            name: email.split("@")[0].replace(/[._]/g, " ").replace(/\b\w/g, c => c.toUpperCase()),
            email,
            role: "attendee",
            emailVerified: true,
        };

        saveTokens("mock-access-token", "mock-refresh-token");
        saveUser(mockUser);
        // ───────────────────────────────────────────────────────────

        router.push("/dashboard");
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] flex flex-col">
            {/* Navbar */}
            <nav className="h-14 border-b border-[#2A2A2A] flex items-center justify-between px-12">
                <Link href="/" className="font-bold text-[17px] tracking-tight text-white">
                    entri<span className="text-[#4CAF82]">.</span>ng
                </Link>
                <div className="flex items-center gap-8">
                    <Link href="/browse" className="text-[13px] text-[#9A9A9A]">Browse</Link>
                    <Link href="#" className="text-[13px] text-[#9A9A9A]">For organizers</Link>
                </div>
                <div className="flex gap-2">
                    <Link href="/login" className="px-4 py-2 text-[13px] border border-[#3A3A3A] rounded-lg text-white">Sign in</Link>
                    <Link href="/register" className="px-4 py-2 text-[13px] bg-white rounded-lg text-[#111] font-semibold">Get started</Link>
                </div>
            </nav>

            {/* Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[400px]">

                    {/* Tab switcher */}
                    <div className="flex bg-[#252525] border border-[#2A2A2A] rounded-xl p-1 mb-8">
                        <button className="flex-1 py-2.5 rounded-lg bg-[#2E2E2E] text-white text-[13px] font-semibold">
                            Sign in
                        </button>
                        <Link href="/register" className="flex-1 py-2.5 rounded-lg text-[#6A6A6A] text-[13px] text-center hover:text-white transition-colors">
                            Get started
                        </Link>
                    </div>

                    <div className="mb-7">
                        <h1 className="text-[22px] font-bold text-white tracking-tight mb-1.5">Welcome back</h1>
                        <p className="text-[13px] text-[#6A6A6A]">Sign in to access your tickets and events</p>
                    </div>

                    {/* Demo notice */}
                    <div className="bg-[#6BBFFF]/8 border border-[#6BBFFF]/20 rounded-lg px-4 py-3 mb-5 text-[12px] text-[#6BBFFF] leading-relaxed">
                        This is a portfolio demo. Enter any email and password to sign in — no real account needed.
                    </div>

                    <form onSubmit={handleSubmit}>
                        {/* Email */}
                        <div className="mb-4">
                            <label className="block text-[13px] text-[#9A9A9A] mb-2">Email address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="email"
                                className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
                            />
                            {errors.email && <p className="text-red-400 text-[12px] mt-1.5">{errors.email}</p>}
                        </div>

                        {/* Password */}
                        <div className="mb-2">
                            <label className="block text-[13px] text-[#9A9A9A] mb-2">Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 pr-11 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
                                />
                                <button type="button" onClick={() => setShowPass(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] hover:text-[#9A9A9A]">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        {showPass
                                            ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></>
                                            : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" /><line x1="1" y1="1" x2="23" y2="23" /></>
                                        }
                                    </svg>
                                </button>
                            </div>
                            {errors.password && <p className="text-red-400 text-[12px] mt-1.5">{errors.password}</p>}
                        </div>

                        <div className="text-right mb-5">
                            <Link href="/forgot-password" className="text-[12px] text-[#7A7A7A] hover:text-white transition-colors">
                                Forgot password?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-white border border-[#3A3A3A] rounded-lg text-[14px] font-semibold text-[#111] hover:bg-[#E8E8E8] disabled:bg-[#2A2A2A] disabled:text-[#5A5A5A] disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-[13px] text-[#6A6A6A]">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-white font-semibold hover:underline">
                            Get started
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}