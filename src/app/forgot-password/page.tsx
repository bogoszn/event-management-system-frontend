"use client";

import Link from "next/link";
import { useState } from "react";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const validate = () => {
        if (!email) return "Email is required";
        if (!/\S+@\S+\.\S+/.test(email)) return "Enter a valid email";
        return "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const err = validate();
        if (err) { setError(err); return; }

        setLoading(true);
        setError("");
        try {
            await forgotPassword(email);
            setSubmitted(true);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] flex flex-col">
            {/* Navbar */}
            <nav className="h-14 border-b border-[#2A2A2A] flex items-center justify-between px-12">
                <Link href="/" className="font-bold text-[17px] tracking-tight text-white">
                    entri<span className="text-[#4CAF82]">.</span>ng
                </Link>
                <div className="flex gap-2">
                    <Link href="/login" className="px-4 py-2 text-[13px] border border-[#3A3A3A] rounded-lg text-white">Sign in</Link>
                    <Link href="/register" className="px-4 py-2 text-[13px] bg-white rounded-lg text-[#111] font-semibold">Get started</Link>
                </div>
            </nav>

            {/* Form */}
            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[400px]">

                    {submitted ? (
                        // ── Success state ──
                        <div className="text-center">
                            <div className="w-14 h-14 rounded-full bg-[#4CAF82]/10 border border-[#4CAF82]/30 flex items-center justify-center mx-auto mb-5">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4CAF82" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                            </div>
                            <h2 className="text-[20px] font-bold text-white tracking-tight mb-2">Check your inbox</h2>
                            <p className="text-[13px] text-[#6A6A6A] leading-relaxed mb-1">
                                If an account exists for
                            </p>
                            <p className="text-[13px] text-[#9A9A9A] mb-4">{email}</p>
                            <p className="text-[13px] text-[#6A6A6A] leading-relaxed mb-8">
                                you&apos;ll receive a password reset link shortly.
                            </p>
                            <Link href="/login" className="text-[13px] text-white underline hover:text-[#9A9A9A] transition-colors">
                                Back to sign in
                            </Link>
                        </div>
                    ) : (
                        // ── Form state ──
                        <>
                            <div className="mb-8">
                                <h1 className="text-[22px] font-bold text-white tracking-tight mb-2">Forgot your password?</h1>
                                <p className="text-[13px] text-[#6A6A6A] leading-relaxed">
                                    Enter your email address and we&apos;ll send you a link to reset your password.
                                </p>
                            </div>

                            {error && (
                                <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-5 text-[13px] text-red-400">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="mb-6">
                                    <label className="block text-[13px] text-[#9A9A9A] mb-2">Email address</label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={e => { setEmail(e.target.value); setError(""); }}
                                        placeholder="your email address"
                                        autoComplete="email"
                                        className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3.5 bg-white border border-[#3A3A3A] rounded-lg text-[14px] font-semibold text-[#111] hover:bg-[#E8E8E8] disabled:bg-[#2A2A2A] disabled:text-[#5A5A5A] disabled:cursor-not-allowed transition-colors"
                                >
                                    {loading ? "Sending..." : "Send reset link"}
                                </button>
                            </form>

                            <p className="text-center mt-6 text-[13px] text-[#6A6A6A]">
                                Remember your password?{" "}
                                <Link href="/login" className="text-white font-semibold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}