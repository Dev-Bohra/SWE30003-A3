import importlib
import json
import pytest
from pathlib import Path

# -- Shared sample data ---------------------------------------------------

SAMPLE_PRODUCTS = [
    {"sku": "p1", "name": "A", "description": "Desc A", "price": 5.00, "category": ["d"], "stock": 10},
    {"sku": "p2", "name": "B", "description": "Desc B", "price": 3.00, "category": ["d"], "stock": 5},
    {"sku": "p3", "name": "C", "description": "Desc C", "price": 7.00, "category": ["d"], "stock": 10},
]

# -- Ensure a fresh singleton before each pytest test ---------------------

@pytest.fixture(autouse=True)
def reload_inventory_module():
    """
    Reload Inventory and Order modules and reset Inventory singleton,
    so each test starts with a clean slate.
    """
    import Backend.Inventory as inv_mod
    inv_mod = importlib.reload(inv_mod)
    import Backend.Order as order_mod
    order_mod = importlib.reload(order_mod)

    inv_mod.Inventory._instance    = None
    inv_mod.Inventory._initialized = False

# -- JSON-backed Inventory fixtures ---------------------------------------

@pytest.fixture
def sample_file(tmp_path):
    """
    Write SAMPLE_PRODUCTS to a temp JSON file and return its path.
    """
    path = tmp_path / "inv.json"
    path.write_text(json.dumps(SAMPLE_PRODUCTS), encoding="utf-8")
    return str(path)

@pytest.fixture
def reload_json():
    """
    Helper to re-read any JSON file from disk.
    """
    def _reload(path):
        return json.loads(Path(path).read_text(encoding="utf-8"))
    return _reload

@pytest.fixture
def inventory(sample_file):
    """
    Construct the singleton-backed Inventory against sample_file.
    Note: DO NOT reload Inventory here – we need to use the
    *same* module that Order.confirm() was bound to.
    """
    import Backend.Inventory as inv_mod
    inv = inv_mod.Inventory(sample_file)
    inv_mod.Inventory._instance = inv
    return inv
