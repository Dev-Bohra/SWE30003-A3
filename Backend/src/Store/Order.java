package Store;// Store.Order.java

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.time.LocalDateTime;

public class Order {
    private String orderId;
    private LocalDateTime createdAt;
    private Inventory inv;
    private List<OrderItem> items;
    private String status;

    public Order(List<CartItem> cartItems) {
        this.orderId   = UUID.randomUUID().toString();
        this.createdAt = LocalDateTime.now();
        this.inv       = Inventory.getInstance();
        if (this.inv == null) {
            throw new IllegalStateException("Store.Inventory instance not initialized");
        }
        this.items  = new ArrayList<>();
        for (CartItem ci : cartItems) {
            this.items.add(new OrderItem(ci));
        }
        this.status = "PENDING";
    }

    public String getOrderId()                 { return orderId; }
    public LocalDateTime getCreatedAt()        { return createdAt; }
    public List<OrderItem> getItems()          { return new ArrayList<>(items); }
    public String getStatus()                  { return status; }

    public double getTotal() {
        double sum = 0;
        for (OrderItem item : items) {
            sum += item.getTotalPrice();
        }
        return sum;
    }

    public boolean verifyStock() {
        if (items.isEmpty()) {
            throw new IllegalStateException("Store.Order must contain at least one item");
        }
        for (OrderItem item : items) {
            if (item.getProduct().getStock() < item.getQuantity()) {
                throw new IllegalStateException(
                        "Insufficient stock to confirm order for '"
                                + item.getProduct().getName() + "'"
                );
            }
        }
        return true;
    }

    public void deductStock() {
        for (OrderItem item : items) {
            inv.deductStock(item.getProduct().getSku(), item.getQuantity());
        }
    }

    public void checkout() {
        if (verifyStock()) {
            deductStock();
            this.status = "CONFIRMED";
        }
    }
}
