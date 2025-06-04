// InventoryPersistenceTest.java
package UnitTests;

import store.Inventory;
import store.Product;
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

    private void resetSingletons() {
        try {
            Field f = Inventory.class.getDeclaredField("instance");
            f.setAccessible(true);
            f.set(null, null);
            Class<?> dbCls = Class.forName("store.Database");
            Field dbField = dbCls.getDeclaredField("instance");
            dbField.setAccessible(true);
            dbField.set(null, null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @BeforeEach
    void setUp(@TempDir Path tempDir) throws IOException {
        sampleFile = tempDir.resolve("database.json");
        String dbJson = "{ \"inventory\":" + SAMPLE_PRODUCTS_JSON + ", \"feedback\":[] }";
        Files.writeString(sampleFile, dbJson);

        resetSingletons();
        inventory = Inventory.getInstance(sampleFile.toString());
    }

    @Test
    void testUpdateProductPersists() throws IOException {
        Product p = inventory.getProducts().get("p1");
        p.getCategory().add("new");
        inventory.updateProduct(p); // adjust category directly then updateProduct
        assertTrue(inventory.getProducts().get("p1").getCategory().contains("new"));
    }

    @Test
    void testRestockAndReload() throws IOException {
        inventory.restockProduct("p1", 8);
        assertEquals(8, inventory.getProducts().get("p1").getStock());

        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> root = mapper.readValue(
                sampleFile.toFile(),
                new TypeReference<>() {
                }
        );
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> inv =
                (List<Map<String, Object>>) root.get("inventory");
        assertEquals(8, (Integer) inv.get(0).get("stock"));
    }

    @Test
    void testDeleteAndReload() throws IOException {
        inventory.deleteProduct("p2");  // if you’ve added deleteProduct
        assertFalse(inventory.getProducts().containsKey("p2"));

        ObjectMapper mapper = new ObjectMapper();
        @SuppressWarnings("unchecked")
        Map<String, Object> root = mapper.readValue(
                sampleFile.toFile(),
                new TypeReference<>() {
                }
        );
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> inv =
                (List<Map<String, Object>>) root.get("inventory");

        Set<String> skus = new HashSet<>();
        for (var m : inv) skus.add((String) m.get("sku"));
        assertEquals(Set.of("p1", "p3"), skus);
    }
}
