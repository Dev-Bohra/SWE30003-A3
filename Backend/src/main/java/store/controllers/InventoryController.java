package store.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import store.Database;
import store.Inventory;
import store.Product;

import java.util.List;
import java.util.Map;

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
    @PostMapping("/")
    public ResponseEntity<Product> addProduct(@RequestBody Product product) {
        inventory.addProduct(product);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    @PutMapping("/{sku}/restock")
    public ResponseEntity<Product> restockProduct(@PathVariable String sku, @RequestBody Map<String, Integer> request) {
        Integer quantity = request.get("quantity");
        if (quantity == null || quantity <= 0) {
            return ResponseEntity.badRequest().build();
        }
        inventory.restockProduct(sku, quantity);
        Product updatedProduct = inventory.getProduct(sku);
        if (updatedProduct == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedProduct);
    }

    @PutMapping("/{sku}/toggle-status")
    public ResponseEntity<Product> toggleStatus(@PathVariable String sku) {
        Product toggled = inventory.toggleProductStatus(sku);
        return toggled != null ? ResponseEntity.ok(toggled) : ResponseEntity.notFound().build();
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
