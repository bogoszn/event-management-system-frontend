"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { resetPassword } from "@/lib/api";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [form, setForm] = useState({ password: "", confirm: "" });
    const [showPass, setShowPass] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [apiError, setApiError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(p => ({ ...p, [f]: e.target.value }));

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.password) e.password = "Password is required";
        else if (form.password.length < 8) e.password = "Minimum 8 characters";
        else if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(form.password))
            e.password = "Include uppercase, number & special character";
        if (form.password !== form.confirm) e.confirm = "Passwords don't match";
        return e;
    };

    const strength = [
        form.password.length >= 8,
        /[A-Z]/.test(form.password),
        /[0-9]/.test(form.password),
        /[!@#$%^&*]/.test(form.password),
    ].filter(Boolean).length;

    const strengthColor = ["", "#E55A4E", "#E59A4E", "#6BBFFF", "#4CAF82"][strength];
    const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;
        if (!token) { setApiError("Invalid or missing reset token."); return; }

        setLoading(true);
        setApiError("");
        try {
            await resetPassword(token, form.password);
            setSuccess(true);
        } catch (err: unknown) {
            setApiError(err instanceof Error ? err.message : "Reset failed");
        } finally {
            setLoading(false);
        }
    };

    if (!token) return (
        <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto mb-5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#E55A4E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                </div>
                <h2 className="text-[20px] font-bold text-white mb-2">Invalid reset link</h2>
                <p className="text-[13px] text-[#6A6A6A] mb-6">This link is invalid or has expired.</p>
                <Link href="/forgot-password" className="text-[13px] text-white underline">
                    Request a new one
                </Link>
            </div>
        </div>
    );

    if (success) return (
        <div className="min-h-screen bg-[#1E1E1E] flex items-center justify-center px-4">
            <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-[#4CAF82]/10 border border-[#4CAF82]/30 flex items-center justify-center mx-auto mb-5">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4CAF82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                    </svg>
                </div>
                <h2 className="text-[20px] font-bold text-white mb-2">Password reset</h2>
                <p className="text-[13px] text-[#6A6A6A] mb-6">Your password has been updated successfully.</p>
                <Link href="/login" className="inline-block px-6 py-3 bg-white rounded-lg text-[13px] font-semibold text-[#111] hover:bg-[#E8E8E8] transition-colors">
                    Sign in
                </Link>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-[#1E1E1E] flex flex-col">
            <nav className="h-14 border-b border-[#2A2A2A] flex items-center justify-between px-12">
                <Link href="/" className="font-bold text-[17px] tracking-tight text-white">
                    entri<span className="text-[#4CAF82]">.</span>ng
                </Link>
                <div className="flex gap-2">
                    <Link href="/login" className="px-4 py-2 text-[13px] border border-[#3A3A3A] rounded-lg text-white">Sign in</Link>
                    <Link href="/register" className="px-4 py-2 text-[13px] bg-white rounded-lg text-[#111] font-semibold">Get started</Link>
                </div>
            </nav>

            <div className="flex-1 flex items-center justify-center px-4 py-12">
                <div className="w-full max-w-[400px]">
                    <div className="mb-8">
                        <h1 className="text-[22px] font-bold text-white tracking-tight mb-2">Set new password</h1>
                        <p className="text-[13px] text-[#6A6A6A]">
                            Must be at least 8 characters with an uppercase letter, number and special character.
                        </p>
                    </div>

                    {apiError && (
                        <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-5 text-[13px] text-red-400">
                            {apiError}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-[13px] text-[#9A9A9A] mb-2">New password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    value={form.password}
                                    onChange={set("password")}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 pr-11 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
                                />
                                <button type="button" onClick={() => setShowPass(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] hover:text-[#9A9A9A]">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>
                            {form.password.length > 0 && (
                                <div className="mt-2 mb-1">
                                    <div className="flex gap-1 mb-1">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="flex-1 h-0.5 rounded-full transition-colors"
                                                style={{ background: i <= strength ? strengthColor : "#3A3A3A" }} />
                                        ))}
                                    </div>
                                    <p className="text-[11px]" style={{ color: strengthColor }}>{strengthLabel}</p>
                                </div>
                            )}
                            {errors.password && <p className="text-red-400 text-[12px] mt-1.5">{errors.password}</p>}
                        </div>

                        <div className="mb-6">
                            <label className="block text-[13px] text-[#9A9A9A] mb-2">Confirm new password</label>
                            <div className="relative">
                                <input
                                    type={showConfirm ? "text" : "password"}
                                    value={form.confirm}
                                    onChange={set("confirm")}
                                    placeholder="••••••••"
                                    autoComplete="new-password"
                                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 pr-11 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
                                />
                                <button type="button" onClick={() => setShowConfirm(s => !s)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] hover:text-[#9A9A9A]">
                                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>
                            {errors.confirm && <p className="text-red-400 text-[12px] mt-1.5">{errors.confirm}</p>}
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3.5 bg-white border border-[#3A3A3A] rounded-lg text-[14px] font-semibold text-[#111] hover:bg-[#E8E8E8] disabled:bg-[#2A2A2A] disabled:text-[#5A5A5A] disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? "Resetting..." : "Reset password"}
                        </button>
                    </form>

                    <p className="text-center mt-6 text-[13px] text-[#6A6A6A]">
                        Remember your password?{" "}
                        <Link href="/login" className="text-white font-semibold hover:underline">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#1E1E1E]" />}>
            <ResetPasswordForm />
        </Suspense>
    );
}