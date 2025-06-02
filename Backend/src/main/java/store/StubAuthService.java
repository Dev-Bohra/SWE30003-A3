package store;

/**
 * Stub implementation of Authentication.
 * Allows login if the customer exists and password equals "password".
 */
public class StubAuthService implements Authentication {
    @Override
    public boolean login(String email, String password) {
        System.out.println("[StubAuthService] login(" + email + ", ***)");
        Customer customer = Database.getInstance().getCustomerByEmail(email);
        return customer != null && "password".equals(password);
    }
}
