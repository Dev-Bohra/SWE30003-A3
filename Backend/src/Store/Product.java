package Store;

import java.util.List;

public class Product {
    private String sku;
    private String name;
    private String description;
    private double price;
    private List<String> category;
    private int stock;

    public Product(String sku,
                   String name,
                   String description,
                   double price,
                   List<String> category,
                   int stock) {
        this.sku = sku;
        setName(name);
        setDescription(description);
        setPrice(price);
        setCategory(category);
        setStock(stock);
    }

    public String getSku() { return sku; }

    public String getName() { return name; }
    public void setName(String name) {
        if (name == null || name.trim().isEmpty()) {
            throw new IllegalArgumentException("Field cannot be empty. Type Required : Text");
        }
        this.name = name;
    }

    public String getDescription() { return description; }
    public void setDescription(String description) {
        if (description == null) {
            throw new IllegalArgumentException("Field cannot be empty. Type Required : Text");
        }
        this.description = description;
    }

    public double getPrice() { return price; }
    public void setPrice(double price) {
        if (Double.isNaN(price)) {
            throw new IllegalArgumentException("Field cannot be empty. Type Required : Number");
        }
        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }
        this.price = price;
    }

    public List<String> getCategory() { return category; }
    public void setCategory(List<String> category) {
        if (category == null) {
            throw new IllegalArgumentException("Field cannot be empty. Type Required : List");
        }
        this.category = category;
    }

    public int getStock() { return stock; }

    public void setStock(int stock) {
        if (stock < 0) {
            throw new IllegalArgumentException("Stock cannot be negative");
        }
        this.stock = stock;
    }
}
