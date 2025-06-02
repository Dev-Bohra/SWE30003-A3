import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Home.css';

function Home() {
  // get addToCart function from our cart context
  const { addToCart } = useCart();

  // State for “featured” products—we’ll simply load the first N from inventory
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetch('http://localhost:8080/api/inventory')
        .then((res) => {
          if (!res.ok) throw new Error('Failed to load inventory');
          return res.json();
        })
        .then((data) => {
          // pick, say, the first 3 items (or based on stock)
          // map to the shape Home expects (_id, name, category, price, image)
          const mapped = data.slice(0, 3).map((p) => ({
            _id: p.sku,
            name: p.name,
            category: Array.isArray(p.category) ? p.category.join(', ') : '',
            price: p.price,
            image: p.imageUrl || 'https://via.placeholder.com/300'
          }));
          setFeatured(mapped);
        })
        .catch((err) => console.error('Error fetching featured:', err));
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
      <div className="home-container">
        {/* hero section with main banner */}
        <div className="jumbotron jumbotron-fluid bg-light text-dark text-center py-5 mb-5 banner-gradient">
          <div className="container">
            <h1 className="display-4">Revolutionizing Electronics</h1>
            <p className="lead">
              Find the latest gadgets and accessories that power your life.
            </p>
            <Link to="/products" className="btn mt-3">
              Shop Now
            </Link>
          </div>
        </div>

        <main className="container mt-5">
          {/* featured products section */}
          <h2 className="text-center mb-4">Featured Products</h2>
          <p className="text-center mb-5 text-muted">
            Discover our top-selling gadgets and must-have accessories.
          </p>

          {/* product grid */}
          <div className="row">
            {featured.map((product) => (
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
                      <p className="card-text fw-bold">
                        ${product.price.toFixed(2)}
                      </p>
                      <button
                          className="btn mt-auto"
                          onClick={() => handleAddToCart(product)}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </div>
            ))}
          </div>

          {/* promo banner */}
          <div className="row mt-5 mb-5">
            <div className="col-12">
              <div className="bg-primary text-white text-center py-4 rounded">
                <h3>Don't Miss Our Special Offers!</h3>
                <p>Sign up for our newsletter and get 10% off your first order.</p>
                <Link to="/products" className="btn mt-2">
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
