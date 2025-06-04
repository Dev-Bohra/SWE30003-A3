// PaymentGateway.java
package store;

/**
 * «interface» PaymentGateway
 */
public interface PaymentGateway {
    boolean processTransaction(double amount);
}
