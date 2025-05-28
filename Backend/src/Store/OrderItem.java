package Store;

/**
 * Immutable detail of a CartItem for an Order.
 */
public class OrderItem {
    private final Product product;
    private final int quantity;
    private final double unitPrice;
    private final double totalPrice;

    public OrderItem(CartItem ci) {
        this.product    = ci.getProduct();
        this.quantity   = ci.getQuantity();
        this.unitPrice  = product.getPrice();
        this.totalPrice = ci.getSubtotal();
    }

    public Product getProduct()   { return product;    }
    public int     getQuantity()  { return quantity;   }
    public double  getUnitPrice() { return unitPrice;  }
    public double  getTotalPrice(){ return totalPrice; }
}
