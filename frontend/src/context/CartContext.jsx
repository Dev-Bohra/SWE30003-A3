// src/context/CartContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
    fetchCart,
    addToCart as apiAddToCart,
    updateCartItem as apiUpdateCartItem,
    removeCartItem as apiRemoveCartItem,
    clearCartApi,
} from "../api/cartApi";
import { placeOrderApi } from "../api/orderApi";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function useCart() {
    return useContext(CartContext);
}

export function CartProvider({ children }) {
    const { currentUser } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.id) {
            loadCart();
        } else {
            setCartItems([]);
            setTotal(0);
        }
    }, [currentUser]);

    async function loadCart() {
        if (!currentUser) return;
        setLoading(true);
        try {
            const data = await fetchCart(currentUser.id);
            const detailed = (data.items || []).map((it) => {
                const prod = it.product || {};
                return {
                    sku: prod.sku || "",
                    quantity: it.quantity || 0,
                    name: prod.name || "",
                    price: prod.price || 0,
                    image: prod.imageUrl || "",
                };
            });
            setCartItems(detailed);
            const calcTotal = detailed.reduce(
                (sum, it) => sum + it.price * it.quantity,
                0
            );
            setTotal(calcTotal);
        } catch (err) {
            console.error("Error loading cart:", err);
            setCartItems([]);
            setTotal(0);
        } finally {
            setLoading(false);
        }
    }

    async function addToCart(product) {
        if (!currentUser) {
            alert("Please log in to add items to cart.");
            return;
        }
        try {
            await apiAddToCart(currentUser.id, product.sku, 1);
            await loadCart();
        } catch (err) {
            console.error("Failed to add to cart:", err);
            alert(err.message);
        }
    }

    async function updateQuantity(sku, delta) {
        if (!currentUser) return;
        const found = cartItems.find((ci) => ci.sku === sku);
        if (!found) return;
        const newQty = found.quantity + delta;
        if (newQty < 0) return;
        try {
            await apiUpdateCartItem(currentUser.id, sku, newQty);
            await loadCart();
        } catch (err) {
            console.error("Failed to update cart item:", err);
            alert(err.message);
        }
    }

    async function removeFromCart(sku) {
        if (!currentUser) return;
        try {
            await apiRemoveCartItem(currentUser.id, sku);
            await loadCart();
        } catch (err) {
            console.error("Failed to remove cart item:", err);
            alert(err.message);
        }
    }

    async function clearCart() {
        if (!currentUser) return;
        try {
            await clearCartApi(currentUser.id);
            setCartItems([]);
            setTotal(0);
        } catch (err) {
            console.error("Failed to clear cart:", err);
            alert(err.message);
        }
    }

    async function placeOrder(checkoutData) {
        if (!currentUser) return;
        try {
            const order = await placeOrderApi(currentUser.id, checkoutData);
            setCartItems([]);
            setTotal(0);
            return order;
        } catch (err) {
            console.error("Failed to place order:", err);
            throw err;
        }
    }

    return (
        <CartContext.Provider
            value={{
                cartItems,
                total,
                loading,
                addToCart,
                updateQuantity,
                removeFromCart,
                clearCart,
                placeOrder,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}
