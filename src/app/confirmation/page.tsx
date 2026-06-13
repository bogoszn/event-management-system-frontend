"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { formatPrice, formatDateLong, formatTime } from "@/lib/mockData";

type OrderConfirmation = {
    orderId: string;
    ticketCode: string;
    event: { title: string; startTime: string; venueAddress: string | null; bg: string };
    items: { ticketTypeId: string; name: string; price: number; quantity: number }[];
    subtotal: number;
    discount: number;
    serviceFee: number;
    total: number;
    attendee: { firstName: string; lastName: string; email: string };
};

const CheckCircle = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4CAF82" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="9 12 11 14 16 9" />
    </svg>
);

const DownloadIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" />
    </svg>
);

const ShareIcon = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
);

const QRPlaceholder = () => (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none">
        <rect x="0" y="0" width="9" height="9" rx="1.5" fill="white" />
        <rect x="13" y="0" width="9" height="9" rx="1.5" fill="white" />
        <rect x="0" y="13" width="9" height="9" rx="1.5" fill="white" />
        <rect x="14" y="14" width="3" height="3" fill="white" />
        <rect x="19" y="14" width="3" height="3" fill="white" />
        <rect x="14" y="19" width="3" height="3" fill="white" />
        <rect x="19" y="19" width="3" height="3" fill="white" />
    </svg>
);

const MailIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
    </svg>
);

