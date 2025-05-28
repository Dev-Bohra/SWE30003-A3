// FeedbackTest.java
package UnitTests;

import Store.Database;
import Store.Feedback;
import org.junit.jupiter.api.*;
import org.junit.jupiter.api.io.TempDir;

import java.nio.file.*;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FeedbackTest {
    private Database db;

    @BeforeEach
    void init(@TempDir Path tmp) throws Exception {
        Path dbPath = tmp.resolve("db.json");
        Files.writeString(dbPath, "{ \"inventory\":[], \"feedback\":[] }");
        db = Database.getInstance(dbPath.toString());
    }

    @Test
    void testSubmitPersists() {
        Feedback fb = new Feedback("order1", "SKU1", 4, "Good", Collections.emptyList());
        fb.submit();
        List<Feedback> all = db.loadFeedback();
        assertEquals(1, all.size());
        assertEquals("order1", all.get(0).getOrderId());
    }

    @Test
    void testRatingBounds() {
        assertThrows(IllegalArgumentException.class,
                () -> new Feedback("o", "p", 6, "x", Collections.emptyList()));
        assertThrows(IllegalArgumentException.class,
                () -> new Feedback("o", "p", -1, "x", Collections.emptyList()));
    }
}
