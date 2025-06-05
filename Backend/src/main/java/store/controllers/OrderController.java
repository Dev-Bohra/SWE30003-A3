// src/main/java/store/controllers/OrderController.java
package store.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import store.*;
import store.dtos.OrderRequest;
import store.dtos.OrderWithInvoiceResponse;

import java.nio.charset.StandardCharsets;
import java.util.Base64;
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
    public ResponseEntity<OrderWithInvoiceResponse> placeOrder(
            @PathVariable String userId,
            @RequestBody OrderRequest req
    ) {
        // Look up customer
        Customer customer = db.getCustomerById(userId);
        if (customer == null) {
            return ResponseEntity.notFound().build();
        }

        // Place the order (cart -> Order)
        Order order = customer.placeOrder(
                req.getShippingAddress(),
                req.getCity(),
                req.getPostalCode(),
                req.getPaymentMethod()
        );

        // Persist the order & clear cart
        db.saveOrder(order);
        db.updateCustomerCart(userId, new Cart());

        // Build the invoice text in memory
        Invoice invoice = new Invoice(order);
        String invoiceText = invoice.generateInvoice(); // plain UTF-8 string

        // Encode to Base64 so it’s safe to send in JSON
        byte[] invoiceBytes = invoiceText.getBytes(StandardCharsets.UTF_8);
        String invoiceBase64 = Base64.getEncoder().encodeToString(invoiceBytes);

        //  Suggest a filename (the frontend can trust this)
        String filename = "invoice-" + order.getOrderId() + ".txt";

        //  Wrap everything in OrderWithInvoiceResponse
        OrderWithInvoiceResponse wrapper =
                new OrderWithInvoiceResponse(order, invoiceBase64, filename);

        return ResponseEntity.ok(wrapper);
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

