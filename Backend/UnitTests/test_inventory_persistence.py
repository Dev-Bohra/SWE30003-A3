def test_update_product_persists(inventory, sample_file, reload_json):
    p = inventory.products["p1"]
    p.category.append("new")
    inventory.update_product(p)

    # in-memory
    assert inventory.products["p1"].category == ["d", "new"]
    # on-disk
    data = reload_json(sample_file)
    assert data[0]["category"] == ["d", "new"]

def test_purchase_and_reload(inventory, sample_file, reload_json):
    inventory.purchase("p1", 2)
    assert inventory.products["p1"].stock == 8

    data = reload_json(sample_file)
    assert data[0]["stock"] == 8

def test_delete_and_reload(inventory, sample_file, reload_json):
    inventory.delete_product("p2")
    assert "p2" not in inventory.products

    data = reload_json(sample_file)
    # only p1 and p3 remain
    skus = {item["sku"] for item in data}
    assert skus == {"p1", "p3"}
