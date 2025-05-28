// StubPaymentGateway.java
package Store;

/**
 * Stubbed gateway that always succeeds.
 */
public class StubPaymentGateway implements PaymentGateway {
    @Override
    public boolean processTransaction(String orderId, double amount) {
        System.out.println("[StubPaymentGateway] processTransaction("
                + orderId + ", " + amount + ")");
        return true;
    }
}
