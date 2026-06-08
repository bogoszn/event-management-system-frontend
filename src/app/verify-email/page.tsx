"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function VerifyEmailPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing verification token.");
            return;
        }

        const verify = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/verify-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || "Verification failed");
                setStatus("success");
                setMessage(data.message || "Email verified successfully.");
            } catch (err: unknown) {
                setStatus("error");
                setMessage(err instanceof Error ? err.message : "Verification failed");
            }
        };

        verify();
    }, [token]);

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

            {/* Body */}
            <div className="flex-1 flex items-center justify-center px-4">
                <div className="text-center w-full max-w-[400px]">

                    {/* Loading */}
                    {status === "loading" && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center mx-auto mb-5">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="2" strokeLinecap="round">
                                    <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                                        <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                                    </path>
                                </svg>
                            </div>
                            <h2 className="text-[20px] font-bold text-white mb-2">Verifying your email</h2>
                            <p className="text-[13px] text-[#6A6A6A]">Please wait a moment...</p>
                        </>
                    )}

                    {/* Success */}
                    {status === "success" && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-[#4CAF82]/10 border border-[#4CAF82]/30 flex items-center justify-center mx-auto mb-5">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4CAF82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                            <h2 className="text-[20px] font-bold text-white mb-2">Email verified</h2>
                            <p className="text-[13px] text-[#6A6A6A] mb-8">{message}</p>
                            <Link
                                href="/login"
                                className="inline-block px-6 py-3 bg-white rounded-lg text-[13px] font-semibold text-[#111] hover:bg-[#E8E8E8] transition-colors"
                            >
                                Sign in to your account
                            </Link>
                        </>
                    )}

                    {/* Error */}
                    {status === "error" && (
                        <>
                            <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E55A4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" y1="8" x2="12" y2="12" />
                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                </svg>
                            </div>
                            <h2 className="text-[20px] font-bold text-white mb-2">Verification failed</h2>
                            <p className="text-[13px] text-[#6A6A6A] mb-8">{message}</p>
                            <div className="flex flex-col gap-3 items-center">
                                <Link
                                    href="/register"
                                    className="inline-block px-6 py-3 bg-white rounded-lg text-[13px] font-semibold text-[#111] hover:bg-[#E8E8E8] transition-colors"
                                >
                                    Back to register
                                </Link>
                                <Link href="/login" className="text-[13px] text-[#9A9A9A] hover:text-white transition-colors">
                                    Already verified? Sign in
                                </Link>
                            </div>
                        </>
                    )}

                </div>
            </div>
        </div>
    );
}