package store;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.util.List;

public class Product {
    private final String sku;
    private final String name;
    private final String description;
    private final double price;
    private final List<String> category;
    private int stock;

    @JsonCreator
    public Product(
            @JsonProperty("sku") String sku,
            @JsonProperty("name") String name,
            @JsonProperty("description") String description,
            @JsonProperty("price") double price,
            @JsonProperty("category") List<String> category,
            @JsonProperty("stock") int stock
    ) {
        if (sku == null || sku.isEmpty())
            throw new IllegalArgumentException("SKU required");
        this.sku = sku;

        if (name == null || name.isEmpty())
            throw new IllegalArgumentException("Name required");
        this.name = name;

        if (description == null || description.isEmpty())
            throw new IllegalArgumentException("Description required");
        this.description = description;

        if (price < 0)
            throw new IllegalArgumentException("Price ≥ 0");
        this.price = price;

        if (category == null)
            throw new IllegalArgumentException("Category required");
        this.category = category;

        if (stock < 0)
            throw new IllegalArgumentException("Stock ≥ 0");
        this.stock = stock;
    }

    public String getSku() {
        return sku;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public double getPrice() {
        return price;
    }

    public List<String> getCategory() {
        return category;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int s) {
        if (s < 0) throw new IllegalArgumentException("Stock ≥ 0");
        this.stock = s;
    }
}
