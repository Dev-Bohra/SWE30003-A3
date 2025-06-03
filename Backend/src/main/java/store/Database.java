package store;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

public class Database {
    private static Database instance;
    private final Path dbPath;
    private final ObjectMapper mapper = new ObjectMapper();

    private Database(String dbFilepath) {
        this.dbPath = Paths.get(dbFilepath);
    }

    /**
     * Always re-initialize if the filepath differs - for unit tests
     */
    public static synchronized Database getInstance(String dbFilepath) {
        if (instance == null || !instance.dbPath.toString().equals(dbFilepath)) {
            instance = new Database(dbFilepath);
        }
        return instance;
    }

    public static synchronized Database getInstance() {
        if (instance == null) {
            throw new IllegalStateException("Database not initialized");
        }
        return instance;
    }

    private synchronized ObjectNode readRoot() {
        try {
            ObjectNode root;

            if (Files.notExists(dbPath)) {
                // create empty DB file with all expected arrays
                root = mapper.createObjectNode();
            } else {
                JsonNode node = mapper.readTree(dbPath.toFile());
                if (!node.isObject()) throw new IOException("Invalid DB format");
                root = (ObjectNode) node;
            }

            // Ensure all required top-level tables exist
            ensureArray(root, "inventory");
            ensureArray(root, "feedback");
            ensureArray(root, "customers");
            ensureArray(root, "orders");
            ensureArray(root, "supportTickets");

            // Write back in case anything was missing
            writeRoot(root);
            return root;

        } catch (IOException e) {
            throw new RuntimeException("Failed to read database", e);
        }
    }

    private void ensureArray(ObjectNode root, String key) {
        if (!root.has(key) || !root.get(key).isArray()) {
            root.putArray(key);
        }
    }

    private synchronized void writeRoot(ObjectNode root) {
        try {
            mapper.writerWithDefaultPrettyPrinter()
                    .writeValue(dbPath.toFile(), root);
        } catch (IOException e) {
            throw new RuntimeException("Failed to write database", e);
        }
    }

    public List<Product> loadInventory() {
        ObjectNode root = readRoot();
        return mapper.convertValue(root.get("inventory"),
                new TypeReference<List<Product>>() {
                });
    }

    public void saveInventory(List<Product> products) {
        ObjectNode root = readRoot();
        root.set("inventory", mapper.valueToTree(products));
        writeRoot(root);
    }

    public int getStock(String sku) {
        return loadInventory().stream()
                .filter(p -> p.getSku().equals(sku))
                .findFirst()
                .map(Product::getStock)
                .orElseThrow(() -> new IllegalArgumentException("Unknown SKU: " + sku));
    }

    public void updateStock(String sku, int newQty) {
        List<Product> all = loadInventory();
        boolean found = all.removeIf(p -> false); // no-op
        for (Product p : all) {
            if (p.getSku().equals(sku)) {
                p.setStock(newQty);
                found = true;
                break;
            }
        }
        if (!found) throw new IllegalArgumentException("Unknown SKU: " + sku);
        saveInventory(all);
    }

    public List<Feedback> loadFeedback() {
        ObjectNode root = readRoot();
        return mapper.convertValue(root.get("feedback"),
                new TypeReference<List<Feedback>>() {
                });
    }

    public void saveFeedback(Feedback fb) {
        ObjectNode root = readRoot();
        List<Feedback> all = mapper.convertValue(root.get("feedback"),
                new TypeReference<List<Feedback>>() {
                });
        all.add(fb);
        root.set("feedback", mapper.valueToTree(all));
        writeRoot(root);
    }

    // --- Customer methods ---
    /**
     * Find a Customer by their ID. Returns null if not found.
     */
    public Customer getCustomerById(String id) {
        for (Customer c : loadCustomers()) {
            if (c.getCustomerInfo().id().equals(id)) {
                return c;
            }
        }
        return null;
    }

