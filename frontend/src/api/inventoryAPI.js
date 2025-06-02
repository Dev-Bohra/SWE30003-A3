const BASE_URL = "http://localhost:8080/api/inventory";

export async function fetchAllProducts() {
    const res = await fetch(`${BASE_URL}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Failed to load inventory");
    return await res.json(); // Array of Product
}

export async function fetchPopularProducts() {
    const res = await fetch(`${BASE_URL}/popular`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    if (!res.ok) throw new Error("Failed to load popular products");
    return await res.json(); // Array of up to 3 Product
}