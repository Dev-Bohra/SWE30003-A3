package store.dtos;

import store.Order;

/**
 * A simple wrapper DTO so we can return both:
 *   1) The created Order object
 *   2) The invoice text as a Base64‐encoded String
 *   3) The suggested filename for the invoice
 */
public class OrderWithInvoiceResponse {
    private Order order;
    private String invoiceBase64;
    private String filename;

    public OrderWithInvoiceResponse() { }

    public OrderWithInvoiceResponse(Order order, String invoiceBase64, String filename) {
        this.order         = order;
        this.invoiceBase64 = invoiceBase64;
        this.filename      = filename;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public String getInvoiceBase64() {
        return invoiceBase64;
    }

    public void setInvoiceBase64(String invoiceBase64) {
        this.invoiceBase64 = invoiceBase64;
    }

    public String getFilename() {
        return filename;
    }

    public void setFilename(String filename) {
        this.filename = filename;
    }
}
