// PaymentGateway.java
package Store;

/**
 * «interface» PaymentGateway
 */
public interface PaymentGateway {
    boolean processTransaction(String orderId, double amount);
}
