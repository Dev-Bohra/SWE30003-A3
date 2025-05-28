// src/main/java/Store/CartItem.java
package Store;

import java.util.List;
import java.util.Objects;

/**
 * One line-item in a Cart.
 */
public class CartItem {
    private final Product product;
    private int quantity;

    public CartItem(Product product, int quantity) {
        Objects.requireNonNull(product, "Product required");
        if (quantity <= 0) throw new IllegalArgumentException("Quantity > 0");
        this.product = product;
        this.quantity = quantity;
    }

    public Product getProduct() {
        return product;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int q) {
        if (q <= 0) throw new IllegalArgumentException("Quantity > 0");
        quantity = q;
    }

    public double getSubtotal() {
        return product.getPrice() * quantity;
    }

    /**
     * Checks availability by converting this CartItem to an OrderItem
     * and asking Inventory.verifyStock. Throws if stock is insufficient.
     */
    public void validateAvailability() {
        OrderItem oi = new OrderItem(this);
        boolean ok = Inventory
                .getInstance()
                .verifyStock(List.of(oi));
        if (!ok) {
            throw new IllegalStateException(
                    "Insufficient stock for SKU: " + product.getSku()
            );
        }
    }
}
