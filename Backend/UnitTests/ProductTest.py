import sys
import os
import unittest

# Enable import from parent directory
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from Product import Product  # Make sure Product.py defines the class correctly

class TestProduct(unittest.TestCase):

    def testValidProduct(self):
        p = Product(
            name="Dell G15",
            description="16GB RAM / NVidia GPU / 1 TB SSD",
            price=100,
            category=["Laptop"]
        )
        self.assertEqual(p.name, "Dell G15")
        self.assertEqual(p.description, "16GB RAM / NVidia GPU / 1 TB SSD")
        self.assertEqual(p.price, 100)
        self.assertEqual(p.category, ["Laptop"])

    def testNameEmpty(self):
        with self.assertRaises(ValueError):
            Product(name="", description="desc", price=100, category=["Electronics"])

    def testNameNotString(self):
        with self.assertRaises(TypeError):
            Product(name=123, description="desc", price=100, category=["Electronics"])

    def testDescriptionNotString(self):
        with self.assertRaises(TypeError):
            Product(name="TV", description=456, price=100, category=["Electronics"])

    def testPriceNegative(self):
        with self.assertRaises(ValueError):
            Product(name="TV", description="desc", price=-50, category=["Electronics"])

    def testPriceWrongType(self):
        with self.assertRaises(TypeError):
            Product(name="TV", description="desc", price="free", category=["Electronics"])

    def testCategoryNotList(self):
        with self.assertRaises(TypeError):
            Product(name="TV", description="desc", price=500, category="Electronics")

    def testCategoryEmptyList(self):
        with self.assertRaises(ValueError):
            Product(name="TV", description="desc", price=500, category=None)

    def testNoneValues(self):
        with self.assertRaises(ValueError):
            Product(name=None, description="desc", price=100, category=["Electronics"])
        with self.assertRaises(ValueError):
            Product(name="TV", description=None, price=100, category=["Electronics"])
        with self.assertRaises(ValueError):
            Product(name="TV", description="desc", price=None, category=["Electronics"])
        with self.assertRaises(ValueError):
            Product(name="TV", description="desc", price=100, category=None)

if __name__ == "__main__":
    unittest.main()


