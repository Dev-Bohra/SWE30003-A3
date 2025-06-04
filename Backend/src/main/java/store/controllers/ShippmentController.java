package store.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import store.Database;

import java.util.HashMap;
import java.util.Map;
public class ShippmentController {
    private final Database db = Database.getInstance();

    /**
     * Look up the order with the given orderId in the JSON database and return its "status" field.
     *
     * Example response JSON:
     *   { "status": "IN_TRANSIT" }
     */
    @GetMapping("/{orderId}/status")
    public ResponseEntity<Map<String, String>> getShipmentStatus(@PathVariable String orderId) {
        JsonNode allOrders = db.loadOrders();
        for (JsonNode node : allOrders) {
            if (node.has("orderId") && node.get("orderId").asText().equals(orderId)) {
                String status = node.get("status").asText();
                Map<String, String> resp = new HashMap<>();
                resp.put("status", status);
                return ResponseEntity.ok(resp);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
