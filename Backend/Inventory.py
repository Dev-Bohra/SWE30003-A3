import json
from .Product import Product

class Inventory:
    _instance = None
    _initialized = False

    def __new__(cls, json_filepath: str):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance

    def __init__(self, json_filepath: str):
        if Inventory._initialized:
            return

        self._json_filepath = json_filepath
        self.products: dict[str, Product] = {}
        self._load_from_json(json_filepath)

        Inventory._initialized = True

    def _load_from_json(self, filepath: str) -> None:
        with open(filepath, 'r', encoding='utf-8') as f:
            records = json.load(f)
        for entry in records:
            for field in ("sku","name","description","price","category","stock"):
                if field not in entry:
                    raise KeyError(f"Missing '{field}' in JSON record: {entry}")
            prod = Product(
                sku=entry["sku"],
                name=entry["name"],
                description=entry["description"],
                price=entry["price"],
                category=entry["category"],
                stock=entry["stock"]
            )
            self.products[prod.sku] = prod

    def _save_to_json(self) -> None:
        payload = [
            {
                "sku": p.sku,
                "name": p.name,
                "description": p.description,
                "price": p.price,
                "category": p.category,
                "stock": p.stock
            }
            for p in self.products.values()
        ]
        with open(self._json_filepath, 'w', encoding='utf-8') as f:
            json.dump(payload, f, indent=2)

    def update_product(self, product: Product) -> None:
        self.products[product.sku] = product
        self._save_to_json()

    def purchase(self, sku: str, quantity: int) -> None:
        if sku not in self.products:
            raise KeyError(f"SKU '{sku}' not found")
        prod = self.products[sku]
        if prod.stock < quantity:
            raise ValueError(f"Insufficient stock for '{sku}'")
        prod.stock -= quantity
        self.update_product(prod)

    def delete_product(self, sku: str) -> None:
        if sku not in self.products:
            raise KeyError(f"SKU '{sku}' not found")
        del self.products[sku]
        self._save_to_json()
