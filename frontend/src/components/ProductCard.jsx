import React from "react";
import { useCart } from "../context/CartContext";
import "../styles/ProductCard.css";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    // product.sku must exist after our mapping in Products.jsx or Home.jsx
    addToCart({ sku: product.sku, name: product.name, price: product.price, image: product.image });
  };
    const renderButton = () => {
        if (product.stock <= 0) {
            return (
                <button
                    className="btn btn-outline-secondary mt-auto"
                    disabled
                    style={{ cursor: "not-allowed" }}
                >
                    Out of Stock
                </button>
            );
        } else {
            return (
                <button
                    className="btn btn-outline-primary mt-auto"
                    onClick={handleAddToCart}
                >
                    Add to Cart
                </button>
            );
        }
    };
  return (
      <div className="card h-100">
        <img
            src={product.image}
            alt={product.name}
            className="card-img-top"
        />
        <div className="card-body d-flex flex-column">
          <h5 className="card-title">{product.name}</h5>
          <p className="card-text">{product.description || ""}</p>
            <p className="card-text">stock: {product.stock || "0"}</p>
          <p className="card-text">
            <strong>Price: ${product.price.toFixed(2)}</strong>
          </p>

            {renderButton()}
        </div>
      </div>
  );
}

export default ProductCard;
