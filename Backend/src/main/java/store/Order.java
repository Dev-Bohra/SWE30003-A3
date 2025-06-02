package store;

import java.util.List;
import java.util.UUID;

public class Order {
    private final String orderId = UUID.randomUUID().toString();
    private final List<OrderItem> items;
    private final Inventory inventory;
    private final Payment payment;
    private final CustomerInfo customerInfo;
    private String trackingId;

    private String status = "NEW";

    public Order(CustomerInfo customerInfo,
                 List<CartItem> cartItems,
                 Inventory inventory,
                 Payment payment) {
        this.items = cartItems.stream()
                .map(OrderItem::new)
                .toList();
        this.inventory = inventory;
        this.payment = payment;
        this.customerInfo = customerInfo;
    }

    public CustomerInfo getCustomerInfo() {
        return customerInfo;
    }

    public List<OrderItem> getOrderItems() {
        return items;
    }

    public void checkout() {
        if (!inventory.verifyStock(items)) {
            status = "OUT_OF_STOCK";
            return;
        }
        if (!payment.initiatePayment(getTotal())) {
            status = "PAYMENT_FAILED";
            return;
        }
        inventory.deductStock(items);
        new Invoice(this);
        Shipment shipment = new Shipment(this);
        displayOrderConfirmation();
    }

    private void displayOrderConfirmation() {
        System.out.println("Order " + orderId + " is " + status);
    }

    public String getOrderId() {
        return orderId;
    }

    public double getTotal() {
        return items.stream().mapToDouble(OrderItem::getTotalPrice).sum();
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
