// src/api/cartApi.js

const BASE_URL = "http://localhost:8080/api/cart";

// Fetch the cart for a given userId
export async function fetchCart(userId) {
    const res = await fetch(`${BASE_URL}/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch cart");
    return await res.json(); // { items: [ { sku, quantity, product: { … } } ] }
}

// Add one unit of sku to the cart
export async function addToCart(userId, sku, quantity) {
    const res = await fetch(`${BASE_URL}/${userId}/items`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sku, quantity }),
    });
    if (!res.ok) throw new Error("Failed to add to cart");
}

// Update a cart item’s quantity outright
export async function updateCartItem(userId, sku, quantity) {
    const res = await fetch(`${BASE_URL}/${userId}/items/${sku}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity }),
    });
    if (!res.ok) throw new Error("Failed to update cart item");
}

// Remove a single SKU from the cart
export async function removeCartItem(userId, sku) {
    const res = await fetch(`${BASE_URL}/${userId}/items/${sku}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to remove cart item");
}

// Clear the entire cart for this user
export async function clearCartApi(userId) {
    const res = await fetch(`${BASE_URL}/${userId}`, {
        method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to clear cart");
}