    public void addCustomer(Customer customer) {
        ObjectNode root = readRoot();
        ArrayNode allCust = (ArrayNode) root.get("customers");

        ObjectNode custNode = mapper.createObjectNode();
        custNode.put("id", customer.getCustomerInfo().id());
        custNode.put("firstName", customer.getCustomerInfo().firstName());
        custNode.put("lastName",  customer.getCustomerInfo().lastName());
        custNode.put("email",     customer.getCustomerInfo().email());

        // Serialize cart: let Jackson turn each CartItem into { product: {...}, quantity: x, subtotal: y }
        ObjectNode cartNode = mapper.createObjectNode();
        ArrayNode itemsArr = mapper.createArrayNode();
        for (CartItem ci : customer.getCart().getItems()) {
            // mapper.valueToTree(ci) produces a JSON object with fields "product", "quantity", "subtotal"
            itemsArr.add(mapper.valueToTree(ci));
        }
        cartNode.set("items", itemsArr);
        custNode.set("cart", cartNode);

        allCust.add(custNode);
        writeRoot(root);
    }

    /**
     * Load all customers, reconstructing each Cart by reading full CartItem JSON nodes.
     */
    public List<Customer> loadCustomers() {
        ObjectNode root = readRoot();
        ArrayNode allCustRaw = (ArrayNode) root.get("customers");
        List<Customer> customers = new ArrayList<>();

        for (JsonNode node : allCustRaw) {
            JsonNode idNode    = node.get("id");
            JsonNode fnNode    = node.get("firstName");
            JsonNode lnNode    = node.get("lastName");
            JsonNode emailNode = node.get("email");

            if (idNode == null || fnNode == null || lnNode == null || emailNode == null) {
                System.err.println("Warning: skipping malformed customer entry: " + node.toString());
                continue;
            }

            String id        = idNode.asText();
            String firstName = fnNode.asText();
            String lastName  = lnNode.asText();
            String email     = emailNode.asText();

            // Reconstruct Cart by iterating over each full CartItem JSON
            Cart cart = new Cart();
            JsonNode cartNode = node.get("cart");
            if (cartNode != null && cartNode.has("items")) {
                for (JsonNode ciN : cartNode.get("items")) {
                    // Extract the nested "product" node and "quantity"
                    JsonNode productNode = ciN.get("product");
                    JsonNode qtyNode     = ciN.get("quantity");

                    if (productNode == null || qtyNode == null) {
                        System.err.println("Warning: skipping malformed CartItem: " + ciN.toString());
                        continue;
                    }

                    // Convert productNode → Product
                    Product p = mapper.convertValue(productNode, Product.class);
                    int quantity = qtyNode.asInt();

                    // Use existing CartItem constructor (quantity > 0)
                    try {
                        cart.addItem(p, quantity);
                    } catch (IllegalArgumentException e) {
                        System.err.println("Warning: cannot add CartItem for sku="
                                + p.getSku() + " qty=" + quantity);
                    }
                }
            }

            Customer c = new Customer(
                    id,
                    firstName,
                    lastName,
                    email,
                    cart,
                    new StubAuthService()
            );
            customers.add(c);
        }

        return customers;
    }


    /**
     * Return a Customer by email, or null if not found.
     */
    public Customer getCustomerByEmail(String email) {
        for (Customer c : loadCustomers()) {
            if (c.getCustomerInfo().email().equalsIgnoreCase(email)) {
                return c;
            }
        }
        return null;
    }

    /**
     * Persist the updated Cart for a given user, writing full CartItem JSON for each item.
     */
    public void updateCustomerCart(String userId, Cart cart) {
        ObjectNode root = readRoot();
        ArrayNode allCustRaw = (ArrayNode) root.get("customers");

        for (int i = 0; i < allCustRaw.size(); i++) {
            JsonNode node = allCustRaw.get(i);
            JsonNode idNode = node.get("id");
            if (idNode != null && idNode.asText().equals(userId)) {
                ObjectNode custNode = mapper.createObjectNode();
                custNode.put("id",       node.get("id").asText());
                custNode.put("firstName",node.get("firstName").asText());
                custNode.put("lastName", node.get("lastName").asText());
                custNode.put("email",    node.get("email").asText());

                // Build a brand‐new "cart" node containing full CartItem JSON
                ObjectNode cartNode = mapper.createObjectNode();
                ArrayNode itemsArr = mapper.createArrayNode();
                for (CartItem ci : cart.getItems()) {
                    itemsArr.add(mapper.valueToTree(ci));
                }
                cartNode.set("items", itemsArr);

                custNode.set("cart", cartNode);
                allCustRaw.set(i, custNode);
                writeRoot(root);
                return;
            }
        }
        throw new IllegalArgumentException("Unknown customer ID: " + userId);
    }

