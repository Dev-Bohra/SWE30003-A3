// ProductTest.java
package UnitTests;

import Store.Product;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class ProductTest {
    @Test
    void testValidProduct() {
        Product p = new Product(
                "SKU1",
                "Dell G15",
                "Specs",
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
    void testDescriptionNull() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU3", "Name", null, 1.0, List.of("d"), 1)
        );
    }

    @Test
    void testPriceNegative() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU4", "Name", "Desc", -10.0, List.of("d"), 1)
        );
    }

    @Test
    void testCategoryNull() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU5", "Name", "Desc", 1.0, null, 1)
        );
    }

    @Test
    void testStockNegative() {
        assertThrows(IllegalArgumentException.class, () ->
                new Product("SKU6", "Name", "Desc", 1.0, List.of("d"), -1)
        );
    }
}
