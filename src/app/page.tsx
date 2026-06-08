"use client";

import Link from "next/link";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";

const CATEGORIES = ["All", "Music", "Tech", "Business", "Arts", "Food & Drink", "Sports", "Comedy"];

const FEATURED_EVENTS = [
  {
    id: "1",
    slug: "afrobeats-night-lagos-vol-12",
    title: "Afrobeats Night Lagos — Vol. 12",
    date: "SAT, JUN 14 · 7:00 PM",
    venue: "Eko Hotel, VI",
    price: 15000,
    isFree: false,
    bg: "#1A2035",
  },
  {
    id: "2",
    slug: "lagos-startup-summit-2026",
    title: "Lagos Startup Summit 2026",
    date: "THU, JUN 19 · 10:00 AM",
    venue: "Landmark, VI",
    price: 0,
    isFree: true,
    bg: "#0D1520",
  },
  {
    id: "3",
    slug: "an-evening-with-wande-coal",
    title: "An Evening with Wande Coal",
    date: "FRI, JUN 27 · 6:00 PM",
    venue: "Terra Kulture, Lagos",
    price: 8000,
    isFree: false,
    bg: "#141414",
  },
  {
    id: "4",
    slug: "gdg-lagos-july-meetup",
    title: "Google Developer Group Lagos — July Meetup",
    date: "SAT, JUL 5 · 9:00 AM",
    venue: "Co-Creation Hub, Yaba",
    price: 0,
    isFree: true,
    bg: "#0D1520",
  },
];

const PinIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="#E55A4E">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
  </svg>
);

const ChevronDown = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [city, setCity] = useState("Lagos");

  return (
    <div className="min-h-screen bg-[#1E1E1E] text-white">
      <Navbar />

      {/* ── HERO ── */}
      <section className="px-12 pt-16 pb-12 max-w-2xl">
        <p className="text-[11px] font-medium text-[#7A7A7A] tracking-widest uppercase mb-5">
          Nigeria&apos;s event platform
        </p>
        <h1 className="text-[52px] font-bold leading-[1.08] tracking-tight text-white mb-8">
          Find and attend events<br />happening near you
        </h1>

        {/* Search */}
        <div className="flex max-w-[520px] mb-7">
          <button
            className="flex items-center gap-2 bg-[#252525] border border-[#3A3A3A] border-r-0 rounded-l-lg px-4 py-3.5 text-[14px] text-white min-w-[160px]"
            onClick={() => setCity(city === "Lagos" ? "Abuja" : "Lagos")}
          >
            {city}
            <ChevronDown />
          </button>
          <button className="px-7 py-3.5 bg-white rounded-r-lg text-[14px] font-semibold text-[#111] hover:bg-[#E8E8E8] transition-colors">
            Search
          </button>
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-[13px] border transition-colors ${activeCategory === cat
                ? "bg-[#2E2E2E] border-[#555] text-white font-medium"
                : "border-[#3A3A3A] text-[#9A9A9A] hover:text-white hover:border-[#555]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── FEATURED EVENTS ── */}
      <section className="px-12 pb-14">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-[16px] font-semibold text-white">Featured events</h2>
          <Link href="/browse" className="text-[13px] text-[#9A9A9A] hover:text-white transition-colors">
            View all →
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {FEATURED_EVENTS.map(event => (
            <Link key={event.id} href={`/events/${event.slug}`}>
              <div className="bg-[#252525] border border-[#2E2E2E] rounded-xl overflow-hidden hover:border-[#3A3A3A] transition-colors cursor-pointer">
                {/* Image placeholder */}
                <div className="h-[180px] relative" style={{ background: event.bg }}>
                  <span className={`absolute bottom-3 left-3 text-[12px] font-semibold px-2.5 py-1 rounded-md border backdrop-blur-sm ${event.isFree
                    ? "bg-[#4CAF82]/15 border-[#4CAF82]/30 text-[#4CAF82]"
                    : "bg-black/50 border-white/10 text-white"
                    }`}>
                    {event.isFree ? "Free" : `₦${event.price.toLocaleString()}`}
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4">
                  <p className="text-[11px] text-[#6A6A6A] uppercase tracking-wider mb-1.5">
                    {event.date}
                  </p>
                  <h3 className="text-[15px] font-semibold text-white mb-3 leading-snug">
                    {event.title}
                  </h3>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[12px] text-[#7A7A7A]">
                      <PinIcon />
                      {event.venue}
                    </div>
                    <span className={`text-[13px] font-semibold ${event.isFree ? "text-[#4CAF82]" : "text-white"}`}>
                      {event.isFree ? "Free" : `₦${event.price.toLocaleString()}`}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="px-12 pb-14">
        <div className="grid grid-cols-3 gap-3">
          {[["4,200+", "Events hosted"], ["180k", "Tickets sold"], ["620+", "Organizers"]].map(([num, label]) => (
            <div key={label} className="bg-[#252525] border border-[#2E2E2E] rounded-xl p-6">
              <p className="text-[28px] font-bold text-white tracking-tight mb-1.5">{num}</p>
              <p className="text-[13px] text-[#6A6A6A]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── ORGANIZER CTA ── */}
      <section className="px-12 pb-16">
        <div className="bg-[#252525] border border-[#2E2E2E] rounded-xl px-8 py-7 flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-2 h-2 rounded-full bg-[#4CAF82] mt-1.5 flex-shrink-0" />
            <div>
              <h3 className="text-[15px] font-semibold text-white mb-1">Organise an event</h3>
              <p className="text-[13px] text-[#7A7A7A] leading-relaxed max-w-md">
                Create, sell tickets, and manage your event in one place.<br />
                Paystack payouts directly to your account.
              </p>
            </div>
          </div>
          <button className="px-5 py-2.5 border border-[#3A3A3A] rounded-lg text-[13px] text-white font-medium hover:bg-[#2A2A2A] transition-colors flex-shrink-0">
            Apply as organiser
          </button>
        </div>
      </section>
    </div>
  );
}