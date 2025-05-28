package Store;

import java.util.List;
import java.util.UUID;

public class Order  {
    private final String orderId = UUID.randomUUID().toString();
    private final List<OrderItem> items;
    private final Inventory inventory;
    private final Payment payment;
    private final CustomerInfo customerInfo;

    private String status = "NEW";
    private String trackingId;

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

    public List<OrderItem> getOrderItems(){
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
        new Shipment();
        displayOrderConfirmation();
    }

    void confirmPayment() {
        status = "PAID";
    }

    void shipmentCreated(String tid) {
        this.trackingId = tid;
        this.status = "SHIPPED";
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

    public String getStatus() {
        return status;
    }

    public void trackOrder() {
//        String st = shipment.queryStatus(trackingId);
//        status = st;
//        notify.sendStatusNotification(this, st);
//        System.out.println("Shipment status: " + st);
    }
}
