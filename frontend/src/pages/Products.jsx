import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

function Products() {
  // State: products fetched from backend, plus filtered subset
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState([]);        // initially empty
  const [filteredProducts, setFilteredProducts] = useState([]);

  // 1) Fetch product list once on mount
  useEffect(() => {
    fetch('http://localhost:8080/api/inventory')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load inventory');
          return res.json();
        })
        .then((data) => {
          // data is an array of { sku, name, description, price, category: [...], stock }
          // We’ll map it into objects matching ProductCard’s expected props:
          const mapped = data.map((p) => ({
            _id: p.sku,
            name: p.name,
            category: Array.isArray(p.category) ? p.category.join(', ') : '',
            price: p.price,
            image: p.imageUrl || 'https://via.placeholder.com/300',
            // note: if your Product class has no image field, we can show placeholder
            stock: p.stock,
            description: p.description
          }));
          setProducts(mapped);
          setFilteredProducts(mapped);
        })
        .catch((err) => {
          console.error('Error fetching inventory:', err);
        });
  }, []);

  // 2) Filter whenever 'search' or `products` change
  useEffect(() => {
    setFilteredProducts(
        products.filter((product) =>
            product.name.toLowerCase().includes(search.toLowerCase()) ||
            product.category.toLowerCase().includes(search.toLowerCase())
        )
    );
  }, [search, products]);

  const handleAddToCart = (product) => {
    console.log('Adding product to cart:', product);
    // TODO: connect to cart context
  };

  return (
      <>
        <main className="container mt-5">
          <h2 className="products-heading">Our Products</h2>

          {/* Search input */}
          <div className="search-bar-container row justify-content-center mb-4">
            <div className="col-md-6">
              <input
                  type="text"
                  className="form-control"
                  placeholder="Search by product name or category..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Product grid */}
          <div className="row">
            {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                    <div className="col-md-4 mb-4" key={product._id}>
                      <ProductCard
                          product={product}
                          onAddToCart={() => handleAddToCart(product)}
                      />
                    </div>
                ))
            ) : (
                <p className="text-center text-muted">No products found.</p>
            )}
          </div>
        </main>
      </>
  );
}

export default Products;
