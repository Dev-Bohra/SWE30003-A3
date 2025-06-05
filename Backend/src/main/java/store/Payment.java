package store;

public class Payment {
    private final PaymentGateway gateway;

    public Payment(PaymentGateway gateway) {
        this.gateway = gateway;
    }

    public boolean initiatePayment(double amount) {
        boolean ok = gateway.processTransaction(amount);

        return ok;
    }
}
