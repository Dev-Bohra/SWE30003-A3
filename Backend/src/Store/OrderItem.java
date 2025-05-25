package Store;

public class OrderItem {
    private Product product;
    private int quantity;
    private double unitPrice;
    private double totalPrice;

    public OrderItem(CartItem cartItem) {
        this.product    = cartItem.getProduct();
        this.quantity   = cartItem.getQuantity();
        this.unitPrice  = product.getPrice();
        this.totalPrice = cartItem.getSubtotal();
    }

    public Product getProduct()   { return product; }
    public int     getQuantity()  { return quantity; }
    public double  getUnitPrice() { return unitPrice; }
    public double  getTotalPrice(){ return totalPrice; }
}
