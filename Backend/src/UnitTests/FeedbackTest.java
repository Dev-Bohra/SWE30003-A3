package UnitTests;

import Store.Feedback;
import org.junit.jupiter.api.Test;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class FeedbackTest {
    // based on test_feedback.py :contentReference[oaicite:8]{index=8}

    @Test
    void testValidMinimalFeedback() {
        Feedback fb = new Feedback(4.5, "", List.of());
        assertEquals(4.5, fb.getRating(), 1e-6);
        assertEquals("", fb.getDescription());
        assertEquals(List.of(), fb.getMedia());
    }

    @Test
    void testValidFullFeedback() {
        List<String> mediaLinks = List.of(
                "https://cdn.example.com/img1.jpg",
                "https://cdn.example.com/video1.mp4"
        );
        Feedback fb = new Feedback(5.0, "Great product", mediaLinks);
        assertEquals(5.0, fb.getRating(), 1e-6);
        assertEquals("Great product", fb.getDescription());
        assertEquals(mediaLinks, fb.getMedia());
    }

    @Test
    void testRatingOutOfBounds() {
        assertThrows(IllegalArgumentException.class, () -> new Feedback(6.0, "", List.of()));
        assertThrows(IllegalArgumentException.class, () -> new Feedback(-1.0, "", List.of()));
    }

    @Test
    void testDescriptionNull() {
        assertThrows(IllegalArgumentException.class, () -> new Feedback(3.0, null, List.of()));
    }

    @Test
    void testMediaNull() {
        assertThrows(IllegalArgumentException.class, () -> new Feedback(3.0, "desc", null));
    }

    @Test
    void testTooManyMediaItems() {
        List<String> links = List.of(
                "https://cdn.example.com/1.jpg",
                "https://cdn.example.com/2.jpg",
                "https://cdn.example.com/3.jpg",
                "https://cdn.example.com/4.jpg",
                "https://cdn.example.com/5.jpg"
        );
        assertThrows(IllegalArgumentException.class, () -> new Feedback(4.0, "desc", links));
    }

    @Test
    void testUnsupportedMediaExtension() {
        List<String> links = List.of("https://cdn.example.com/file.pdf");
        assertThrows(IllegalArgumentException.class, () -> new Feedback(4.0, "desc", links));
    }
}
