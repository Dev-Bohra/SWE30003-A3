package store;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

/**
 * Represents a placed order; 
 * now also carries shipping address, city, postal code, paymentMethod, and createdAt.
 */
public class Order {
    private final String orderId = UUID.randomUUID().toString();
    private final List<OrderItem> items;
    private final Inventory inventory;
    private final Payment payment;       // stubbed‐gateway
    private final CustomerInfo customerInfo;

    // ← These four fields must be stored in the Order:
    private String shippingAddress;
    private String city;
    private String postalCode;
    private String paymentMethod;        // e.g. "credit_card", "paypal", etc.

    private final String createdAt;      // ISO timestamp

    private String trackingId;
    private String status = "NEW";

    /**
     * Now accepts shipping & payment info.
     *
     * @param customerInfo    the customer placing this order
     * @param cartItems       List<CartItem> from the customer’s cart
     * @param inventory       Inventory singleton to verify/deduct stock
     * @param payment         Payment object (with StubPaymentGateway)
     * @param shippingAddress shipping street address
     * @param city            shipping city
     * @param postalCode      shipping postal code
     * @param paymentMethod   e.g. "credit_card", "paypal", etc.
     */
    public Order(
            CustomerInfo customerInfo,
            List<CartItem> cartItems,
            Inventory inventory,
            Payment payment,
            String shippingAddress,
            String city,
            String postalCode,
            String paymentMethod
    ) {
        this.items = cartItems.stream()
                .map(OrderItem::new)
                .toList();
        this.inventory = inventory;
        this.payment = payment;
        this.customerInfo = customerInfo;

        this.shippingAddress = shippingAddress;
        this.city = city;
        this.postalCode = postalCode;
        this.paymentMethod = paymentMethod;
        this.createdAt = Instant.now().toString();
    }

    // ——————————————————————————————————————————————————————————————————————————
    // Getters & Setters
    // ——————————————————————————————————————————————————————————————————————————

    public String getOrderId() {
        return orderId;
    }

    public List<OrderItem> getOrderItems() {
        return items;
    }

    public CustomerInfo getCustomerInfo() {
        return customerInfo;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public String getCity() {
        return city;
    }

    public String getPostalCode() {
        return postalCode;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public double getTotal() {
        return items.stream().mapToDouble(OrderItem::getTotalPrice).sum();
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    // ——————————————————————————————————————————————————————————————————————————
    // The “checkout” workflow:
    // (1) verifyStock
    // (2) initiatePayment
    // (3) deductStock
    // (4) new Invoice(this)
    // (5) new Shipment(this)
    // (6) mark status = "PAID"
    // ——————————————————————————————————————————————————————————————————————————
    public void checkout() {
        // 1) Verify stock
        if (!inventory.verifyStock(items)) {
            status = "OUT_OF_STOCK";
            return;
        }

        // 2) Attempt payment
        if (!payment.initiatePayment(getTotal())) {
            status = "PAYMENT_FAILED";
            return;
        }

        // 3) Deduct stock
        inventory.deductStock(items);

        // 4) Generate invoice (and send “invoice sent” notification)
        new Invoice(this);

        // 5) Create a Shipment (which sets trackingId + flips status → “IN_TRANSIT” + sends stub notification)
        Shipment shipment = new Shipment(this);

        // 6) Now mark as paid
        status = "PAID";

        displayOrderConfirmation();
    }

    private void displayOrderConfirmation() {
        System.out.println("Order " + orderId + " is " + status);
    }
}
