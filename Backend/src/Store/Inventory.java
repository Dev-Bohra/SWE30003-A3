package Store;// Store.Inventory.java

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Inventory {
    private static Inventory instance;
    private final String jsonFilepath;
    private Map<String, Product> products;

    private Inventory(String jsonFilepath) {
        this.jsonFilepath = jsonFilepath;
        this.products     = new HashMap<>();
        loadFromJson(jsonFilepath);
    }

    public static Inventory getInstance(String jsonFilepath) {
        if (instance == null) {
            instance = new Inventory(jsonFilepath);
        }
        return instance;
    }

    public static Inventory getInstance() {
        if (instance == null) {
            throw new IllegalStateException("Store.Inventory instance not initialized");
        }
        return instance;
    }

    @SuppressWarnings("unchecked")
    private void loadFromJson(String filepath) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            List<Map<String,Object>> records = mapper.readValue(
                    new File(filepath),
                    new TypeReference<List<Map<String,Object>>>(){}
            );
            for (Map<String,Object> entry : records) {
                for (String field : List.of("sku","name","description","price","category","stock")) {
                    if (!entry.containsKey(field)) {
                        throw new RuntimeException("Missing '" + field + "' in JSON record: " + entry);
                    }
                }
                String sku         = (String) entry.get("sku");
                String name        = (String) entry.get("name");
                String desc        = (String) entry.get("description");
                double price       = ((Number)entry.get("price")).doubleValue();
                List<String> cat   = (List<String>) entry.get("category");
                int stock          = ((Number)entry.get("stock")).intValue();

                Product prod = new Product(sku, name, desc, price, cat, stock);
                products.put(sku, prod);
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to load inventory from JSON", e);
        }
    }

    private void saveToJson() {
        ObjectMapper mapper = new ObjectMapper();
        List<Map<String,Object>> payload = products.values().stream().map(p -> {
            Map<String,Object> m = new HashMap<>();
            m.put("sku", p.getSku());
            m.put("name", p.getName());
            m.put("description", p.getDescription());
            m.put("price", p.getPrice());
            m.put("category", p.getCategory());
            m.put("stock", p.getStock());
            return m;
        }).toList();

        try {
            mapper.writerWithDefaultPrettyPrinter()
                    .writeValue(new File(jsonFilepath), payload);
        } catch (IOException e) {
            throw new RuntimeException("Failed to save inventory to JSON", e);
        }
    }

    public Map<String,Product> getProducts() {
        return new HashMap<>(products);
    }

    public void updateProduct(Product product) {
        products.put(product.getSku(), product);
        saveToJson();
    }

    public void deductStock(String sku, int quantity) {
        if (!products.containsKey(sku)) {
            throw new RuntimeException("SKU '" + sku + "' not found");
        }
        Product prod = products.get(sku);
        if (prod.getStock() < quantity) {
            throw new RuntimeException("Insufficient stock for '" + sku + "'");
        }
        prod.setStock(prod.getStock() - quantity);
        updateProduct(prod);
    }

    public void deleteProduct(String sku) {
        if (!products.containsKey(sku)) {
            throw new RuntimeException("SKU '" + sku + "' not found");
        }
        products.remove(sku);
        saveToJson();
    }
}
