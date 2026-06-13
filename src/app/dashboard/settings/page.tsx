"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function SettingsPage() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [apiError, setApiError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(p => ({ ...p, [f]: e.target.value }));

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.currentPassword) e.currentPassword = "Current password is required";
    if (!form.newPassword) e.newPassword = "New password is required";
    else if (form.newPassword.length < 8) e.newPassword = "Minimum 8 characters";
    else if (!/(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/.test(form.newPassword))
      e.newPassword = "Include uppercase, number & special character";
    if (form.newPassword !== form.confirm) e.confirm = "Passwords don't match";
    return e;
  };

  const strength = [
    form.newPassword.length >= 8,
    /[A-Z]/.test(form.newPassword),
    /[0-9]/.test(form.newPassword),
    /[!@#$%^&*]/.test(form.newPassword),
  ].filter(Boolean).length;

  const strengthColor = ["", "#E55A4E", "#E59A4E", "#6BBFFF", "#4CAF82"][strength];
  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong"][strength];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    setSuccess("");
    if (Object.keys(errs).length) return;

    setLoading(true);
    setApiError("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/users/me/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Password change failed");

      setSuccess("Password changed successfully.");
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err: unknown) {
      setApiError(err instanceof Error ? err.message : "Password change failed");
    } finally {
      setLoading(false);
    }
  };

  const eyeBtn = (show: boolean, toggle: () => void) => (
    <button type="button" onClick={toggle}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5A5A5A] hover:text-[#9A9A9A]">
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        {show
          ? <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
          : <><path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></>
        }
      </svg>
    </button>
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-white tracking-tight mb-1">Settings</h1>
        <p className="text-[13px] text-[#6A6A6A]">Manage your account security.</p>
      </div>

      <div className="max-w-lg">
        <div className="bg-[#252525] border border-[#2E2E2E] rounded-xl p-6">
          <h2 className="text-[14px] font-semibold text-white mb-1">Change password</h2>
          <p className="text-[12px] text-[#6A6A6A] mb-6">
            Choose a strong password you don&apos;t use elsewhere.
          </p>

          {success && (
            <div className="bg-[#4CAF82]/10 border border-[#4CAF82]/20 rounded-lg px-4 py-3 mb-5 text-[13px] text-[#4CAF82]">
              {success}
            </div>
          )}
          {apiError && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-5 text-[13px] text-red-400">
              {apiError}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Current password */}
            <div className="mb-4">
              <label className="block text-[13px] text-[#9A9A9A] mb-2">Current password</label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={form.currentPassword}
                  onChange={set("currentPassword")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 pr-11 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
                />
                {eyeBtn(showCurrent, () => setShowCurrent(s => !s))}
              </div>
              {errors.currentPassword && <p className="text-red-400 text-[12px] mt-1.5">{errors.currentPassword}</p>}
            </div>

            {/* New password */}
            <div className="mb-4">
              <label className="block text-[13px] text-[#9A9A9A] mb-2">New password</label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={form.newPassword}
                  onChange={set("newPassword")}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 pr-11 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
                />
                {eyeBtn(showNew, () => setShowNew(s => !s))}
              </div>
              {form.newPassword.length > 0 && (
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
              {errors.newPassword && <p className="text-red-400 text-[12px] mt-1.5">{errors.newPassword}</p>}
            </div>

            {/* Confirm */}
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
                {eyeBtn(showConfirm, () => setShowConfirm(s => !s))}
              </div>
              {errors.confirm && <p className="text-red-400 text-[12px] mt-1.5">{errors.confirm}</p>}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-white border border-[#3A3A3A] rounded-lg text-[14px] font-semibold text-[#111] hover:bg-[#E8E8E8] disabled:bg-[#2A2A2A] disabled:text-[#5A5A5A] disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}