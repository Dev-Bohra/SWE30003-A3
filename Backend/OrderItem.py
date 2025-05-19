# Backend/OrderItem.py
from .CartItem import CartItem

class OrderItem:
    """
    Immutable snapshot of a Cart Item for creating a record on a order.
    """
    def __init__(self, cartItem: CartItem):
        self.product = cartItem.product
        self.quantity = cartItem.quantity
        self.unit_price = cartItem.product.price
        self.total_price = cartItem.subtotal