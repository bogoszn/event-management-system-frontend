"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import { MOCK_EVENTS, CATEGORIES, formatPrice, formatDate } from "@/lib/mockData";

const CITIES = ["All cities", "Lagos", "Abuja", "Port Harcourt"];

const PinIcon = () => (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="#E55A4E">
        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
    </svg>
);

const SearchIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6A6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
);

const ChevronDown = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <polyline points="6 9 12 15 18 9" />
    </svg>
);

type SortOption = "date" | "price-low" | "price-high";

export default function BrowsePage() {
    const [search, setSearch] = useState("");
    const [city, setCity] = useState("All cities");
    const [priceFilter, setPriceFilter] = useState<{ free: boolean; paid: boolean }>({ free: false, paid: false });
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState<SortOption>("date");

    const filteredEvents = useMemo(() => {
        let results = [...MOCK_EVENTS];

        if (search) {
            const q = search.toLowerCase();
            results = results.filter(e => e.title.toLowerCase().includes(q));
        }
        if (city !== "All cities") {
            results = results.filter(e => e.city === city);
        }
        if (category !== "All") {
            results = results.filter(e => e.category.name === category);
        }
        if (priceFilter.free && !priceFilter.paid) {
            results = results.filter(e => e.isFree);
        } else if (priceFilter.paid && !priceFilter.free) {
            results = results.filter(e => !e.isFree);
        }

        // Sort
        if (sort === "date") {
            results.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
        } else if (sort === "price-low") {
            results.sort((a, b) => a.lowestTicketPrice - b.lowestTicketPrice);
        } else if (sort === "price-high") {
            results.sort((a, b) => b.lowestTicketPrice - a.lowestTicketPrice);
        }

        return results;
    }, [search, city, category, priceFilter, sort]);

    return (
        <div className="min-h-screen bg-[#1E1E1E] text-white">
            <Navbar />

            <div className="flex max-w-[1400px] mx-auto">
                {/* ── SIDEBAR ── */}
                <aside className="w-64 flex-shrink-0 border-r border-[#2A2A2A] p-6 hidden lg:block">

                    {/* City */}
                    <div className="mb-7">
                        <p className="text-[11px] font-semibold text-[#6A6A6A] tracking-widest uppercase mb-3">City</p>
                        <div className="flex flex-col gap-2.5">
                            {CITIES.map(c => (
                                <label key={c} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="city"
                                        checked={city === c}
                                        onChange={() => setCity(c)}
                                        className="w-4 h-4 accent-white"
                                    />
                                    <span className={`text-[13px] ${city === c ? "text-white" : "text-[#9A9A9A]"} group-hover:text-white transition-colors`}>
                                        {c}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="h-px bg-[#2A2A2A] mb-7" />

                    {/* Price */}
                    <div className="mb-7">
                        <p className="text-[11px] font-semibold text-[#6A6A6A] tracking-widest uppercase mb-3">Price</p>
                        <div className="flex flex-col gap-2.5">
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={priceFilter.free}
                                    onChange={() => setPriceFilter(p => ({ ...p, free: !p.free }))}
                                    className="w-4 h-4 accent-white"
                                />
                                <span className="text-[13px] text-[#9A9A9A] group-hover:text-white transition-colors">Free</span>
                            </label>
                            <label className="flex items-center gap-2.5 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={priceFilter.paid}
                                    onChange={() => setPriceFilter(p => ({ ...p, paid: !p.paid }))}
                                    className="w-4 h-4 accent-white"
                                />
                                <span className="text-[13px] text-[#9A9A9A] group-hover:text-white transition-colors">Paid</span>
                            </label>
                        </div>
                    </div>

                    <div className="h-px bg-[#2A2A2A] mb-7" />

                    {/* Category */}
                    <div>
                        <p className="text-[11px] font-semibold text-[#6A6A6A] tracking-widest uppercase mb-3">Category</p>
                        <div className="flex flex-col gap-2.5">
                            {["All", ...CATEGORIES.map(c => c.name)].map(cat => (
                                <label key={cat} className="flex items-center gap-2.5 cursor-pointer group">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={category === cat}
                                        onChange={() => setCategory(cat)}
                                        className="w-4 h-4 accent-white"
                                    />
                                    <span className={`text-[13px] ${category === cat ? "text-white" : "text-[#9A9A9A]"} group-hover:text-white transition-colors`}>
                                        {cat}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                {/* ── MAIN ── */}
                <main className="flex-1 p-6">
                    {/* Search bar */}
                    <div className="flex gap-3 mb-5">
                        <div className="relative flex-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <SearchIcon />
                            </div>
                            <input
                                type="text"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                placeholder="Search events..."
                                className="w-full bg-[#252525] border border-[#3A3A3A] rounded-lg pl-11 pr-4 py-3.5 text-[14px] text-white placeholder-[#6A6A6A] outline-none focus:border-[#5A5A5A] transition-colors"
                            />
                        </div>
                    </div>

                    {/* Results count + sort */}
                    <div className="flex items-center justify-between mb-5">
                        <p className="text-[14px] text-white">
                            <span className="font-semibold">{filteredEvents.length}</span> events
                        </p>
                        <div className="relative">
                            <select
                                value={sort}
                                onChange={e => setSort(e.target.value as SortOption)}
                                className="bg-[#252525] border border-[#3A3A3A] rounded-lg px-4 py-2.5 pr-9 text-[13px] text-white outline-none appearance-none cursor-pointer focus:border-[#5A5A5A] transition-colors"
                            >
                                <option value="date">Sort: Date</option>
                                <option value="price-low">Sort: Price (Low to High)</option>
                                <option value="price-high">Sort: Price (High to Low)</option>
                            </select>
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[#6A6A6A]">
                                <ChevronDown />
                            </div>
                        </div>
                    </div>

                    {/* Mobile category pills */}
                    <div className="flex flex-wrap gap-2 mb-5 lg:hidden">
                        {["All", ...CATEGORIES.map(c => c.name)].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-3.5 py-1.5 rounded-full text-[12px] border transition-colors ${category === cat
                                        ? "bg-[#2E2E2E] border-[#555] text-white font-medium"
                                        : "border-[#3A3A3A] text-[#9A9A9A]"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* Events grid */}
                    {filteredEvents.length === 0 ? (
                        <div className="text-center py-20 bg-[#252525] border border-[#2E2E2E] rounded-xl">
                            <p className="text-[32px] mb-3">🔍</p>
                            <p className="text-[15px] font-semibold text-white mb-2">No events found</p>
                            <p className="text-[13px] text-[#6A6A6A]">Try adjusting your filters or search term.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {filteredEvents.map(event => (
                                <Link key={event.id} href={`/events/${event.slug}`}>
                                    <div className="bg-[#252525] border border-[#2E2E2E] rounded-xl overflow-hidden hover:border-[#3A3A3A] transition-colors cursor-pointer h-full">
                                        {/* Image */}
                                        <div className="h-[180px] relative" style={{ background: event.bg }}>
                                            <span className="absolute top-3 left-3 text-[11px] font-medium px-2.5 py-1 rounded-md bg-black/50 border border-white/10 text-white backdrop-blur-sm">
                                                {event.category.name}
                                            </span>
                                            <span className={`absolute top-3 right-3 text-[12px] font-semibold px-2.5 py-1 rounded-md border backdrop-blur-sm ${event.isFree
                                                    ? "bg-[#4CAF82]/15 border-[#4CAF82]/30 text-[#4CAF82]"
                                                    : "bg-black/50 border-white/10 text-white"
                                                }`}>
                                                {event.isFree ? "Free" : formatPrice(event.lowestTicketPrice)}
                                            </span>
                                        </div>

                                        {/* Body */}
                                        <div className="p-4">
                                            <p className="text-[11px] text-[#6A6A6A] uppercase tracking-wider mb-1.5">
                                                {formatDate(event.startTime)} · {new Date(event.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                                            </p>
                                            <h3 className="text-[15px] font-semibold text-white mb-3 leading-snug">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-1.5 text-[12px] text-[#7A7A7A]">
                                                    <PinIcon />
                                                    {event.venueAddress?.split(",")[0]}
                                                </div>
                                                <span className={`text-[13px] font-semibold ${event.isFree ? "text-[#4CAF82]" : "text-white"}`}>
                                                    {event.isFree ? "Free" : formatPrice(event.lowestTicketPrice)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}