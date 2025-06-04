import React, { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import "../styles/Products.css";
import { fetchAllProducts } from "../api/inventoryAPI";

function Products() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchAllProducts()
            .then((data) => {
                // data = [ { sku, name, description, price, category: [...], stock, imageUrl, … }, … ]
                const mapped = data
                    .filter((p) => p.available !== false)
                    .map((p) => ({
                    sku:         p.sku,
                    name:        p.name,
                    category:    Array.isArray(p.category) ? p.category.join(", ") : "",
                    price:       p.price,
                    image:       p.imageUrl || "https://via.placeholder.com/300",
                    stock:       p.stock,
                    description: p.description,
                }));
                setProducts(mapped);
                setFilteredProducts(mapped);
            })
            .catch((err) => {
                console.error("Error fetching inventory:", err);
            });
    }, []);

    useEffect(() => {
        const filtered = products.filter((p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredProducts(filtered);
    }, [searchTerm, products]);

    return (
        <main className="container mt-4">
            <h2 className="mb-3">All Products</h2>
            <input
                type="text"
                className="form-control mb-4"
                placeholder="Search by name…"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredProducts.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {filteredProducts.map((product) => (
                        <div className="col" key={product.sku}>
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Products;