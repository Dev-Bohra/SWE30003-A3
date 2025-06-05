package store;

import java.util.List;

public class Invoice implements Notify {
    private final String invoiceId;
    private final List<OrderItem> orderedItems;
    private final CustomerInfo customerInfo;
    private final double totalPrice;

    public Invoice(Order order) {
        this.customerInfo = order.getCustomerInfo();
        this.orderedItems = order.getOrderItems();
        this.totalPrice = order.getTotal();
        this.invoiceId = order.getOrderId();
    }

    /**
     * Build the full invoice contents as a single String (with newline separators).
     * You can use this both for writing to disk and for sending over HTTP.
     */
    public String generateInvoice() {
        StringBuilder sb = new StringBuilder();

        // 1) Header
        sb.append("Invoice ID: ").append(invoiceId).append("\n");
        sb.append("Customer: ")
                .append(customerInfo.firstName())
                .append(" ")
                .append(customerInfo.lastName())
                .append(" (ID: ")
                .append(customerInfo.id())
                .append(")\n");
        sb.append("--------------------------------------------------\n");

        // 2) Column headings
        sb.append(String.format("%-20s %5s %10s %12s",
                        "Product", "Qty", "Unit Price", "Line Total"))
                .append("\n");

        // 3) Each line‐item
        for (OrderItem item : orderedItems) {
            String name = item.getProduct().getName();
            int    qty  = item.getQuantity();
            double up   = item.getUnitPrice();
            double lt   = item.getTotalPrice();

            sb.append(String.format("%-20s %5d %10.2f %12.2f",
                            name, qty, up, lt))
                    .append("\n");
        }

        // 4) Footer
        sb.append("--------------------------------------------------\n");
        sb.append(String.format("TOTAL: %38.2f", totalPrice))
                .append("\n");

        return sb.toString();
    }

    public void send(Object reciever) {
        /*
         * logic to send email with invoice would go here
         */

        if (reciever instanceof CustomerInfo) {
            String invoice = generateInvoice();
                /*
                logic to send invoice
                 */
            System.out.println("Invoice sent");
        }
        System.out.println("Invoice not sent need customer info to send");

    }
}
