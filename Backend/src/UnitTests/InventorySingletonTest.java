// InventorySingletonTest.java
package UnitTests;

import Store.Inventory;
import Store.Database;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;

import java.io.IOException;
import java.lang.reflect.Field;
import java.nio.file.*;
import static org.junit.jupiter.api.Assertions.*;

class InventorySingletonTest {

    private void resetSingletons() {
        try {
            Field f = Inventory.class.getDeclaredField("instance");
            f.setAccessible(true);
            f.set(null, null);
            Class<?> dbCls = Class.forName("Store.Database");
            Field dbField = dbCls.getDeclaredField("instance");
            dbField.setAccessible(true);
            dbField.set(null, null);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    @Test
    void testSingletonInstancesAreSame(@TempDir Path tempDir) throws IOException {
        String sampleJson = "{\"inventory\":[],\"feedback\":[]}";
        Path file = tempDir.resolve("db.json");
        Files.writeString(file, sampleJson);

        resetSingletons();
        Inventory inv1 = Inventory.getInstance(file.toString());
        Inventory inv2 = Inventory.getInstance(file.toString());
        assertSame(inv1, inv2);
    }

    @Test
    void testOnlyLoadedOnce(@TempDir Path tempDir) throws Exception {
        resetSingletons();
        Path firstJson  = tempDir.resolve("first.json");
        Path secondJson = tempDir.resolve("second.json");
        Files.writeString(firstJson, "{\"inventory\":[],\"feedback\":[]}");
        Files.writeString(secondJson,"{\"inventory\":[{\"sku\":\"x\",\"name\":\"Y\",\"description\":\"D\",\"price\":1.0,\"category\":[],\"stock\":0}],\"feedback\":[]}");

        Inventory inv1 = Inventory.getInstance(firstJson.toString());
        Inventory inv2 = Inventory.getInstance(secondJson.toString());
        assertSame(inv1, inv2);

        Field pathField = Database.class.getDeclaredField("dbPath");
        pathField.setAccessible(true);
        Path stored = (Path) pathField.get(Database.getInstance());
        assertEquals(firstJson.toString(), stored.toString());
    }
}
