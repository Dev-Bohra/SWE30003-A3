package store.controllers;

import org.springframework.web.bind.annotation.*;
import store.Inventory;
import store.Product;

import java.util.List;

/**
 * Simply delegates to Inventory
 */
@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final Inventory inventory = Inventory.getInstance();

    @GetMapping("")
    public List<Product> getAllProducts() {
        return inventory.getProducts().values().stream().toList();
    }

    @GetMapping("/{sku}")
    public Product getProductBySku(@PathVariable String sku) {
        return inventory.getProduct(sku);
    }

    @GetMapping("/popular")
    public List<Product> getPopularProducts() {
        return inventory.getPopularProducts();
    }
}
