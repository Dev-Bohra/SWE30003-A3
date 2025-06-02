import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Home.css';
import { fetchPopularProducts } from '../api/inventoryApi';

function Home() {
  const { addToCart } = useCart();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchPopularProducts() // fetch top 3 most‐sold, in‐stock items
        .then((data) => {
          // data = array of Product objects: { sku, name, description, price, category: [...], stock, ... }
          // Map each to the shape Home expects:
          const mapped = data.map((p) => ({
            _id: p.sku,
            name: p.name,
            category: Array.isArray(p.category) ? p.category.join(', ') : '',
            price: p.price,
            image: p.imageUrl || 'https://via.placeholder.com/300'
          }));
          setFeatured(mapped);
        })
        .catch((err) => {
          console.error('Error fetching popular products:', err);
        });
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  return (
      <div className="home-container">
        {/* Hero/banner */}
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
          {/* Featured (most popular) products */}
          <h2 className="text-center mb-4">Most Popular In‐Stock</h2>
          <p className="text-center mb-5 text-muted">
            These items sell out fast—grab yours while in stock!
          </p>

          <div className="row">
            {featured.length > 0 ? (
                featured.map((product) => (
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
                ))
            ) : (
                <p className="text-center text-muted">
                  No popular products available right now.
                </p>
            )}
          </div>

          {/* Promo banner (unchanged) */}
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
