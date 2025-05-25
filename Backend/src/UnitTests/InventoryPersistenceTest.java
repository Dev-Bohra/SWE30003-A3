package UnitTests;

import Store.Inventory;
import Store.Product;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.*;
import java.util.*;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.*;

class InventoryPersistenceTest {
    private static final String SAMPLE_PRODUCTS_JSON = "["
            + "{\"sku\":\"p1\",\"name\":\"A\",\"description\":\"Desc A\",\"price\":5.00,\"category\":[\"d\"],\"stock\":10},"
            + "{\"sku\":\"p2\",\"name\":\"B\",\"description\":\"Desc B\",\"price\":3.00,\"category\":[\"d\"],\"stock\":5},"
            + "{\"sku\":\"p3\",\"name\":\"C\",\"description\":\"Desc C\",\"price\":7.00,\"category\":[\"d\"],\"stock\":10}"
            + "]";

    private Inventory inventory;
    private Path sampleFile;

    private void resetInventorySingleton() {
        try {
            Field f = Inventory.class.getDeclaredField("instance");
            f.setAccessible(true);
            f.set(null, null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @BeforeEach
    void setUp(@TempDir Path tempDir) throws IOException {
        sampleFile = tempDir.resolve("inv.json");
        Files.writeString(sampleFile, SAMPLE_PRODUCTS_JSON, StandardOpenOption.CREATE);

        resetInventorySingleton();
        inventory = Inventory.getInstance(sampleFile.toString());
    }

    @Test
    void testUpdateProductPersists() throws IOException {
        // from test_inventory_persistence.py: test_update_product_persists :contentReference[oaicite:9]{index=9}
        Product p = inventory.getProducts().get("p1");
        p.getCategory().add("new");
        inventory.updateProduct(p);

        // in-memory
        assertEquals(List.of("d", "new"), p.getCategory());

        // on-disk
        ObjectMapper mapper = new ObjectMapper();
        List<Map<String,Object>> data = mapper.readValue(
                sampleFile.toFile(),
                new TypeReference<>() {}
        );
        assertEquals(List.of("d", "new"), data.get(0).get("category"));
    }

    @Test
    void testPurchaseAndReload() throws IOException {
        // from test_inventory_persistence.py: test_purchase_and_reload :contentReference[oaicite:10]{index=10}
        inventory.deductStock("p1", 2);
        assertEquals(8, inventory.getProducts().get("p1").getStock());

        ObjectMapper mapper = new ObjectMapper();
        List<Map<String,Object>> data = mapper.readValue(
                sampleFile.toFile(),
                new TypeReference<>() {}
        );
        assertEquals(8, (Integer)data.get(0).get("stock"));
    }

    @Test
    void testDeleteAndReload() throws IOException {
        // from test_inventory_persistence.py: test_delete_and_reload :contentReference[oaicite:11]{index=11}
        inventory.deleteProduct("p2");
        assertFalse(inventory.getProducts().containsKey("p2"));

        ObjectMapper mapper = new ObjectMapper();
        List<Map<String,Object>> data = mapper.readValue(
                sampleFile.toFile(),
                new TypeReference<>() {}
        );
        Set<String> skus = new HashSet<>();
        for (Map<String,Object> m : data) {
            skus.add((String)m.get("sku"));
        }
        assertEquals(Set.of("p1", "p3"), skus);
    }
}
