import React from 'react';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
  };

  return (
    <div className="card h-100">
      <img
        src={product.image}
        alt={product.name}
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title">{product.name}</h5>
        <p className="card-text">{product.description}</p>
        <p className="card-text">
          <strong>Price: ${product.price.toFixed(2)}</strong>
        </p>
        <button 
          className="btn btn-outline-primary w-100" 
          onClick={handleAddToCart}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard; 