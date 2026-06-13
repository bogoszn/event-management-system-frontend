"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getEventBySlug, formatPrice, formatDateLong, formatTime } from "@/lib/mockData";

const PinIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" />
    </svg>
);

const CalendarIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
    </svg>
);

const UsersIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9A9A9A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
);

const ArrowLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = use(params);
    const router = useRouter();
    const event = getEventBySlug(slug);

    const [quantities, setQuantities] = useState<Record<string, number>>({});

    if (!event) {
        return (
            <div className="min-h-screen bg-[#1E1E1E] text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-32">
                    <p className="text-[15px] font-semibold text-white mb-2">Event not found</p>
                    <Link href="/browse" className="text-[13px] text-[#9A9A9A] hover:text-white transition-colors">
                        ← Back to browse
                    </Link>
                </div>
            </div>
        );
    }

    const updateQty = (ticketId: string, delta: number, max: number) => {
        setQuantities(prev => {
            const current = prev[ticketId] || 0;
            const next = Math.max(0, Math.min(max, current + delta));
            return { ...prev, [ticketId]: next };
        });
    };

    const totalAmount = event.ticketTypes.reduce((sum, t) => {
        const qty = quantities[t.id] || 0;
        return sum + qty * t.price;
    }, 0);

    const totalQty = Object.values(quantities).reduce((sum, q) => sum + q, 0);

    const handleCheckout = () => {
        if (totalQty === 0) return;
        // Store selection for checkout page
        const selection = event.ticketTypes
            .filter(t => (quantities[t.id] || 0) > 0)
            .map(t => ({ ticketTypeId: t.id, name: t.name, price: t.price, quantity: quantities[t.id] }));
        sessionStorage.setItem("checkoutSelection", JSON.stringify({ eventSlug: event.slug, items: selection, total: totalAmount }));
        router.push("/checkout");
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white">
            <Navbar />

            {/* Back button */}
            <div className="px-6 lg:px-12 pt-6">
                <Link href="/browse" className="inline-flex items-center gap-2 px-4 py-2 border border-[#3A3A3A] rounded-lg text-[13px] text-white hover:bg-[#252525] transition-colors">
                    <ArrowLeft />
                    Back to browse
                </Link>
            </div>

            {/* Cover image */}
            <div className="px-6 lg:px-12 pt-5">
                <div className="h-[280px] lg:h-[360px] rounded-xl relative overflow-hidden" style={{ background: event.bg }}>
                    <span className="absolute bottom-4 left-4 text-[12px] font-medium px-3 py-1.5 rounded-md bg-black/50 border border-white/10 text-white backdrop-blur-sm">
                        {event.category.name}
                    </span>
                </div>
            </div>

            {/* Content */}
            <div className="px-6 lg:px-12 py-8 max-w-[1400px]">
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">

                    {/* ── LEFT COLUMN ── */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-[12px] px-2.5 py-1 rounded-full border border-[#3A3A3A] text-[#9A9A9A]">
                                {event.category.name}
                            </span>
                            <span className="text-[12px] text-[#6A6A6A]">·</span>
                            <span className="text-[12px] text-[#9A9A9A]">{event.city}</span>
                        </div>

                        <h1 className="text-[32px] lg:text-[38px] font-bold text-white tracking-tight mb-6 leading-tight">
                            {event.title}
                        </h1>

                        {/* Key details */}
                        <div className="flex flex-col gap-4 mb-8 pb-8 border-b border-[#2A2A2A]">
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5"><CalendarIcon /></div>
                                <div>
                                    <p className="text-[11px] text-[#6A6A6A] uppercase tracking-wider mb-0.5">Date &amp; time</p>
                                    <p className="text-[15px] font-semibold text-white">
                                        {formatDateLong(event.startTime)} · {formatTime(event.startTime)} – {formatTime(event.endTime)}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5"><PinIcon /></div>
                                <div>
                                    <p className="text-[11px] text-[#6A6A6A] uppercase tracking-wider mb-0.5">Location</p>
                                    <p className="text-[15px] font-semibold text-white">
                                        {event.venueType === "physical" ? event.venueAddress : "Online event"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <div className="mt-0.5"><UsersIcon /></div>
                                <div>
                                    <p className="text-[11px] text-[#6A6A6A] uppercase tracking-wider mb-0.5">Capacity</p>
                                    <p className="text-[15px] font-semibold text-white">
                                        {event.capacity.toLocaleString()} guests · {event.ticketTypes.reduce((s, t) => s + t.quantityRemaining, 0).toLocaleString()} tickets remaining
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* About */}
                        <div className="mb-8">
                            <p className="text-[11px] font-semibold text-[#6A6A6A] uppercase tracking-widest mb-3">About this event</p>
                            <div className="text-[14px] text-[#B0B0B0] leading-relaxed whitespace-pre-line">
                                {event.description}
                            </div>
                        </div>

                        {/* Organizer */}
                        <div>
                            <p className="text-[11px] font-semibold text-[#6A6A6A] uppercase tracking-widest mb-3">Organised by</p>
                            <div className="flex items-center gap-3 bg-[#252525] border border-[#2E2E2E] rounded-xl p-4">
                                <div className="w-11 h-11 rounded-full bg-[#2A2A2A] border border-[#3A3A3A] flex items-center justify-center flex-shrink-0">
                                    <span className="text-[14px] font-semibold text-white">
                                        {event.organizer.orgName.split(" ").map(w => w[0]).slice(0, 2).join("")}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-[14px] font-semibold text-white">{event.organizer.orgName}</p>
                                    <p className="text-[12px] text-[#6A6A6A]">{event.organizer.eventsCount} events · {event.organizer.rating} rating</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── RIGHT COLUMN — TICKET SELECTOR ── */}
                    <div>
                        <div className="bg-[#252525] border border-[#2E2E2E] rounded-xl p-5 lg:sticky lg:top-6">
                            <div className="mb-4">
                                <h2 className="text-[15px] font-semibold text-white mb-1">Select tickets</h2>
                                <p className="text-[12px] text-[#6A6A6A]">
                                    Sale ends {formatDateLong(event.ticketTypes[0]?.saleEnd || event.startTime)}
                                </p>
                            </div>

                            <div className="flex flex-col">
                                {event.ticketTypes.map((ticket, idx) => (
                                    <div key={ticket.id} className={`py-4 ${idx > 0 ? "border-t border-[#2A2A2A]" : ""}`}>
                                        <div className="flex items-start justify-between mb-1">
                                            <p className="text-[14px] font-semibold text-white">{ticket.name}</p>
                                            <p className="text-[14px] font-semibold text-white">{formatPrice(ticket.price, ticket.currency)}</p>
                                        </div>
                                        <p className="text-[12px] text-[#6A6A6A] mb-3">
                                            {!ticket.isSaleOpen ? "Sold out" : ticket.description}
                                        </p>

                                        {ticket.isSaleOpen ? (
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => updateQty(ticket.id, -1, ticket.quantityRemaining)}
                                                    disabled={(quantities[ticket.id] || 0) === 0}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#3A3A3A] text-white disabled:text-[#4A4A4A] disabled:cursor-not-allowed hover:bg-[#2A2A2A] transition-colors"
                                                >
                                                    −
                                                </button>
                                                <span className="text-[14px] font-medium text-white w-6 text-center">
                                                    {quantities[ticket.id] || 0}
                                                </span>
                                                <button
                                                    onClick={() => updateQty(ticket.id, 1, ticket.quantityRemaining)}
                                                    disabled={(quantities[ticket.id] || 0) >= ticket.quantityRemaining}
                                                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#3A3A3A] text-white disabled:text-[#4A4A4A] disabled:cursor-not-allowed hover:bg-[#2A2A2A] transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="inline-block px-3 py-1.5 rounded-lg bg-[#1E1E1E] border border-[#2A2A2A] text-[12px] text-[#5A5A5A]">
                                                Unavailable
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A] mb-4">
                                <span className="text-[14px] text-[#9A9A9A]">Total</span>
                                <span className="text-[18px] font-bold text-white">{formatPrice(totalAmount, event.currency)}</span>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={totalQty === 0}
                                className="w-full py-3.5 bg-white border border-[#3A3A3A] rounded-lg text-[14px] font-semibold text-[#111] hover:bg-[#E8E8E8] disabled:bg-[#2A2A2A] disabled:text-[#5A5A5A] disabled:cursor-not-allowed transition-colors"
                            >
                                {totalQty === 0 ? "Select tickets" : "Get tickets"}
                            </button>

                            <p className="text-center text-[11px] text-[#5A5A5A] mt-3">Powered by Paystack</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}