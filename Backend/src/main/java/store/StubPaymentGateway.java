package store;

/**
 * Stubbed gateway that always succeeds.
 */
public class StubPaymentGateway implements PaymentGateway {
    @Override
    public boolean processTransaction(double amount) {
        return true;
    }
}
