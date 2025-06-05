const BASE_URL = "http://localhost:8080/api/support";

export async function createSupportTicket(userId, subject, message) {
    const res = await fetch(`${BASE_URL}/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, message }),
    });
    if (!res.ok) throw new Error("Failed to create support ticket");
    return res.json();
}

export async function fetchSupportTickets(userId) {
    const res = await fetch(`${BASE_URL}/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch support tickets");
    return res.json();
}