package store;

/**
 * Interface for Authentication services.
 */
public interface Authentication {
    boolean login(String email, String password);
}
