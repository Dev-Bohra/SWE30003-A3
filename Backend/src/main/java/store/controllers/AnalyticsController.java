package store.controllers;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import store.Customer;
import store.Database;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
public class AnalyticsController {
    private final Database db = Database.getInstance();

    @GetMapping("/api/analytics")
    public ResponseEntity<ObjectNode> getAnalytics() {
        ObjectMapper mapper = new ObjectMapper();
        ObjectNode result = mapper.createObjectNode();

        List<Customer> allCustomers = db.loadCustomers();
        JsonNode allOrders = db.loadOrders();

        int totalUsers = allCustomers.size();
        int totalOrders = allOrders.size();
        double totalRevenue = 0.0;

        Map<String, Integer> categoryCounts = new HashMap<>();
        Map<String, Integer> roleCounts = new HashMap<>();

        roleCounts.put("admin", 1);

        for (Customer user : allCustomers) {
            String role = user.getRole();  // Make sure Customer has getRole()
            roleCounts.put(role, roleCounts.getOrDefault(role, 0) + 1);
        }

        for (JsonNode order : allOrders) {
            totalRevenue += order.path("total").asDouble(0);
            for (JsonNode item : order.path("orderItems")) {
                JsonNode prod = item.path("product");
                String name = prod.path("name").asText("Other");
                categoryCounts.put(name, categoryCounts.getOrDefault(name, 0) + 1);
            }
        }

        result.put("totalUsers", totalUsers);
        result.put("totalOrders", totalOrders);
        result.put("totalRevenue", totalRevenue);
        result.put("mostViewedProduct", "iPhone 13"); // placeholder

        ObjectNode ordersByCategory = mapper.createObjectNode();
        categoryCounts.forEach(ordersByCategory::put);
        result.set("ordersByCategory", ordersByCategory);

        ObjectNode userRoles = mapper.createObjectNode();
        roleCounts.forEach(userRoles::put);
        result.set("userRoles", userRoles);

        return ResponseEntity.ok(result);
    }

}
