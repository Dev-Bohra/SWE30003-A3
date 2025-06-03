// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/CartContext";
import { fetchPopularProducts } from "../api/inventoryAPI";
import ProductCard from "../components/ProductCard";
import "../styles/Home.css";

function Home() {
  const { addToCart } = useCart();
  const [featured, setFeatured] = useState([]);

  useEffect(() => {
    fetchPopularProducts()
        .then((data) => {
          // data = [ { _id, sku, name, description, price, category: [...], imageUrl, … }, … ]
          const mapped = data.map((p) => ({
            _id: p._id,
            sku: p.sku,
            name: p.name,
            description: p.description,
            price: p.price,
            imageUrl: p.imageUrl,
          }));
          setFeatured(mapped);
        })
        .catch((err) => {
          console.error("Failed to load featured products:", err);
        });
  }, []);

  return (
      <main className="home-container">
        <section className="hero-section text-center py-5 bg-light">
          <div className="container">
            <h1 className="display-4">Welcome to AWE Electronics</h1>
            <p className="lead">
              Discover the latest gadgets, electronics, and accessories. Shop now!
            </p>
          </div>
        </section>

        <section className="featured-section py-5">
          <div className="container">
            <h2 className="mb-4">Featured Products</h2>
            {featured.length === 0 ? (
                <div className="text-center">Loading featured products...</div>
            ) : (
                <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-4">
                  {featured.map((product) => (
                      <div className="col" key={product._id}>
                        <ProductCard product={product} addToCart={addToCart} />
                      </div>
                  ))}
                </div>
            )}
          </div>
        </section>
      </main>
  );
}

export default Home;