export default function ConfirmationPage() {
    const [order, setOrder] = useState<OrderConfirmation | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const raw = sessionStorage.getItem("orderConfirmation");
        if (raw) setOrder(JSON.parse(raw));
        setLoading(false);
    }, []);

    if (loading) return (
        <div className="min-h-screen bg-[#1E1E1E] text-white">
            <Navbar />
        </div>
    );

    if (!order) {
        return (
            <div className="min-h-screen bg-[#1E1E1E] text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                    <p className="text-[15px] font-semibold text-white mb-2">No order found</p>
                    <p className="text-[13px] text-[#6A6A6A] mb-6">Browse events to make a purchase.</p>
                    <Link href="/browse" className="px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-[#111] hover:bg-[#E8E8E8] transition-colors">
                        Browse events
                    </Link>
                </div>
            </div>
        );
    }

    const totalQty = order.items.reduce((s, i) => s + i.quantity, 0);
    const ticketTypeLabel = order.items.length === 1 ? order.items[0].name : `${order.items.length} ticket types`;

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white">
            <Navbar />

            <div className="px-6 lg:px-12 py-8 max-w-[760px] mx-auto">

                {/* Success banner */}
                <div className="bg-[#4CAF82]/10 border border-[#4CAF82]/20 rounded-xl px-5 py-4 mb-8 flex items-center gap-4">
                    <CheckCircle />
                    <div>
                        <p className="text-[15px] font-semibold text-[#4CAF82]">Payment successful</p>
                        <p className="text-[13px] text-[#4CAF82]/80">Your ticket has been issued and sent to your email</p>
                    </div>
                </div>

                {/* Heading */}
                <div className="mb-6">
                    <h1 className="text-[26px] font-bold text-white tracking-tight mb-1.5">
                        You&apos;re going to {order.event.title.split("—")[0].trim()}
                    </h1>
                    <p className="text-[13px] text-[#6A6A6A]">
                        Order <span className="text-white font-medium">#{order.orderId}</span> · Paid via Paystack
                    </p>
                </div>

                {/* Ticket card */}
                <div className="bg-[#252525] border border-[#2E2E2E] rounded-xl overflow-hidden mb-6">
                    {/* Event header */}
                    <div className="p-5 flex items-center justify-between" style={{ background: order.event.bg }}>
                        <div>
                            <p className="text-[16px] font-semibold text-white leading-snug">{order.event.title}</p>
                            <p className="text-[13px] text-white/70 mt-1">
                                {formatDateLong(order.event.startTime)} · {formatTime(order.event.startTime)}
                            </p>
                            {order.event.venueAddress && (
                                <p className="text-[13px] text-white/70">{order.event.venueAddress}</p>
                            )}
                        </div>
                        <span className="text-[12px] font-medium px-3 py-1.5 rounded-md bg-black/30 border border-white/10 text-white whitespace-nowrap ml-4">
                            {ticketTypeLabel}
                        </span>
                    </div>

                    {/* Ticket body */}
                    <div className="p-5 flex items-start justify-between gap-6">
                        <div className="flex-1">
                            <div className="mb-4">
                                <p className="text-[11px] text-[#6A6A6A] uppercase tracking-wider mb-1">Attendee</p>
                                <p className="text-[15px] font-semibold text-white">{order.attendee.firstName} {order.attendee.lastName}</p>
                            </div>
                            <div className="mb-4">
                                <p className="text-[11px] text-[#6A6A6A] uppercase tracking-wider mb-1">Ticket type</p>
                                <p className="text-[15px] font-semibold text-white">
                                    {order.items.map(i => i.name).join(", ")} · {formatPrice(order.items[0]?.price ?? 0)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[11px] text-[#6A6A6A] uppercase tracking-wider mb-1">Quantity</p>
                                <p className="text-[15px] font-semibold text-white">{totalQty} ticket{totalQty !== 1 ? "s" : ""}</p>
                            </div>
                        </div>

                        {/* QR code */}
                        <div className="flex flex-col items-center gap-2 flex-shrink-0">
                            <div className="w-20 h-20 bg-[#1E1E1E] border border-[#3A3A3A] rounded-lg flex items-center justify-center">
                                <QRPlaceholder />
                            </div>
                            <p className="text-[11px] text-[#6A6A6A]">Scan at entry</p>
                        </div>
                    </div>

                    {/* Ticket code footer */}
                    <div className="px-5 py-4 border-t border-[#2A2A2A] border-dashed flex items-center justify-between">
                        <span className="text-[12px] font-mono text-[#6A6A6A]">{order.ticketCode}</span>
                        <span className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-[#4CAF82]/10 border border-[#4CAF82]/30 text-[#4CAF82]">
                            Active
                        </span>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="grid grid-cols-2 gap-3 mb-8">
                    <button className="flex items-center justify-center gap-2 py-3 border border-[#3A3A3A] rounded-lg text-[13px] font-medium text-white hover:bg-[#252525] transition-colors">
                        <DownloadIcon /> Download ticket
                    </button>
                    <button className="flex items-center justify-center gap-2 py-3 border border-[#3A3A3A] rounded-lg text-[13px] font-medium text-white hover:bg-[#252525] transition-colors">
                        <ShareIcon /> Share
                    </button>
                </div>

                {/* Order summary */}
                <div className="bg-[#252525] border border-[#2E2E2E] rounded-xl overflow-hidden mb-6">
                    <p className="text-[11px] font-semibold text-[#6A6A6A] uppercase tracking-widest px-5 pt-4 pb-3">
                        Order summary
                    </p>
                    <div className="border-t border-[#2A2A2A]">
                        {order.items.map(item => (
                            <div key={item.ticketTypeId} className="flex items-center justify-between px-5 py-3 border-b border-[#2A2A2A] text-[13px]">
                                <span className="text-[#9A9A9A]">{item.name} × {item.quantity}</span>
                                <span className="text-white font-medium">{formatPrice(item.price * item.quantity)}</span>
                            </div>
                        ))}
                        {order.discount > 0 && (
                            <div className="flex items-center justify-between px-5 py-3 border-b border-[#2A2A2A] text-[13px]">
                                <span className="text-[#4CAF82]">Discount</span>
                                <span className="text-[#4CAF82] font-medium">−{formatPrice(order.discount)}</span>
                            </div>
                        )}
                        <div className="flex items-center justify-between px-5 py-3 border-b border-[#2A2A2A] text-[13px]">
                            <span className="text-[#9A9A9A]">Service fee</span>
                            <span className="text-white font-medium">{formatPrice(order.serviceFee)}</span>
                        </div>
                        <div className="flex items-center justify-between px-5 py-3.5 bg-[#1E1E1E]">
                            <span className="text-[14px] font-semibold text-white">Total paid</span>
                            <span className="text-[16px] font-bold text-white">{formatPrice(order.total)}</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-2 text-[12px] text-[#6A6A6A] mb-8">
                    <MailIcon /> Ticket sent to {order.attendee.email}
                </div>

                {/* Bottom actions */}
                <div className="flex flex-col items-center gap-3">
                    <Link href="/dashboard/tickets" className="px-6 py-3 bg-white rounded-lg text-[13px] font-semibold text-[#111] hover:bg-[#E8E8E8] transition-colors">
                        View my tickets
                    </Link>
                    <Link href="/browse" className="text-[13px] text-[#9A9A9A] hover:text-white transition-colors">
                        ← Continue browsing events
                    </Link>
                </div>
            </div>
        </div>
    );
}