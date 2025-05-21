# Backend/Order.py

from uuid import uuid4
from datetime import datetime
from .CartItem import CartItem
from .Inventory import Inventory
from .OrderItem import OrderItem

class Order:
    """
    Represents a confirmed purchase, tracking items, status, totals, timestamps.
    """
    #TODO add a customer reference, Payment, and shipping details generate invoice
    def __init__(self, cart_items: list[CartItem]):
        self.order_id = str(uuid4())
        self.created_at = datetime.now()
        # snapshot each CartItem as an OrderItem
        self.items: list[OrderItem] = [
            OrderItem(ci)
            for ci in cart_items
        ]
        self.status = "PENDING"

    @property
    def total(self) -> float:
        """Sum of all OrderItem.total_price."""
        return sum(item.total_price for item in self.items)

    def validate_items(self) -> None:
        """Ensure there's at least one item in the order."""
        if not self.items:
            raise ValueError("Order must contain at least one item")

    def confirm(self) -> None:
        """
        Confirm the order:
          1) validate items
          2) deduct stock from each product
          3) mark status as CONFIRMED
        """
        inv = Inventory._instance
        if inv is None:
            raise RuntimeError("Inventory instance not initialized")
        self.validate_items()
        for item in self.items:
            if not hasattr(item.product, 'stock') or item.product.stock < item.quantity:
                raise ValueError(f"Insufficient stock to confirm order for '{item.product.name}'")
            inv.purchase(item.product.sku, item.quantity)
        self.status = "CONFIRMED"
