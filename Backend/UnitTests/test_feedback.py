import sys
import os
import unittest
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Feedback import Feedback

class TestFeedback(unittest.TestCase):

    def testValidMinimalFeedback(self):
        fb = Feedback(rating=4.5, description="", media=[])
        self.assertEqual(fb.rating, 4.5)
        self.assertEqual(fb.description, "")
        self.assertEqual(fb.media, [])

    def testValidFullFeedback(self):
        media_links = [
            "https://cdn.example.com/img1.jpg",
            "https://cdn.example.com/video1.mp4"
        ]
        fb = Feedback(rating=5, description="Great product", media=media_links)
        self.assertEqual(fb.rating, 5.0)
        self.assertEqual(fb.description, "Great product")
        self.assertEqual(fb.media, media_links)

    def testInvalidRatingType(self):
        with self.assertRaises(TypeError):
            Feedback(rating="five", description="", media=[])

    def testRatingOutOfBounds(self):
        with self.assertRaises(ValueError):
            Feedback(rating=6, description="", media=[])

        with self.assertRaises(ValueError):
            Feedback(rating=-1, description="", media=[])

    def testNonStringDescription(self):
        with self.assertRaises(TypeError):
            Feedback(rating=3, description=123, media=[])

    def testMediaNotList(self):
        with self.assertRaises(TypeError):
            Feedback(rating=3, description="desc", media="not-a-list")

    def testTooManyMediaItems(self):
        links = [
            "https://cdn.example.com/1.jpg",
            "https://cdn.example.com/2.jpg",
            "https://cdn.example.com/3.jpg",
            "https://cdn.example.com/4.jpg",
            "https://cdn.example.com/5.jpg"
        ]
        with self.assertRaises(ValueError):
            Feedback(rating=4, description="desc", media=links)

    def testUnsupportedMediaExtension(self):
        links = ["https://cdn.example.com/file.pdf"]
        with self.assertRaises(ValueError):
            Feedback(rating=4, description="desc", media=links)

if __name__ == "__main__":
    unittest.main()
