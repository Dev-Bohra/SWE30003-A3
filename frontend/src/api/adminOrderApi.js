const BASE_URL = "http://localhost:8080/api/orders";

export async function fetchAllOrders() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch orders");
    return await res.json();
}

export async function updateOrderStatusApi(orderId, status) {
    const res = await fetch(`${BASE_URL}/${orderId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
    });
    if (!res.ok) throw new Error("Failed to update order status");
    return await res.json();
}
