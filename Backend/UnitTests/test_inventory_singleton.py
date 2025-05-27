import importlib

def test_singleton_instances_are_same(sample_file):
    # reload the module so _instance/_initialized are back to defaults
    import Backend.Inventory as inv_mod
    inv_mod = importlib.reload(inv_mod)
    inv_mod.Inventory._instance    = None
    inv_mod.Inventory._initialized = False

    # instantiate twice from the same class object
    inv1 = inv_mod.Inventory(sample_file)
    inv2 = inv_mod.Inventory(sample_file)
    assert inv1 is inv2

def test_only_loaded_once(sample_file, monkeypatch):
    import Backend.Inventory as inv_mod
    inv_mod = importlib.reload(inv_mod)
    inv_mod.Inventory._instance    = None
    inv_mod.Inventory._initialized = False

    calls = {"count": 0}
    def fake_load(self, path):
        calls["count"] += 1
        setattr(self, "products", {})

    monkeypatch.setattr(inv_mod.Inventory, "_load_from_json", fake_load)

    inv_mod.Inventory("first.json")
    inv_mod.Inventory("second.json")
    assert calls["count"] == 1

