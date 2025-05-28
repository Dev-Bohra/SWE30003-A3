// src/main/java/Store/Cart.java
package Store;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Holds the customer's selected products and can spin up an Order.
 */
public class Cart {
    private final List<CartItem> items = new ArrayList<>();

    public void addItem(Product product, int quantity) {
        Objects.requireNonNull(product, "Product required");
        if (quantity <= 0) throw new IllegalArgumentException("Quantity must be > 0");

        // validate against stock
        CartItem temp = new CartItem(product, quantity);
        temp.validateAvailability();

        for (CartItem ci : items) {
            if (ci.getProduct().getSku().equals(product.getSku())) {
                ci.setQuantity(ci.getQuantity() + quantity);
                return;
            }
        }
        items.add(temp);
    }

    public void removeItem(String sku) {
        boolean removed = items.removeIf(ci -> ci.getProduct().getSku().equals(sku));
        if (!removed) {
            throw new NoSuchElementException("Item not in cart: " + sku);
        }
    }

    public void removeItem(Product product) {
        removeItem(product.getSku());
    }

    public double calculateTotal() {
        return items.stream().mapToDouble(CartItem::getSubtotal).sum();
    }

    public void clear() {
        items.clear();
    }

    public List<CartItem> getItems() {
        return Collections.unmodifiableList(items);
    }

    /**
     * Spins up an Order wired with the POC stubs/singletons.
     * Now passes List<CartItem> directly (matches Order ctor).
     */
    public Order initiateOrder(CustomerInfo customerInfo) {
        Inventory inventory = Inventory.getInstance();
        Payment payment = new Payment(new StubPaymentGateway());

        return new Order(
                customerInfo,
                items,
                inventory,
                payment
        );
    }
}
