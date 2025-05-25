package Store;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

/**
 * Holds the customer's selected products and computes totals.
 */
public class Cart {
    private final List<CartItem> items = new ArrayList<>();

    /**
     * Add a product to the cart. If already present, bump its quantity.
     */
    public void addItem(Product product, int quantity) {
        Objects.requireNonNull(product, "Store.Product cannot be null");
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be positive");
        }
        for (CartItem item : items) {
            if (item.getProduct().equals(product)) {
                item.setQuantity(item.getQuantity() + quantity);
                return;
            }
        }
        items.add(new CartItem(product, quantity));
    }

    /**
     * Remove all line items for the given product.
     */
    public void removeItem(Product product) {
        Objects.requireNonNull(product, "Store.Product cannot be null");
        items.removeIf(item -> item.getProduct().equals(product));
    }

    /**
     * Grand total across all line items.
     */
    public double calculateTotal() {
        return items.stream()
                .mapToDouble(CartItem::getSubtotal)
                .sum();
    }

    /**
     * Empty the cart (e.g. after order confirm).
     */
    public void clear() {
        items.clear();
    }

    /**
     * Turn this cart into an Store.Order.
     * Raises if empty. Does not clear the cart—call clear() after confirmation.
     */
    public Order initiateOrder() {
        if (items.isEmpty()) {
            throw new IllegalStateException("Cannot initiate order with no items");
        }
        // snapshot the cart items into a new Store.Order
        return new Order(items);
    }

    /**
     * Expose a read-only view of the current items (useful for testing or inspection).
     */
    public List<CartItem> getItems() {
        return List.copyOf(items);
    }
}
