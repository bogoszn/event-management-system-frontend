"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import Link from "next/link";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type Ticket = {
    id: string;
    ticketCode: string;
    eventTitle: string;
    eventStartTime: string;
    ticketType: string;
    status: "active" | "used" | "cancelled";
    qrCodeUrl: string;
    purchasedAt: string;
};

const statusStyles: Record<string, string> = {
    active: "bg-[#4CAF82]/10 border-[#4CAF82]/30 text-[#4CAF82]",
    used: "bg-[#6A6A6A]/10 border-[#6A6A6A]/30 text-[#6A6A6A]",
    cancelled: "bg-red-500/10 border-red-500/20 text-red-400",
};

export default function TicketsPage() {
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const fetchTickets = async () => {
            try {
                const token = localStorage.getItem("accessToken");
                const res = await fetch(`${API_URL}/users/me/tickets`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const data = await res.json();
                setTickets(data.data || []);
            } catch {
                setTickets([]);
            } finally {
                setLoading(false);
            }
        };
        fetchTickets();
    }, []);

    const filtered = filter === "all" ? tickets : tickets.filter(t => t.status === filter);

    return (
        <DashboardLayout>
            <div className="mb-8">
                <h1 className="text-[24px] font-bold text-white tracking-tight mb-1">My Tickets</h1>
                <p className="text-[13px] text-[#6A6A6A]">All your purchased tickets in one place.</p>
            </div>

            {/* Filter tabs */}
            <div className="flex gap-2 mb-6">
                {["all", "active", "used", "cancelled"].map(f => (
                    <button key={f} onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-lg text-[12px] font-medium border capitalize transition-colors ${filter === f
                                ? "bg-[#2A2A2A] border-[#4A4A4A] text-white"
                                : "bg-transparent border-[#2A2A2A] text-[#6A6A6A] hover:text-white"
                            }`}>
                        {f}
                    </button>
                ))}
            </div>

            {loading ? (
                <div className="flex items-center justify-center h-48">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round">
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83">
                            <animateTransform attributeName="transform" type="rotate" from="0 12 12" to="360 12 12" dur="0.8s" repeatCount="indefinite" />
                        </path>
                    </svg>
                </div>
            ) : filtered.length === 0 ? (
                <div className="text-center py-16 bg-[#252525] border border-[#2E2E2E] rounded-xl">
                    <p className="text-[32px] mb-3">🎟</p>
                    <p className="text-[15px] font-semibold text-white mb-2">No tickets yet</p>
                    <p className="text-[13px] text-[#6A6A6A] mb-6">You haven&apos;t purchased any tickets yet.</p>
                    <Link href="/browse"
                        className="inline-block px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-[#111] hover:bg-[#E8E8E8] transition-colors">
                        Browse events
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {filtered.map(ticket => (
                        <div key={ticket.id} className="bg-[#252525] border border-[#2E2E2E] rounded-xl p-5 flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded border ${statusStyles[ticket.status]}`}>
                                        {ticket.status}
                                    </span>
                                    <span className="text-[11px] text-[#5A5A5A]">{ticket.ticketType}</span>
                                </div>
                                <p className="text-[15px] font-semibold text-white mb-1">{ticket.eventTitle}</p>
                                <p className="text-[12px] text-[#6A6A6A]">
                                    {new Date(ticket.eventStartTime).toLocaleDateString("en-NG", {
                                        weekday: "short", day: "numeric", month: "short", year: "numeric"
                                    })}
                                </p>
                                <p className="text-[11px] text-[#4A4A4A] mt-1 font-mono">{ticket.ticketCode}</p>
                            </div>
                            <div className="flex items-center gap-3">
                                {ticket.status === "active" && (
                                    <a href={ticket.qrCodeUrl} target="_blank" rel="noopener noreferrer"
                                        className="px-4 py-2 border border-[#3A3A3A] rounded-lg text-[12px] text-white hover:bg-[#2A2A2A] transition-colors">
                                        View QR
                                    </a>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}