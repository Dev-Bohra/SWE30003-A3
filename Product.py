class Product:
    def __init__(self, name, description, price, category):
        self.name = name
        self.description = description
        self.price = price
        self.category = category

    @property
    def name(self):
        return self._name

    @name.setter
    def name(self, value):
        if value is None:
            raise ValueError("Field cannot be empty. Type Required : Text")
        if not isinstance(value, str):
            raise TypeError("Name must be text")
        self._name = value

    @property
    def description(self):
        return self._description

    @description.setter
    def description(self, value):
        if value is None:
            raise ValueError("Field cannot be empty. Type Required : Text")
        if not isinstance(value, str):
            raise TypeError("Description must be text")
        self._description = value

    @property
    def price(self):
        return self._price

    @price.setter
    def price(self, value):
        if value is None:
            raise ValueError("Field cannot be empty. Type Required : Number")
        if not isinstance(value, (int, float)):
            raise TypeError("Price must be a positive number")
        if value < 0:
            raise ValueError("Price cannot be negative")
        self._price = value

    @property
    def category(self):
        return self._category

    @category.setter
    def category(self, value):
        if value is None:
            raise ValueError("Field cannot be empty. Type Required : List")
        if not isinstance(value, list):
            raise TypeError("Category must be a list of 1 or more")
        self._category = value
