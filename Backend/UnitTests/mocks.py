
from Backend.Product import Product

_SENTINEL = object()

def make_dummy_product(
    sku="SKU1",
    name="Sample",
    description="A sample product",
    price=1.23,
    category=_SENTINEL,
    stock=1
):
    """
    Factory for a Product with reasonable defaults:
     - if you omit `category`, you get ['default']
     - if you explicitly pass category=None, that None is passed to Product
       so its own validation will raise ValueError.
    """
    if category is _SENTINEL:
        category = ["default"]
    return Product(
        sku=sku,
        name=name,
        description=description,
        price=price,
        category=category,
        stock=stock
    )
