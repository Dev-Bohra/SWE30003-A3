import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useState } from 'react';
import '../styles/Products.css';
import ProductCard from '../components/ProductCard';

// Mock product list simulating backend data
const mockProducts = [
  {
    _id: '101',
    name: 'Bluetooth Speaker',
    category: 'Audio',
    price: 79.99,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '102',
    name: 'Wireless Headphones',
    category: 'Accessories',
    price: 129.99,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '103',
    name: 'Smartwatch',
    category: 'Wearables',
    price: 149.99,
    image: 'https://via.placeholder.com/300'
  }
];

function Products() {
  const [search, setSearch] = useState('');

  // Filter products based on search input
  const filteredProducts = mockProducts.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()) ||
    product.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <main className="container mt-5">
        <h2 className="text-center mb-4">Our Product Catalog</h2>

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
              <ProductCard key={product._id} product={product} />
            ))
          ) : (
            <p className="text-center text-muted no-products-message">No products found.</p>
          )}
        </div>
      </main>
    </>
  );
}

export default Products;
