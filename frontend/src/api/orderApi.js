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
