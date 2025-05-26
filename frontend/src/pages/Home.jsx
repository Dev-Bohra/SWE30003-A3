import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Home.css';

// Mock data structure aligned with backend expectations
const mockProducts = [
  {
    _id: '1',
    name: 'Sample Product 1',
    category: 'Electronics',
    price: 299.99,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '2',
    name: 'Sample Product 2',
    category: 'Accessories',
    price: 149.49,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '3',
    name: 'Sample Product 3',
    category: 'Audio',
    price: 99.95,
    image: 'https://via.placeholder.com/300'
  }
];

// Mock categories
const mockCategories = [
  { name: 'Electronics', image: 'https://via.placeholder.com/150' },
  { name: 'Accessories', image: 'https://via.placeholder.com/150' },
  { name: 'Audio', image: 'https://via.placeholder.com/150' },
  { name: 'Wearables', image: 'https://via.placeholder.com/150' },
];

function Home() {
  const { addToCart } = useCart();

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
    <div className="home-container">
      <div className="jumbotron jumbotron-fluid bg-light text-dark text-center py-5 mb-5">
        <div className="container">
          <h1 className="display-4">Revolutionizing Electronics</h1>
          <p className="lead">Find the latest gadgets and accessories that power your life.</p>
          <Link to="/products" className="btn btn-primary btn-lg mt-3">
            Shop Now
          </Link>
        </div>
      </div>

      <main className="container mt-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <p className="text-center mb-5 text-muted">
          Discover our top-selling gadgets and must-have accessories.
        </p>

        <div className="row">
          {mockProducts.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
              <div className="card h-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="card-img-top"
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text text-muted">{product.category}</p>
                  <p className="card-text fw-bold">${product.price.toFixed(2)}</p>
                  <button 
                    className="btn btn-primary mt-auto" 
                    onClick={() => handleAddToCart(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* New Promotional Banner Section */}
        <div className="row mt-5 mb-5">
          <div className="col-12">
            <div className="bg-primary text-white text-center py-4 rounded">
              <h3>Don't Miss Our Special Offers!</h3>
              <p>Sign up for our newsletter and get 10% off your first order.</p>
              <Link to="/products" className="btn btn-light mt-2">
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;