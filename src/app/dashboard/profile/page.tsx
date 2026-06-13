"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { getMe } from "@/lib/api";
import { saveUser } from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
  phone?: string;
  emailVerified: boolean;
  createdAt: string;
};

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [form, setForm] = useState({ name: "", phone: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe();
        setUser(data);
        setForm({ name: data.name || "", phone: data.phone || "" });
      } catch {
        setError("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess("");
    setError("");

    try {
      const token = localStorage.getItem("accessToken");
      const res = await fetch(`${API_URL}/users/me`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      setSuccess("Profile updated successfully.");
      const updatedUser = { ...user, ...data.user };
      setUser(updatedUser as UserProfile);
      saveUser(updatedUser);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite"/>
          </path>
        </svg>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[24px] font-bold text-white tracking-tight mb-1">Profile</h1>
        <p className="text-[13px] text-[#6A6A6A]">Manage your personal information.</p>
      </div>

      <div className="max-w-lg">
        {/* Avatar + role */}
        <div className="flex items-center gap-4 mb-8 bg-[#252525] border border-[#2E2E2E] rounded-xl p-5">
          <div className="w-14 h-14 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center flex-shrink-0">
            <span className="text-[20px] font-semibold text-white">
              {user?.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <div>
            <p className="text-[15px] font-semibold text-white">{user?.name}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[11px] px-2 py-0.5 rounded border border-[#3A3A3A] text-[#9A9A9A] capitalize">
                {user?.role}
              </span>
              {user?.emailVerified ? (
                <span className="text-[11px] px-2 py-0.5 rounded border border-[#4CAF82]/30 bg-[#4CAF82]/10 text-[#4CAF82]">
                  Verified
                </span>
              ) : (
                <span className="text-[11px] px-2 py-0.5 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-400">
                  Unverified
                </span>
              )}
            </div>
          </div>
        </div>

        {success && (
          <div className="bg-[#4CAF82]/10 border border-[#4CAF82]/20 rounded-lg px-4 py-3 mb-5 text-[13px] text-[#4CAF82]">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3 mb-5 text-[13px] text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Email — read only */}
          <div className="mb-4">
            <label className="block text-[13px] text-[#9A9A9A] mb-2">Email address</label>
            <input
              type="email"
              value={user?.email || ""}
              disabled
              className="w-full bg-[#1E1E1E] border border-[#2A2A2A] rounded-lg px-4 py-3 text-[14px] text-[#6A6A6A] outline-none cursor-not-allowed"
            />
            <p className="text-[11px] text-[#4A4A4A] mt-1.5">Email address cannot be changed.</p>
          </div>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-[13px] text-[#9A9A9A] mb-2">Full name</label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-[14px] text-white outline-none focus:border-[#5A5A5A] transition-colors"
            />
          </div>

          {/* Phone */}
          <div className="mb-6">
            <label className="block text-[13px] text-[#9A9A9A] mb-2">Phone number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
              placeholder="+234 800 000 0000"
              className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-white border border-[#3A3A3A] rounded-lg text-[14px] font-semibold text-[#111] hover:bg-[#E8E8E8] disabled:bg-[#2A2A2A] disabled:text-[#5A5A5A] disabled:cursor-not-allowed transition-colors"
          >
            {saving ? "Saving..." : "Save changes"}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}