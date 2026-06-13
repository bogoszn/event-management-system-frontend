"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { getEventBySlug, formatPrice, formatDate } from "@/lib/mockData";
import { getUser } from "@/lib/auth";

const ArrowLeft = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
    </svg>
);

const LockIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
);

type CheckoutSelection = {
    eventSlug: string;
    items: { ticketTypeId: string; name: string; price: number; quantity: number }[];
    total: number;
};

const SERVICE_FEE_RATE = 0.05; // 5% service fee

export default function CheckoutPage() {
    const router = useRouter();
    const [selection, setSelection] = useState<CheckoutSelection | null>(null);
    const [loading, setLoading] = useState(true);

    const [form, setForm] = useState({ firstName: "", lastName: "", email: "", phone: "" });
    const [promoCode, setPromoCode] = useState("");
    const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
    const [promoError, setPromoError] = useState("");
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const raw = sessionStorage.getItem("checkoutSelection");
        if (!raw) {
            setLoading(false);
            return;
        }
        setSelection(JSON.parse(raw));

        // Pre-fill from logged-in user
        const user = getUser();
        if (user) {
            const [first, ...rest] = (user.name || "").split(" ");
            setForm(f => ({ ...f, firstName: first || "", lastName: rest.join(" ") || "", email: user.email || "" }));
        }
        setLoading(false);
    }, []);

    const event = selection ? getEventBySlug(selection.eventSlug) : null;

    if (loading) return (
        <div className="min-h-screen bg-[#1E1E1E] text-white">
            <Navbar />
        </div>
    );

    if (!selection || !event) {
        return (
            <div className="min-h-screen bg-[#1E1E1E] text-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center py-32 text-center px-4">
                    <p className="text-[15px] font-semibold text-white mb-2">No tickets selected</p>
                    <p className="text-[13px] text-[#6A6A6A] mb-6">Browse events and select tickets to get started.</p>
                    <Link href="/browse" className="px-5 py-2.5 bg-white rounded-lg text-[13px] font-semibold text-[#111] hover:bg-[#E8E8E8] transition-colors">
                        Browse events
                    </Link>
                </div>
            </div>
        );
    }

    const subtotal = selection.total;
    const discount = promoApplied ? Math.round(subtotal * (promoApplied.discount / 100)) : 0;
    const afterDiscount = subtotal - discount;
    const serviceFee = Math.round(afterDiscount * SERVICE_FEE_RATE);
    const total = afterDiscount + serviceFee;

    const set = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm(p => ({ ...p, [f]: e.target.value }));

    const validate = () => {
        const e: Record<string, string> = {};
        if (!form.firstName.trim()) e.firstName = "Required";
        if (!form.lastName.trim()) e.lastName = "Required";
        if (!form.email) e.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
        if (!form.phone.trim()) e.phone = "Required";
        return e;
    };

    const handleApplyPromo = () => {
        setPromoError("");
        const code = promoCode.trim().toUpperCase();
        if (!code) return;

        // ── MOCK PROMO VALIDATION ──
        if (code === "EARLYBIRD20") {
            setPromoApplied({ code, discount: 20 });
        } else if (code === "WELCOME10") {
            setPromoApplied({ code, discount: 10 });
        } else {
            setPromoError("Invalid or expired promo code.");
            setPromoApplied(null);
        }
    };

    const handlePay = async (e: React.FormEvent) => {
        e.preventDefault();
        const errs = validate();
        setErrors(errs);
        if (Object.keys(errs).length) return;

        setProcessing(true);

        // ── MOCK PAYMENT ──────────────────────────────────────────
        // No real Paystack integration exists yet. This simulates a
        // successful payment so the confirmation page can be demoed.
        await new Promise(r => setTimeout(r, 1200));

        const orderId = `TXR-2026-${Math.floor(10000 + Math.random() * 90000)}`;
        const ticketCode = `TXR-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-2026`;

        const order = {
            orderId,
            ticketCode,
            event: { title: event.title, startTime: event.startTime, venueAddress: event.venueAddress, bg: event.bg },
            items: selection.items,
            subtotal,
            discount,
            serviceFee,
            total,
            attendee: { firstName: form.firstName, lastName: form.lastName, email: form.email },
        };

        sessionStorage.setItem("orderConfirmation", JSON.stringify(order));
        sessionStorage.removeItem("checkoutSelection");
        // ───────────────────────────────────────────────────────────

        router.push("/confirmation");
    };

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white">
            <Navbar />

            <div className="px-6 lg:px-12 pt-6">
                <Link href={`/events/${event.slug}`} className="inline-flex items-center gap-2 px-4 py-2 border border-[#3A3A3A] rounded-lg text-[13px] text-white hover:bg-[#252525] transition-colors">
                    <ArrowLeft />
                    Back to event
                </Link>
            </div>

            <div className="px-6 lg:px-12 py-8 max-w-[1400px]">
                <h1 className="text-[28px] font-bold text-white tracking-tight mb-8">Checkout</h1>

                {/* Stepper */}
                <div className="flex items-center mb-10 max-w-2xl">
                    {[["Tickets", true], ["Details", true], ["Payment", false]].map(([label, active], idx) => (
                        <div key={label as string} className="flex items-center flex-1 last:flex-initial">
                            <div className="flex items-center gap-2">
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold ${idx === 1 ? "bg-white text-[#111]" : active ? "border border-white text-white" : "border border-[#3A3A3A] text-[#6A6A6A]"
                                    }`}>
                                    {idx === 0 ? "✓" : idx + 1}
                                </div>
                                <span className={`text-[13px] ${idx === 1 ? "text-white font-semibold" : "text-[#6A6A6A]"}`}>{label as string}</span>
                            </div>
                            {idx < 2 && <div className="flex-1 h-px bg-[#2A2A2A] mx-4" />}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
                    {/* ── LEFT — FORM ── */}
                    <div>
                        <p className="text-[11px] font-semibold text-[#6A6A6A] uppercase tracking-widest mb-4">Your details</p>

                        <form onSubmit={handlePay}>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-[13px] text-[#9A9A9A] mb-2">First name</label>
                                    <input
                                        type="text" value={form.firstName} onChange={set("firstName")}
                                        className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-[14px] text-white outline-none focus:border-[#5A5A5A] transition-colors"
                                    />
                                    {errors.firstName && <p className="text-red-400 text-[12px] mt-1.5">{errors.firstName}</p>}
                                </div>
                                <div>
                                    <label className="block text-[13px] text-[#9A9A9A] mb-2">Last name</label>
                                    <input
                                        type="text" value={form.lastName} onChange={set("lastName")}
                                        className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-[14px] text-white outline-none focus:border-[#5A5A5A] transition-colors"
                                    />
                                    {errors.lastName && <p className="text-red-400 text-[12px] mt-1.5">{errors.lastName}</p>}
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="block text-[13px] text-[#9A9A9A] mb-2">Email address</label>
                                <input
                                    type="email" value={form.email} onChange={set("email")}
                                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-[14px] text-white outline-none focus:border-[#5A5A5A] transition-colors"
                                />
                                {errors.email && <p className="text-red-400 text-[12px] mt-1.5">{errors.email}</p>}
                            </div>

                            <div className="mb-6">
                                <label className="block text-[13px] text-[#9A9A9A] mb-2">Phone number</label>
                                <input
                                    type="tel" value={form.phone} onChange={set("phone")}
                                    placeholder="+234 800 000 0000"
                                    className="w-full bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
                                />
                                {errors.phone && <p className="text-red-400 text-[12px] mt-1.5">{errors.phone}</p>}
                            </div>

                            {/* Promo code */}
                            <div className="mb-6">
                                <p className="text-[11px] font-semibold text-[#6A6A6A] uppercase tracking-widest mb-3">Promo code</p>
                                <div className="flex gap-2">
                                    <input
                                        type="text" value={promoCode}
                                        onChange={e => { setPromoCode(e.target.value); setPromoError(""); }}
                                        placeholder="Enter promo code"
                                        className="flex-1 bg-[#2A2A2A] border border-[#3A3A3A] rounded-lg px-4 py-3 text-[14px] text-white placeholder-[#4A4A4A] outline-none focus:border-[#5A5A5A] transition-colors"
                                    />
                                    <button
                                        type="button" onClick={handleApplyPromo}
                                        className="px-5 py-3 border border-[#3A3A3A] rounded-lg text-[13px] font-medium text-white hover:bg-[#2A2A2A] transition-colors"
                                    >
                                        Apply
                                    </button>
                                </div>
                                {promoError && <p className="text-red-400 text-[12px] mt-1.5">{promoError}</p>}
                                {promoApplied && (
                                    <p className="text-[#4CAF82] text-[12px] mt-1.5">
                                        {promoApplied.code} applied — {promoApplied.discount}% off
                                    </p>
                                )}
                                <p className="text-[11px] text-[#4A4A4A] mt-2">Try EARLYBIRD20 or WELCOME10</p>
                            </div>

                            <p className="text-[12px] text-[#6A6A6A] leading-relaxed mb-6">
                                By completing this purchase you agree to the{" "}
                                <a href="#" className="underline hover:text-white">Terms of Service</a> and{" "}
                                <a href="#" className="underline hover:text-white">Refund Policy</a>. Tickets are non-refundable after purchase.
                            </p>

                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full lg:hidden flex items-center justify-center gap-2 py-3.5 bg-white border border-[#3A3A3A] rounded-lg text-[14px] font-semibold text-[#111] hover:bg-[#E8E8E8] disabled:bg-[#2A2A2A] disabled:text-[#5A5A5A] disabled:cursor-not-allowed transition-colors"
                            >
                                <LockIcon />
                                {processing ? "Processing..." : `Pay ${formatPrice(total, event.currency)} with Paystack`}
                            </button>
                        </form>
                    </div>

                    {/* ── RIGHT — ORDER SUMMARY ── */}
                    <div>
                        <div className="bg-[#252525] border border-[#2E2E2E] rounded-xl p-5 lg:sticky lg:top-6">
                            {/* Event */}
                            <div className="flex items-start gap-3 pb-4 border-b border-[#2A2A2A] mb-4">
                                <div className="w-12 h-12 rounded-lg flex-shrink-0" style={{ background: event.bg }} />
                                <div>
                                    <p className="text-[14px] font-semibold text-white leading-snug">{event.title}</p>
                                    <p className="text-[12px] text-[#6A6A6A] mt-1">
                                        {formatDate(event.startTime)}
                                    </p>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="flex flex-col gap-3 pb-4 border-b border-[#2A2A2A] mb-4">
                                {selection.items.map(item => (
                                    <div key={item.ticketTypeId} className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[13px] text-white">{item.name}</p>
                                            <p className="text-[12px] text-[#6A6A6A]">× {item.quantity} · {formatPrice(item.price, event.currency)}</p>
                                        </div>
                                        <p className="text-[13px] font-medium text-white">{formatPrice(item.price * item.quantity, event.currency)}</p>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div className="flex flex-col gap-2 mb-4">
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-[#9A9A9A]">Subtotal</span>
                                    <span className="text-white">{formatPrice(subtotal, event.currency)}</span>
                                </div>
                                {promoApplied && (
                                    <div className="flex items-center justify-between text-[13px]">
                                        <span className="text-[#4CAF82]">Discount ({promoApplied.discount}%)</span>
                                        <span className="text-[#4CAF82]">−{formatPrice(discount, event.currency)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-[13px]">
                                    <span className="text-[#9A9A9A]">Service fee</span>
                                    <span className="text-white">{formatPrice(serviceFee, event.currency)}</span>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-[#2A2A2A] mb-5">
                                <span className="text-[14px] font-semibold text-white">Total</span>
                                <span className="text-[18px] font-bold text-white">{formatPrice(total, event.currency)}</span>
                            </div>

                            <button
                                onClick={handlePay}
                                disabled={processing}
                                className="hidden lg:flex w-full items-center justify-center gap-2 py-3.5 bg-white border border-[#3A3A3A] rounded-lg text-[14px] font-semibold text-[#111] hover:bg-[#E8E8E8] disabled:bg-[#2A2A2A] disabled:text-[#5A5A5A] disabled:cursor-not-allowed transition-colors"
                            >
                                <LockIcon />
                                {processing ? "Processing..." : `Pay ${formatPrice(total, event.currency)} with Paystack`}
                            </button>

                            <p className="text-center text-[11px] text-[#5A5A5A] mt-3 flex items-center justify-center gap-1.5">
                                <LockIcon /> Secured by Paystack
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}