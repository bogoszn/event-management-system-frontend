export function saveTokens(accessToken: string, refreshToken: string) {
    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
}

export function saveUser(user: object) {
    localStorage.setItem("user", JSON.stringify(user));
}

export function getAccessToken() {
    return localStorage.getItem("accessToken");
}

export function getRefreshToken() {
    return localStorage.getItem("refreshToken");
}

export function getUser() {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
}

export function clearAuth() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
}

export function isAuthenticated() {
    return !!localStorage.getItem("accessToken");
}