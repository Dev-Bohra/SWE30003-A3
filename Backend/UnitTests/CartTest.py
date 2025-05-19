import pytest
from decimal import Decimal

from Backend.Cart import Cart
from Backend.CartItem import CartItem
from Backend.Product import Product


def test_cart_item_subtotal():
    p = Product('p1', 'dummy product', 10.00, list("dummy"),  stock=5)
    ci = CartItem(p, 2)
    assert ci.subtotal == 20.00

def test_validate_availability_raises_if_insufficient_stock():
    p = Product('p2', 'Gadget',5.00, list("dummy"), stock=1)
    ci = CartItem(p, 2)
    with pytest.raises(ValueError):
        ci.validate_availability()

def test_cart_add_remove_calculate():
    cart = Cart()
    p1 = Product('p1', 'A', 5.00, list("dummy"), stock=10)
    p2 = Product('p2', 'B', 3.00, list("dummy"), stock=5)
    cart.add_item(p1, 2)
    cart.add_item(p2, 1)
    assert cart.calculate_total() == Decimal('13.00')
    cart.remove_item(p1)
    assert cart.calculate_total() == Decimal('3.00')

def test_initiate_order_and_confirm():
    cart = Cart()
    p = Product('p3', 'C', 7.00, list("dummy"), stock=10)
    cart.add_item(p, 3)
    order = cart.initiate_order()
    assert order.status == 'PENDING'
    assert order.total == Decimal('21.00')
    order.confirm()
    assert order.status == 'CONFIRMED'
