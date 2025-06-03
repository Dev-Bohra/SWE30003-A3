const BASE_URL = "http://localhost:8080/api/inventory";

export async function fetchAllProducts() {
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error("Failed to fetch products");
    return await res.json();
}

export async function restockProductApi(sku, quantity) {
    const res = await fetch(`${BASE_URL}/${sku}/restock`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
        credentials: "include"  // in case you use session login
    });
    const data = await res.json().catch(() => ({}));
    console.log("Restock response:", res.status, data);

    if (!res.ok) throw new Error("Failed to restock");
    return data;
}

export async function toggleProductStatusApi(sku) {
    const res = await fetch(`${BASE_URL}/${sku}/toggle-status`, {
        method: "PUT",
    });
    if (!res.ok) throw new Error("Failed to toggle product status");
    return await res.json();
}

export async function addProductApi(product) {
    const res = await fetch(`${BASE_URL}/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });
    if (!res.ok) throw new Error("Failed to add product");
    return await res.json();
}
