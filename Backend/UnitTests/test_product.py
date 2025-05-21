import sys, os, unittest

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from mocks import make_dummy_product

class TestProduct(unittest.TestCase):

    def testValidProduct(self):
        p = make_dummy_product(
            sku="SKU1",
            name="Dell G15",
            description="16GB RAM / NVidia GPU / 1 TB SSD",
            price=100,
            category=["Laptop"],
            stock=5
        )
        self.assertEqual(p.name, "Dell G15")

    def testNameEmpty(self):
        with self.assertRaises(ValueError):
            make_dummy_product(sku="SKU2", name="", stock=1)

    def testNameNotString(self):
        with self.assertRaises(TypeError):
            make_dummy_product(sku="SKU3", name=123, stock=1)

    def testDescriptionNotString(self):
        with self.assertRaises(TypeError):
            make_dummy_product(sku="SKU4", description=456, stock=1)

    def testPriceNegative(self):
        with self.assertRaises(ValueError):
            make_dummy_product(sku="SKU5", price=-50, stock=1)

    def testPriceWrongType(self):
        with self.assertRaises(TypeError):
            make_dummy_product(sku="SKU6", price="free", stock=1)

    def testCategoryNotList(self):
        with self.assertRaises(TypeError):
            make_dummy_product(sku="SKU7", category="Electronics", stock=1)

    def testCategoryEmpty(self):
        with self.assertRaises(ValueError):
            make_dummy_product(sku="SKU8", category=None, stock=1)

    def testNoneValues(self):
        with self.assertRaises(ValueError):
            make_dummy_product(sku="SKU9", name=None, stock=1)
        with self.assertRaises(ValueError):
            make_dummy_product(sku="SKU10", description=None, stock=1)
        with self.assertRaises(ValueError):
            make_dummy_product(sku="SKU11", price=None, stock=1)
        with self.assertRaises(ValueError):
            make_dummy_product(sku="SKU12", category=None, stock=1)

if __name__ == "__main__":
    unittest.main()