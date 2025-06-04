package store.dtos;

import java.util.Objects;

/**
 * Carries the shipping + payment info from the frontend when the user clicks “Confirm Order.”
 */
public class OrderRequest {
    private String shippingAddress;
    private String city;
    private String postalCode;
    private String paymentMethod; // e.g. "credit_card", "paypal", etc.

    public OrderRequest() { }

    public OrderRequest(String shippingAddress, String city, String postalCode, String paymentMethod) {
        this.shippingAddress = Objects.requireNonNull(shippingAddress, "Shipping address required");
        this.city            = Objects.requireNonNull(city,            "City required");
        this.postalCode      = Objects.requireNonNull(postalCode,      "Postal code required");
        this.paymentMethod   = Objects.requireNonNull(paymentMethod,   "Payment method required");
    }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getCity() { return city; }
    public void setCity(String city) {
        this.city = city;
    }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }
}
