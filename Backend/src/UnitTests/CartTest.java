package UnitTests;

import Store.Cart;
import Store.CartItem;
import Store.Inventory;
import Store.Product;
import Store.Order;
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
        // write SAMPLE_PRODUCTS to temp JSON file (sample_file fixture) :contentReference[oaicite:1]{index=1}
        sampleFile = tempDir.resolve("inv.json");
        Files.writeString(sampleFile, SAMPLE_PRODUCTS_JSON, StandardOpenOption.CREATE);

        // reset singleton and load new inventory :contentReference[oaicite:2]{index=2}
        resetInventorySingleton();
        inventory = Inventory.getInstance(sampleFile.toString());

        cart = new Cart();
    }

    @Test
    void testCartItemSubtotal() {
        // from test_cart.py: test_cart_item_subtotal :contentReference[oaicite:3]{index=3}
        Product p = inventory.getProducts().get("p1");
        CartItem ci = new CartItem(p, 2);
        assertEquals(p.getPrice() * 2, ci.getSubtotal(), 1e-6);
    }

    @Test
    void testValidateAvailabilityThrowsIfInsufficientStock() {
        // from test_cart.py: test_validate_availability_raises_if_insufficient_stock :contentReference[oaicite:4]{index=4}
        Product p = inventory.getProducts().get("p2");
        CartItem ci = new CartItem(p, p.getStock() + 1);
        assertThrows(IllegalStateException.class, ci::validateAvailability);
    }

    @Test
    void testCartAddRemoveCalculate() {
        // from test_cart.py: test_cart_add_remove_calculate :contentReference[oaicite:5]{index=5}
        cart.addItem(inventory.getProducts().get("p1"), 2);
        cart.addItem(inventory.getProducts().get("p2"), 1);
        assertEquals(13.00, cart.calculateTotal(), 1e-6);

        cart.removeItem(inventory.getProducts().get("p1"));
        assertEquals(3.00, cart.calculateTotal(), 1e-6);
    }

    @Test
    void testOrderConfirmReducesInventoryStock() {
        // from test_cart.py: test_order_confirm_reduces_inventory_stock :contentReference[oaicite:6]{index=6}
        String sku = "p3";
        int start = inventory.getProducts().get(sku).getStock();

        cart.addItem(inventory.getProducts().get(sku), 2);
        Order order = cart.initiateOrder();
        order.checkout();

        assertEquals(start - 2, inventory.getProducts().get(sku).getStock());
    }

    @Test
    void testOrderConfirmPersistsToJson() throws IOException {
        // from test_cart.py: test_order_confirm_persists_to_json :contentReference[oaicite:7]{index=7}
        String sku = "p2";
        cart.addItem(inventory.getProducts().get(sku), 1);
        Order order = cart.initiateOrder();
        order.checkout();

        ObjectMapper mapper = new ObjectMapper();
        List<Map<String,Object>> data = mapper.readValue(
                sampleFile.toFile(),
                new TypeReference<>() {}
        );
        Map<String,Object> rec = data.stream()
                .filter(m -> sku.equals(m.get("sku")))
                .findFirst()
                .orElseThrow();
        Integer diskStock = (Integer) rec.get("stock");
        assertEquals(inventory.getProducts().get(sku).getStock(), diskStock.intValue());
    }
}
