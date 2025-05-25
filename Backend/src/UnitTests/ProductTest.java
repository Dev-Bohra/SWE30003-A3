package UnitTests;

import Store.Product;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {
    // based on test_product.py and mocks.py

    @Test
    void testValidProduct() {
        Product p = new Product(
                "SKU1",
                "Dell G15",
                "16GB RAM / NVidia GPU / 1 TB SSD",
                100.0,
                List.of("Laptop"),
                5
        );
        assertEquals("Dell G15", p.getName());
    }

    @Test
    void testNameEmpty() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU2", "", "Desc", 1.0, List.of("d"), 1)
        );
    }

    @Test
    void testNameNull() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU9", null, "Desc", 1.0, List.of("d"), 1)
        );
    }

    @Test
    void testDescriptionNull() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU10", "Name", null, 1.0, List.of("d"), 1)
        );
    }

    @Test
    void testPriceNegative() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU5", "Name", "Desc", -50.0, List.of("d"), 1)
        );
    }

    @Test
    void testCategoryNull() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU8", "Name", "Desc", 1.0, null, 1)
        );
    }

    @Test
    void testStockNegative() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU11", "Name", "Desc", 1.0, List.of("d"), -1)
        );
    }
}
