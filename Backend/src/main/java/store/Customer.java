// src/main/java/store/Customer.java
package store;

import java.util.Collections;
import java.util.List;

/**
 * Represents a system user who can browse, order, give feedback, and raise tickets.
 */
public class Customer {
    private final String id;
    private final CustomerInfo customerInfo;
    private final Cart cart;
    private final Authentication auth;

    public Customer(String id,
                    String firstName,
                    String lastName,
                    String email,
                    Cart cart,
                    Authentication auth) {
        this.id = id;
        this.customerInfo = new CustomerInfo(this.id, firstName, lastName, email);
        this.cart = cart;
        this.auth = auth;
    }

    public boolean login(String user, String pw) {
        return auth.login(user, pw);
    }

    public List<Product> browseProducts() {
        return Database.getInstance().loadInventory();
    }

    public CustomerInfo getCustomerInfo() {
        return this.customerInfo;
    }

    public Cart getCart() {
        return cart;
    }

    /**
     * Place an order using the Cart. Must pass shipping & payment info.
     *
     * @param shippingAddress street address for shipping
     * @param city            city for shipping
     * @param postalCode      postal code for shipping
     * @param paymentMethod   e.g. "credit_card", "paypal"
     * @return a fully‐constructed Order which has not yet been persisted
     */
    public Order placeOrder(
            String shippingAddress,
            String city,
            String postalCode,
            String paymentMethod
    ) {
        // Delegate to Cart.initiateOrder(...)
        Order o = cart.initiateOrder(
                this.customerInfo,
                shippingAddress,
                city,
                postalCode,
                paymentMethod
        );
        // Run the “checkout” workflow (verify stock, payment, invoice, shipment, etc.)
        o.checkout();
        return o;
    }

    public void submitFeedback(String orderId,
                               String productId,
                               int rating,
                               String comment) {
        Feedback fb = new Feedback(orderId, productId, rating, comment, Collections.emptyList());
        fb.submit();
    }

    public void raiseSupportTicket(String issue) {
        SupportTicket ticket = new SupportTicket(id, issue);
        ticket.send(this.customerInfo);
    }
}
