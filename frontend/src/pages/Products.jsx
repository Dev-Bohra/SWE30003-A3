import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

// test data - will be replaced with API data
const mockProducts = [
  {
    _id: '1',
    name: 'Laptop',
    category: 'Electronics',
    price: 1200.00,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '2',
    name: 'Mouse',
    category: 'Accessories',
    price: 25.00,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '3',
    name: 'Headphones',
    category: 'Audio',
    price: 150.00,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '4',
    name: 'Keyboard',
    category: 'Accessories',
    price: 75.00,
    image: 'https://via.placeholder.com/300'
  },
];

function Products() {
  // state for search and products
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  // filter products when search changes
  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  // add product to cart (will be connected to context later)
  const handleAddToCart = (product) => {
    console.log('Adding product to cart:', product);
    // TODO: connect to cart context
  };

  return (
    <>
      <main className="container mt-5">
        <h2 className="products-heading">Our Products</h2>
        
        {/* search input */}
        <div className="search-bar-container row justify-content-center">
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

        {/* display products in grid */}
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="col-md-4 mb-4" key={product._id}>
                <ProductCard product={product} onAddToCart={handleAddToCart} />
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