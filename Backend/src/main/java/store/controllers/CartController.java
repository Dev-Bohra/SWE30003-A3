// src/main/java/store/controllers/CartController.java
package store.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import store.*;

import java.util.Map;
import java.util.NoSuchElementException;

/**
 * REST endpoints for managing a customer's cart.
 *   • GET  /api/cart/{userId}               → retrieve current Cart
 *   • POST /api/cart/{userId}/items         → add (sku, quantity)
 *   • PUT  /api/cart/{userId}/items/{sku}   → set quantity (via addItem/subtractItem)
 *   • DELETE /api/cart/{userId}/items/{sku} → remove one SKU
 *   • DELETE /api/cart/{userId}             → clear entire cart
 */
@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final Database db = Database.getInstance();
    private final Inventory inventory = Inventory.getInstance();

    /**
     * GET /api/cart/{userId}
     */
    @GetMapping("/{userId}")
    public ResponseEntity<Cart> getCart(@PathVariable String userId) {
        Customer c = db.getCustomerById(userId);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(c.getCart());
    }

    /**
     * POST /api/cart/{userId}/items
     * Body: { "sku": "SKU001", "quantity": 2 }
     */
    @PostMapping("/{userId}/items")
    public ResponseEntity<Void> addToCart(
            @PathVariable String userId,
            @RequestBody Map<String, Object> request
    ) {
        Customer c = db.getCustomerById(userId);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        String sku = (String) request.get("sku");
        Object qtyObj = request.get("quantity");
        if (sku == null || qtyObj == null) {
            return ResponseEntity.badRequest().build();
        }

        int quantity;
        try {
            quantity = ((Number) qtyObj).intValue();
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest().build();
        }

        try {
            Product p = inventory.getProduct(sku); // validate SKU
            c.getCart().addItem(p, quantity);
            db.updateCustomerCart(userId, c.getCart());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * PUT /api/cart/{userId}/items/{sku}
     * Body: { "quantity": 5 }
     */
    @PutMapping("/{userId}/items/{sku}")
    public ResponseEntity<Void> updateCartItem(
            @PathVariable String userId,
            @PathVariable String sku,
            @RequestBody Map<String, Object> request
    ) {
        Customer c = db.getCustomerById(userId);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        Object qtyObj = request.get("quantity");
        if (qtyObj == null) {
            return ResponseEntity.badRequest().build();
        }

        int newQty;
        try {
            newQty = ((Number) qtyObj).intValue();
        } catch (ClassCastException e) {
            return ResponseEntity.badRequest().build();
        }

        try {
            // 1) Determine current quantity in cart for this SKU
            int currentQty = 0;
            for (CartItem ci : c.getCart().getItems()) {
                if (ci.getProduct().getSku().equals(sku)) {
                    currentQty = ci.getQuantity();
                    break;
                }
            }

            // 2) Compute how many to add or subtract
            int delta = newQty - currentQty;
            Product p = inventory.getProduct(sku); // validate SKU

            if (delta > 0) {
                c.getCart().addItem(p, delta);
            } else if (delta < 0) {
                c.getCart().subtractItem(sku, -delta);
            }
            // if delta == 0, do nothing

            // 3) Persist updated cart
            db.updateCustomerCart(userId, c.getCart());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException | NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/cart/{userId}/items/{sku}
     */
    @DeleteMapping("/{userId}/items/{sku}")
    public ResponseEntity<Void> removeCartItem(
            @PathVariable String userId,
            @PathVariable String sku
    ) {
        Customer c = db.getCustomerById(userId);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            c.getCart().removeItem(sku);
            db.updateCustomerCart(userId, c.getCart());
            return ResponseEntity.ok().build();
        } catch (NoSuchElementException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    /**
     * DELETE /api/cart/{userId}
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> clearCart(@PathVariable String userId) {
        Customer c = db.getCustomerById(userId);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        c.getCart().clear();
        db.updateCustomerCart(userId, c.getCart());
        return ResponseEntity.ok().build();
    }
}