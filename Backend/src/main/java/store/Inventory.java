package store;

import com.fasterxml.jackson.databind.JsonNode;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Singleton Inventory delegating JSON I/O to Database.
 */
public class Inventory {
    private static Inventory instance;
    private final Database db;

    private Inventory(String dbFilepath) {
        this.db = Database.getInstance(dbFilepath);
    }

    public static synchronized Inventory getInstance(String dbFilepath) {
        if (instance == null) {
            instance = new Inventory(dbFilepath);
        }
        return instance;
    }

    public static Inventory getInstance() {
        if (instance == null) {
            throw new IllegalStateException("Inventory not initialized");
        }
        return instance;
    }

    /**
     * SKU → Product map for tests/UI
     */
    public Map<String, Product> getProducts() {
        return db.loadInventory().stream()
                .collect(Collectors.toMap(Product::getSku, p -> p));
    }

    public Product getProduct(String sku) {
        Product p = getProducts().get(sku);
        if (p == null) throw new IllegalArgumentException("Unknown SKU: " + sku);
        return p;
    }

    /**
     * Real stock check: return false if any OrderItem.quantity > DB stock
     */
    public boolean verifyStock(List<OrderItem> items) {
        for (OrderItem oi : items) {
            int avail = db.getStock(oi.getProduct().getSku());
            if (oi.getQuantity() > avail) return false;
        }
        return true;
    }

    /**
     * Subtract each OrderItem.qty from DB and persist.
     */
    public void deductStock(List<OrderItem> items) {
        List<Product> all = db.loadInventory();
        for (OrderItem oi : items) {
            String sku = oi.getProduct().getSku();
            int oldQty = db.getStock(sku);
            int newQty = oldQty - oi.getQuantity();
            if (newQty < 0) throw new IllegalStateException("Negative stock for " + sku);
            db.updateStock(sku, newQty);
        }
    }

    /**
     * Admin: adjust stock by delta and notify
     */
    public void updateStock(String sku, int delta) {
        int oldQty = db.getStock(sku);
        int newQty = oldQty + delta;
        if (newQty < 0) throw new IllegalArgumentException("Resulting stock < 0");
        db.updateStock(sku, newQty);
    }

    /**
     * Persist arbitrary changes to a Product (e.g. category list).
     */
    public void updateProduct(Product updated) {
        List<Product> all = db.loadInventory();
        boolean found = false;
        for (int i = 0; i < all.size(); i++) {
            if (all.get(i).getSku().equals(updated.getSku())) {
                all.set(i, updated);
                found = true;
                break;
            }
        }
        if (!found) throw new IllegalArgumentException("Unknown SKU: " + updated.getSku());
        db.saveInventory(all);
    }

    /**
     * Remove entirely.
     */
    public void deleteProduct(String sku) {
        List<Product> all = db.loadInventory();
        boolean removed = all.removeIf(p -> p.getSku().equals(sku));
        if (!removed) throw new IllegalArgumentException("Unknown SKU: " + sku);
        db.saveInventory(all);
    }

    public List<Product> getPopularProducts() {
        // 1) Fetch raw "orders" array from Database.json
        JsonNode ordersNode = db.loadOrders();
        Map<String, Integer> soldCount = new HashMap<>();

        if (ordersNode != null && ordersNode.isArray()) {
            for (JsonNode orderNode : ordersNode) {
                JsonNode itemsNode = orderNode.get("items");
                if (itemsNode != null && itemsNode.isArray()) {
                    for (JsonNode itemNode : itemsNode) {
                        String sku = itemNode.get("sku").asText();
                        int qty  = itemNode.get("quantity").asInt();
                        soldCount.put(sku, soldCount.getOrDefault(sku, 0) + qty);
                    }
                }
            }
        }

        // 2) Get all in-stock products
        List<Product> inStock = getProducts().values().stream()
                .filter(p -> p.getStock() > 0)
                .collect(Collectors.toList());

        // 3) Sort in-stock by soldCount descending (default to 0 if never sold)
        inStock.sort((a, b) -> {
            int countA = soldCount.getOrDefault(a.getSku(), 0);
            int countB = soldCount.getOrDefault(b.getSku(), 0);
            return Integer.compare(countB, countA);
        });

        // 4) Return top 3 (or fewer if less than 3 exist)
        return inStock.stream()
                .limit(3)
                .collect(Collectors.toList());
    }
}
