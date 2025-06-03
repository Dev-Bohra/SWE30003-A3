const BASE_URL = "http://localhost:8080/api/orders";

export async function fetchAllOrders() {
    const res = await fetch(BASE_URL);
    return res.json();
}

export async function updateOrderStatus(orderId, status) {
    const res = await fetch(`${BASE_URL}/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order status");
}