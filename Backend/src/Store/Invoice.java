package Store;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
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
     * Generates a text invoice file named "invoice-<invoiceId>.txt",
     * overwrites if existing, and returns the File object.
     */
    public File generateInvoice() {
        String fileName = "invoice-" + invoiceId + ".txt";
        File file = new File(fileName);

        try (BufferedWriter writer = new BufferedWriter(new FileWriter(file, false))) {
            // Header
            writer.write("Invoice ID: " + invoiceId);
            writer.newLine();
            writer.write("Customer: " +
                    customerInfo.firstName() + " " +
                    customerInfo.lastName() +
                    " (ID: " + customerInfo.id() + ")");
            writer.newLine();
            writer.write("--------------------------------------------------");
            writer.newLine();

            // Line-items
            writer.write(String.format("%-20s %5s %10s %12s",
                    "Product", "Qty", "Unit Price", "Line Total"));
            writer.newLine();
            for (OrderItem item : orderedItems) {
                String name = item.getProduct().getName();
                int qty = item.getQuantity();
                double up = item.getUnitPrice();
                double lt = item.getTotalPrice();
                writer.write(String.format("%-20s %5d %10.2f %12.2f",
                        name, qty, up, lt));
                writer.newLine();
            }

            writer.write("--------------------------------------------------");
            writer.newLine();
            writer.write(String.format("TOTAL: %38.2f", totalPrice));
            writer.newLine();
        } catch (IOException e) {
            throw new RuntimeException("Failed to write invoice file: " + fileName, e);
        }
        return file;
    }

    public void send(Object reciever) {
        /*
         * logic to send email with invoice would go here
         */

        if (reciever instanceof CustomerInfo) {
            File invoice = generateInvoice();
                /*
                logic to send invoice
                 */
            System.out.println("Invoice sent");
        }
        System.out.println("Invoice not sent need customer info to send");

    }
}
