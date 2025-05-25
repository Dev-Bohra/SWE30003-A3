import pytest
from decimal import Decimal
from Backend.Cart import Cart
from Backend.CartItem import CartItem

def test_cart_item_subtotal(inventory):
    p = inventory.products["p1"]
    ci = CartItem(p, 2)
    assert ci.subtotal == pytest.approx(p.price * 2)

def test_validate_availability_raises_if_insufficient_stock(inventory):
    p = inventory.products["p2"]
    ci = CartItem(p, p.stock + 1)
    with pytest.raises(ValueError):
        ci.validate_availability()

def test_cart_add_remove_calculate(inventory):
    cart = Cart()
    cart.add_item(inventory.products["p1"], 2)
    cart.add_item(inventory.products["p2"], 1)
    assert cart.calculate_total() == Decimal("13.00")

    cart.remove_item(inventory.products["p1"])
    assert cart.calculate_total() == Decimal("3.00")

def test_order_confirm_reduces_inventory_stock(inventory):
    sku = "p3"
    start = inventory.products[sku].stock

    cart = Cart()
    cart.add_item(inventory.products[sku], 2)
    order = cart.initiate_order()
    order.confirm()

    assert inventory.products[sku].stock == start - 2

def test_order_confirm_persists_to_json(inventory, sample_file, reload_json):
    sku = "p2"
    cart = Cart()
    cart.add_item(inventory.products[sku], 1)
    order = cart.initiate_order()
    order.confirm()

    data = reload_json(sample_file)
    rec = next(item for item in data if item["sku"] == sku)
    assert rec["stock"] == inventory.products[sku].stock
