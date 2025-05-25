import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import '../styles/Products.css';

// Mock product data
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
  const [search, setSearch] = useState('');
  const [products, setProducts] = useState(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState(mockProducts);

  useEffect(() => {
    setFilteredProducts(
      products.filter(product =>
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase())
      )
    );
  }, [search, products]);

  return (
    <>
      <main className="container mt-5">
        <h2 className="text-center mb-4">Our Products</h2>
        {/* Search Bar */}
        <div className="row justify-content-center mb-4">
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

        {/* Product Grid */}
        <div className="row">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <div className="col-md-4 mb-4" key={product._id}>
                <ProductCard product={product} />
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