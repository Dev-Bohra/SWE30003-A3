// src/main/java/store/controllers/OrderController.java
package store.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import store.*;
import store.dtos.OrderRequest;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * REST endpoint for placing a new Order and retrieving past orders.
 *   • POST /api/orders/{userId}    → place an order (checkout)
 *   • GET  /api/orders/{userId}    → fetch all past orders for this user
 */
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final Database db = Database.getInstance();

    /**
     * POST /api/orders/{userId}
     *   -> Use Customer.placeOrder(...) (which calls Cart.initiateOrder(...) internally),
     *     then persist the Order and clear the cart in the JSON DB.
     */
    @PostMapping("/{userId}")
    public ResponseEntity<Order> placeOrder(
            @PathVariable String userId,
            @RequestBody OrderRequest req  // { shippingAddress, city, postalCode, paymentMethod }
    ) {
        // 1) Look up the Customer
        Customer c = db.getCustomerById(userId);
        if (c == null) {
            return ResponseEntity.notFound().build();
        }

        // 2) Place the order via Customer.placeOrder(...)
        Order order = c.placeOrder(
                req.getShippingAddress(),
                req.getCity(),
                req.getPostalCode(),
                req.getPaymentMethod()
        );

        // 3) Persist the new order in JSON
        db.saveOrder(order);

        // 4) Clear that customer's cart in the JSON DB
        db.updateCustomerCart(userId, new Cart());

        // 5) Return the created Order JSON back to the frontend
        return ResponseEntity.ok(order);
    }

    /**
     * GET /api/orders/{userId}
     *   -> Return all past orders for this user from the JSON “orders” store.
     */
    @GetMapping("/{userId}")
    public ResponseEntity<ObjectNode> getOrdersForUser(@PathVariable String userId) {
        JsonNode allOrders = db.loadOrders();
        ArrayNode filtered = new ObjectMapper().createArrayNode();
        for (JsonNode node : allOrders) {
            if (node.get("customerId").asText().equals(userId)) {
                filtered.add(node);
            }
        }
        ObjectNode wrapper = new ObjectMapper().createObjectNode();
        wrapper.set("orders", filtered);
        return ResponseEntity.ok(wrapper);
    }

    @GetMapping("")
    public ResponseEntity<ObjectNode> getAllOrders() {
        JsonNode allOrders = db.loadOrders();
        ObjectNode wrapper = new ObjectMapper().createObjectNode();
        wrapper.set("orders", allOrders);
        return ResponseEntity.ok(wrapper);
    }
    @PutMapping("/{id}/status")
    public ResponseEntity<Void> updateOrderStatus(
            @PathVariable String id,
            @RequestBody Map<String, String> body
    ) {
        String newStatus = body.get("status");
        if (newStatus == null || newStatus.isBlank()) {
            return ResponseEntity.badRequest().build();
        }

        boolean updated = Database.getInstance().updateOrderStatus(id, newStatus);
        return updated ? ResponseEntity.ok().build() : ResponseEntity.notFound().build();
    }

}

