// src/main/java/store/Cart.java
package store;

import java.util.*;

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

    public void subtractItem(String sku, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity to subtract must be > 0");
        }

        CartItem foundItem = null;
        for (CartItem ci : items) {
            if (ci.getProduct().getSku().equals(sku)) {
                foundItem = ci;
                break;
            }
        }

        if (foundItem == null) {
            throw new NoSuchElementException("Item not in cart: " + sku);
        }

        int currentQty = foundItem.getQuantity();
        if (quantity > currentQty) {
            throw new IllegalArgumentException(
                    "Cannot subtract more than existing quantity (" + currentQty + ")");
        }

        int newQty = currentQty - quantity;
        if (newQty <= 0) {
            // Remove entirely
            items.remove(foundItem);
        } else {
            // Simply reduce
            foundItem.setQuantity(newQty);
        }
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
     * Now passes all four shipping/payment fields as required by the new Order(...) constructor.
     *
     * @param customerInfo    the customer placing this order
     * @param shippingAddress street address for shipping
     * @param city            city for shipping
     * @param postalCode      postal code for shipping
     * @param paymentMethod   e.g. "credit_card", "paypal"
     * @return a new Order instance, ready for checkout()
     */
    public Order initiateOrder(
            CustomerInfo customerInfo,
            String shippingAddress,
            String city,
            String postalCode,
            String paymentMethod
    ) {
        Inventory inventory = Inventory.getInstance();
        Payment payment = new Payment(new StubPaymentGateway());

        return new Order(
                customerInfo,       // CustomerInfo
                items,              // List<CartItem>
                inventory,          // Inventory singleton
                payment,            // Payment stub
                shippingAddress,    // String shippingAddress
                city,               // String city
                postalCode,         // String postalCode
                paymentMethod       // String paymentMethod
        );
    }
}