    public JsonNode loadOrders() {
        ObjectNode root = readRoot();
        return root.get("orders"); // guaranteed to be an ArrayNode
    }

    public void saveOrder(Order order) {
        ObjectNode root = readRoot();
        ArrayNode ordersArray = (ArrayNode) root.get("orders");

        ObjectNode orderNode = mapper.createObjectNode();
        orderNode.put("orderId", order.getOrderId());
        orderNode.put("customerId", order.getCustomerInfo().id());

        // — Replace the old "items" array with a richer "orderItems" array —
        ArrayNode orderItemsArray = orderNode.putArray("orderItems");
        for (OrderItem oi : order.getOrderItems()) {
            ObjectNode itemNode = mapper.createObjectNode();

            // 1) embed a "product" object with its details
            ObjectNode prodNode = mapper.createObjectNode();
            prodNode.put("sku", oi.getSku());
            prodNode.put("name", oi.getProduct().getName());
            prodNode.put("price", oi.getUnitPrice());

            // If you store any other product fields (category, description), add them here:
            // prodNode.put("category", oi.getProduct().getCategory());
            // prodNode.put("description", oi.getProduct().getDescription());

            itemNode.set("product", prodNode);

            // 2) add the quantity, unitPrice, and totalPrice
            itemNode.put("quantity", oi.getQuantity());
            itemNode.put("unitPrice", oi.getUnitPrice());
            itemNode.put("totalPrice", oi.getTotalPrice());

            orderItemsArray.add(itemNode);
        }

        // Persist top‐level fields exactly as your frontend expects:
        orderNode.put("shippingAddress", order.getShippingAddress());
        orderNode.put("city", order.getCity());
        orderNode.put("postalCode", order.getPostalCode());
        orderNode.put("paymentMethod", order.getPaymentMethod());
        orderNode.put("total", order.getTotal());
        orderNode.put("status", order.getStatus());
        orderNode.put("createdAt", order.getCreatedAt().toString());

        ordersArray.add(orderNode);
        writeRoot(root);
    }

   public boolean updateOrderStatus(String orderId, String newStatus) {
        JsonNode allOrders = loadOrders();
        boolean found = false;

        for (JsonNode orderNode : allOrders) {
            if (orderNode.get("orderId").asText().equals(orderId)) {
                ((ObjectNode) orderNode).put("status", newStatus);
                found = true;
                break;
            }
        }

        if (found) {
            saveOrders(allOrders); // Persist the updated list back to file
        }

        return found;
    }

    public void saveOrders(JsonNode updatedOrders) {
        ObjectNode root = readRoot();
        root.set("orders", updatedOrders); // replace the array
        writeRoot(root);                   // persist to disk
    }
    public void saveSupportTicket(SupportTicket ticket) {
        ObjectNode root = readRoot();
        ArrayNode ticketsArray = (ArrayNode) root.withArray("supportTickets");

        ObjectNode ticketNode = mapper.createObjectNode();
        ticketNode.put("ticketId", ticket.getTicketId());
        ticketNode.put("customerId", ticket.getCustomerId());
        ticketNode.put("subject", ticket.getSubject());
        ticketNode.put("message", ticket.getIssue());
        ticketNode.put("status", ticket.getStatus());
        ticketNode.put("createdAt", ticket.getCreatedAt().toString());

        ticketsArray.add(ticketNode);
        writeRoot(root);
    }


    public List<SupportTicket> getSupportTicketsByCustomerId(String customerId) {
        ArrayNode tickets = (ArrayNode) readRoot().get("supportTickets");
        List<SupportTicket> result = new ArrayList<>();

        for (JsonNode node : tickets) {
            if (node.get("customerId").asText().equals(customerId)) {
                String id = node.get("customerId").asText();
                String subject = node.get("subject").asText();
                String issue = node.get("message").asText();
                result.add(new SupportTicket(id, subject, issue));
            }
        }

        return result;
    }
}