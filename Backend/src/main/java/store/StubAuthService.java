// StubAuthService.java
package store;

/**
 * Stub implementation of Authentication.
 */
public class StubAuthService implements Authentication {
    @Override
    public boolean login(String username, String password) {
        System.out.println("[StubAuthService] login(" + username + ", ***)");
        return "admin".equals(username) && "password".equals(password);
    }
}
