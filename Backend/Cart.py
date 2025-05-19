# Backend/Cart.py

from .Product import Product
from .CartItem import CartItem
from .Order import Order

class Cart:
    """
    Holds the customer's selected products and computes totals.
    """
    def __init__(self):
        self.items: list[CartItem] = []

    def add_item(self, product: Product, quantity: int = 1) -> None:
        """
        Add a product to the cart. If already present, bump its quantity.
        """
        for item in self.items:
            if item.product == product:
                item.quantity += quantity
                return
        self.items.append(CartItem(product, quantity))

    def remove_item(self, product: Product) -> None:
        """
        Remove all line items for the given product.
        """
        self.items = [
            item for item in self.items
            if item.product != product
        ]

    def calculate_total(self) -> float:
        """
        Grand total across all line items.
        """
        return sum(item.subtotal for item in self.items)

    def clear(self) -> None:
        """
        Empty the cart (e.g. after order confirm).
        """
        self.items.clear()

    def initiate_order(self) -> "Order":
        """
        Turn this cart into an Order.
        Raises if empty. Does not clear the cart—call clear() after confirmation.
        """
        if not self.items:
            raise ValueError("Cannot initiate order with no items")
        return Order(self.items)
