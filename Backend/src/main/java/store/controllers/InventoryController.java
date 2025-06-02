// src/main/java/store/controllers/InventoryController.java
package store.controllers;

import org.springframework.web.bind.annotation.*;
import store.Inventory;
import store.Product;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Exposes REST endpoints for fetching the current product inventory.
 */
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    // We assume Inventory was already initialized in Main: Inventory.getInstance("Database.json")
    private final Inventory inventory = Inventory.getInstance();

    @GetMapping("")
    public List<Product> getAllProducts() {
        // Inventory.getProducts() returns a Map<SKU, Product>.
        // We just return the List<Product> as JSON.
        return inventory.getProducts()
                .values()
                .stream()
                .collect(Collectors.toList());
    }

    @GetMapping("/{sku}")
    public Product getProductBySku(@PathVariable String sku) {
        return inventory.getProduct(sku);
    }
}
