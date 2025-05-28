package Store;

import java.util.Objects;

public record CustomerInfo(String id, String firstName, String lastName, String email) {
    public CustomerInfo {
        Objects.requireNonNull(id, "id required");
        Objects.requireNonNull(firstName, "firstName required");
        Objects.requireNonNull(lastName, "lastName required");
        Objects.requireNonNull(email, "email required");
    }
}