// src/api/orderApi.js

const BASE_URL = "http://localhost:8080/api/orders";

/**
 * POST /api/orders/{userId}
 *   Sends the shipping + payment data to the backend. Example:
 *
 *   body: {
 *     shippingAddress: "123 Main St",
 *     city: "Sydney",
 *     postalCode: "2000",
 *     paymentMethod: "credit_card"
 *   }
 *
 * Returns the newly‐created Order object (including orderId, orderItems, total, trackingId, status, etc.).
 */
export async function placeOrderApi(userId, checkoutData) {
    const res = await fetch(`${BASE_URL}/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(checkoutData),
    });
    if (!res.ok) throw new Error("Failed to place order");
    return await res.json(); // the full Order JSON
}

export function triggerDownloadFromBase64(filename, base64String) {
    // 1) Convert Base64 to raw binary bytes:
    const byteCharacters = atob(base64String); // decode
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // 2) Create a Blob from those bytes (MIME type: text/plain)
    const blob = new Blob([byteArray], { type: "text/plain" });

    // 3) Programmatically trigger a “download” in the browser
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
}

/**
 * GET /api/orders/{userId}
 *   Returns { orders: [ an array of Order JSONs ] }
*/
export async function fetchOrdersApi(userId) {
    const res = await fetch(`${BASE_URL}/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });
    if (!res.ok) throw new Error("Failed to fetch orders");
    const data = await res.json(); // { orders: [ … ] }
    return data.orders || [];
}
