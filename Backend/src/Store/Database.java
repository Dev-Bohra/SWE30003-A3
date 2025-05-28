package Store;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

import java.io.IOException;
import java.nio.file.*;
import java.util.List;

public class Database {
    private static Database instance;
    private Path dbPath;
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
            if (Files.notExists(dbPath)) {
                ObjectNode root = mapper.createObjectNode();
                root.putArray("inventory");
                root.putArray("feedback");
                // ensure parent dirs
                Files.createDirectories(dbPath.getParent());
                mapper.writerWithDefaultPrettyPrinter()
                        .writeValue(dbPath.toFile(), root);
                return root;
            }
            JsonNode node = mapper.readTree(dbPath.toFile());
            if (!node.isObject()) throw new IOException("Invalid DB format");
            ObjectNode root = (ObjectNode) node;
            if (!root.has("inventory")) root.putArray("inventory");
            if (!root.has("feedback" )) root.putArray("feedback");
            return root;
        } catch (IOException e) {
            throw new RuntimeException("Failed to read database", e);
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
                new TypeReference<List<Product>>() {});
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
                new TypeReference<List<Feedback>>() {});
    }

    public void saveFeedback(Feedback fb) {
        ObjectNode root = readRoot();
        List<Feedback> all = mapper.convertValue(root.get("feedback"),
                new TypeReference<List<Feedback>>() {});
        all.add(fb);
        root.set("feedback", mapper.valueToTree(all));
        writeRoot(root);
    }
}
