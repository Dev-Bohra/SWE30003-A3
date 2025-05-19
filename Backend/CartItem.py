# Backend/CartItem.py
from .Product import Product

class CartItem:
    """
    Represents a single product selection in a customer's active shopping cart,
    tracking quantity and running subtotal.
    """
    def __init__(self, product: Product, quantity: int):
        if quantity <= 0:
            raise ValueError("Quantity must be positive")
        self.product = product
        self.quantity = quantity

    @property
    def subtotal(self) -> float:
        """Line-item total (unit price × quantity)."""
        return self.product.price * self.quantity

    def validate_availability(self) -> None:
        """
        Check internal product.stock for availability.
        """
        if not hasattr(self.product, 'stock') or self.product.stock < self.quantity:
            raise ValueError(f"Not enough stock for '{self.product.name}'")