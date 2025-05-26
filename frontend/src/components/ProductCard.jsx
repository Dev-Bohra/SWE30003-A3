import React from 'react';

function ProductCard({ product, onAddToCart }) {
  return (
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
        <button className="btn btn-outline-primary mt-auto" onClick={() => onAddToCart(product)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard; 