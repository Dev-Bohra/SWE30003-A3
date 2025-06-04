package UnitTests;

import store.*;
import store.Order;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.*;
import java.util.List;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;

import static org.junit.jupiter.api.Assertions.*;

class CartTest {
    private static final String SAMPLE_PRODUCTS_JSON = "["
            + "{\"sku\":\"p1\",\"name\":\"A\",\"description\":\"Desc A\",\"price\":5.00,\"category\":[\"d\"],\"stock\":10},"
            + "{\"sku\":\"p2\",\"name\":\"B\",\"description\":\"Desc B\",\"price\":3.00,\"category\":[\"d\"],\"stock\":5},"
            + "{\"sku\":\"p3\",\"name\":\"C\",\"description\":\"Desc C\",\"price\":7.00,\"category\":[\"d\"],\"stock\":10}"
            + "]";

    private Inventory inventory;
    private Cart cart;
    private Path sampleFile;
    private CustomerInfo customerInfo = new CustomerInfo("1", "fake", "customer", "customer@email");

    private void resetInventorySingleton() {
        try {
            Field f = Inventory.class.getDeclaredField("instance");
            f.setAccessible(true);
            f.set(null, null);
            // also reset Database singleton
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
        // create combined DB with just inventory
        String dbJson = "{ \"inventory\":" + SAMPLE_PRODUCTS_JSON + ", \"feedback\":[] }";
        Files.writeString(sampleFile, dbJson, StandardOpenOption.CREATE);

        resetInventorySingleton();
        inventory = Inventory.getInstance(sampleFile.toString());
        cart = new Cart();
    }

    @Test
    void testCartItemSubtotal() {
        Product p = inventory.getProducts().get("p1");
        CartItem ci = new CartItem(p, 2);
        assertEquals(p.getPrice() * 2, ci.getSubtotal(), 1e-6);
    }

    @Test
    void testValidateAvailabilityThrowsIfInsufficientStock() {
        Product p = inventory.getProducts().get("p2");
        CartItem ci = new CartItem(p, p.getStock() + 1);
        assertThrows(IllegalStateException.class, ci::validateAvailability);
    }

    @Test
    void testCartAddRemoveCalculate() {
        cart.addItem(inventory.getProducts().get("p1"), 2);
        cart.addItem(inventory.getProducts().get("p2"), 1);
        assertEquals(13.00, cart.calculateTotal(), 1e-6);

        cart.removeItem(inventory.getProducts().get("p1"));
        assertEquals(3.00, cart.calculateTotal(), 1e-6);
    }

    @Test
    void testOrderConfirmReducesInventoryStock() throws IOException {
        String sku = "p3";
        int start = inventory.getProducts().get(sku).getStock();

        cart.addItem(inventory.getProducts().get(sku), 2);
        Order order = cart.initiateOrder(customerInfo, "123 main st", "melb", "3088", "paypal");
        order.checkout();

        assertEquals(start - 2, inventory.getProducts().get(sku).getStock());
    }

    @Test
    void testOrderConfirmPersistsToJson() throws IOException {
        String sku = "p2";
        cart.addItem(inventory.getProducts().get(sku), 1);
        Order order = cart.initiateOrder(customerInfo, "123 main st", "melb", "3088", "paypal");
        order.checkout();

        // read back the JSON file
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> root = mapper.readValue(
                sampleFile.toFile(),
                new TypeReference<>() {
                }
        );
        @SuppressWarnings("unchecked")
        List<Map<String, ?>> inv = (List<Map<String, ?>>) root.get("inventory");

        Integer diskStock = inv.stream()
                .filter(m -> sku.equals(m.get("sku")))
                .findFirst()
                .map(m -> (Integer) m.get("stock"))
                .orElseThrow();
        assertEquals(inventory.getProducts().get(sku).getStock(),
                diskStock.intValue());
    }
}