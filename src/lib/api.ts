const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ── Auth ──────────────────────────────────────────────────────────────────────

export async function loginUser(email: string, password: string) {
    const res = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Login failed");
    return data;
}

export async function registerUser(
    name: string,
    email: string,
    password: string,
    role: "attendee" | "organizer"
) {
    const res = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Registration failed");
    return data;
}

export async function refreshToken(refreshToken: string) {
    const res = await fetch(`${API_URL}/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Token refresh failed");
    return data;
}

export async function logoutUser(refreshToken: string) {
    const res = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Logout failed");
    return data;
}

// ── Events ────────────────────────────────────────────────────────────────────

export async function getEvents(params?: Record<string, string>) {
    const query = params ? "?" + new URLSearchParams(params).toString() : "";
    const res = await fetch(`${API_URL}/events${query}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch events");
    return data;
}

export async function getEventBySlug(slug: string) {
    const res = await fetch(`${API_URL}/events/${slug}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Event not found");
    return data;
}

// ── Categories ────────────────────────────────────────────────────────────────

export async function getCategories() {
    const res = await fetch(`${API_URL}/categories`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch categories");
    return data;
}

// ── Orders ────────────────────────────────────────────────────────────────────

export async function createOrder(
    eventId: string,
    items: { ticketTypeId: string; quantity: number }[],
    promoCode?: string
) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId, items, promoCode }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to create order");
    return data;
}

export async function getOrder(id: string) {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Order not found");
    return data;
}

// ── User ──────────────────────────────────────────────────────────────────────

export async function getMe() {
    const token = localStorage.getItem("accessToken");
    const res = await fetch(`${API_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to fetch user");
    return data;
}
export async function forgotPassword(email: string) {
    const res = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
}

export async function resetPassword(token: string, newPassword: string) {
    const res = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Reset failed");
    return data;
}