package UnitTests;

import Store.Inventory;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.Files;
import java.nio.file.Path;

import static org.junit.jupiter.api.Assertions.*;

class InventorySingletonTest {

    private void resetInventorySingleton() {
        try {
            Field f = Inventory.class.getDeclaredField("instance");
            f.setAccessible(true);
            f.set(null, null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testSingletonInstancesAreSame(@TempDir Path tempDir) throws IOException {
        String sampleJson = "[]";
        Path file = tempDir.resolve("inv.json");
        Files.writeString(file, sampleJson);

        resetInventorySingleton();
        Inventory inv1 = Inventory.getInstance(file.toString());
        Inventory inv2 = Inventory.getInstance(file.toString());
        assertSame(inv1, inv2, "getInstance should always return the same singleton");
    }

    @Test
    void testOnlyLoadedOnce(@TempDir Path tempDir) throws Exception {
        // 1) Clear out the singleton
        Field instField = Inventory.class.getDeclaredField("instance");
        instField.setAccessible(true);
        instField.set(null, null);

        // 2) Create two different JSON files
        Path firstJson  = tempDir.resolve("first.json");
        Path secondJson = tempDir.resolve("second.json");
        Files.writeString(firstJson, "[]");
        Files.writeString(secondJson, "[{\"sku\":\"x\",\"name\":\"Y\",\"description\":\"D\",\"price\":1.0,\"category\":[],\"stock\":0}]");

        // 3) Load from the first path
        Inventory inv1 = Inventory.getInstance(firstJson.toString());
        // 4) “Load” from the second—should return the same instance
        Inventory inv2 = Inventory.getInstance(secondJson.toString());

        // 5) Check that the private jsonFilepath stayed as the first one
        Field pathField = Inventory.class.getDeclaredField("jsonFilepath");
        pathField.setAccessible(true);
        String storedPath = (String) pathField.get(inv1);

        assertEquals(firstJson.toString(), storedPath,
                "Inventory should have loaded only once, using the first JSON path");
    }
}
