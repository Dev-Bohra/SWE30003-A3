// Payment.java
package Store;

/**
 * Payment logic (steps 4–7 in checkout).
 */
public class Payment {
    private final PaymentGateway gateway;

    public Payment(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public boolean initiatePayment(Order order) {
        boolean ok = gateway.processTransaction(order.getOrderId(),
                order.getTotal());
        if (ok) order.confirmPayment();
        return ok;
    }
}
