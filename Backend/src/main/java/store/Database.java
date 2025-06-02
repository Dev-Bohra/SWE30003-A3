package store;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.nio.file.*;
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
     * Persist a new customer (with an initial empty cart).
     */
    public void addCustomer(Customer customer) {
        ObjectNode root = readRoot();
        ArrayNode all = (ArrayNode) root.get("customers");

        ObjectNode customerNode = mapper.createObjectNode();
        customerNode.put("id", customer.getCustomerInfo().id());
        customerNode.put("firstName", customer.getCustomerInfo().firstName());
        customerNode.put("lastName", customer.getCustomerInfo().lastName());
        customerNode.put("email", customer.getCustomerInfo().email());
        customerNode.set("cart", mapper.valueToTree(customer.getCart()));

        all.add(customerNode);
        writeRoot(root);
    }

    /**
     * Load all customers (reconstructing Customer from JSON).
     */
    public List<Customer> loadCustomers() {
        ObjectNode root = readRoot();
        JsonNode raw = root.get("customers");

        List<Customer> customers = new ArrayList<>();
        for (JsonNode node : raw) {
            String id = node.get("id").asText();
            String firstName = node.get("firstName").asText();
            String lastName = node.get("lastName").asText();
            String email = node.get("email").asText();

            Cart cart = node.has("cart") && !node.get("cart").isNull()
                    ? mapper.convertValue(node.get("cart"), Cart.class)
                    : new Cart();

            customers.add(new Customer(id, firstName, lastName, email, cart, new StubAuthService()));
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
}
