const BASE_URL = "http://localhost:8080/api/analytics";

export async function fetchAnalyticsApi() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to load analytics");
    return await res.json();
}