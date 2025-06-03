import React, { useState, useEffect } from 'react';
import {
  fetchAllProducts,
  restockProductApi,
  toggleProductStatusApi,
  addProductApi
} from '../api/adminInventoryApi';
import '../styles/ManageProducts.css';
import '../styles/AdminDashboard.css';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });
  const [editedStock, setEditedStock] = useState({});

  useEffect(() => {
    fetchAllProducts().then(setProducts).catch(console.error);
  }, []);

  const handleStockChange = (sku, value) => {
    setEditedStock((prev) => ({
      ...prev,
      [sku]: value
    }));
  };

  const handleSaveStock = (sku) => {
    const newStock = parseInt(editedStock[sku]);
    if (isNaN(newStock) || newStock < 0) return;
    restockProductApi(sku, newStock).then((updatedProduct) => {
      setProducts((prev) =>
          prev.map((p) => (p.sku === sku ? updatedProduct : p))
      );
    });
  };

  const handleToggleDisable = (sku) => {
    toggleProductStatusApi(sku).then((updatedProduct) => {
      setProducts((prev) =>
          prev.map((p) => (p.sku === sku ? updatedProduct : p))
      );
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const product = {
      sku: `SKU${Date.now()}`,
      name: newProduct.name,
      price: parseFloat(newProduct.price),
      stock: parseInt(newProduct.stock),
      available: false
    };
    addProductApi(product).then(() => window.location.reload());
  };

  const getStockStatusClass = (stock) => {
    if (stock > 20) return 'sufficient';
    if (stock >= 5) return 'low';
    return 'critical';
  };

  return (
      <div className="products-container">
        <div className="products-header">
          <h1>Product Management</h1>
          <p>Manage your store's products</p>
          <button className="add-product-btn" onClick={() => setShowModal(true)}>
            Add New Product
          </button>
        </div>

        <div className="products-table-container">
          <table className="products-table">
            <thead>
            <tr>
              <th>Product ID</th><th>Name</th><th>Price</th><th>Stock</th><th>Status</th><th>Actions</th>
            </tr>
            </thead>
            <tbody>
            {products.map((product) => (
                <tr key={product.sku} className={product.available ? 'true' : ''}>
                  <td>{product.sku}</td>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>
                    <input
                        type="number"
                        value={editedStock[product.sku] ?? product.stock}
                        onChange={(e) => handleStockChange(product.sku, e.target.value)}
                        min="0"
                        disabled={!product.available}
                    />
                  </td>
                  <td>
                  <span className={`stock-badge ${getStockStatusClass(product.stock)}`}>
                    {product.stock > 20 ? 'Sufficient' : product.stock >= 5 ? 'Low' : 'Critical'}
                  </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="restock-btn" onClick={() => handleSaveStock(product.sku)} disabled={!product.available}>
                        Save
                      </button>
                      <button className={`toggle-btn ${product.available ? 'disable':'enable' }`} onClick={ () => handleToggleDisable(product.sku)}>
                        {product.available ? 'Disable': 'Enable' }
                      </button>
                    </div>
                  </td>
                </tr>
            ))}
            </tbody>
          </table>
        </div>

        {showModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2>Add New Product</h2>
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label htmlFor="name">Product Name</label>
                    <input type="text" name="name" value={newProduct.name} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price ($)</label>
                    <input type="number" name="price" value={newProduct.price} onChange={handleInputChange} step="0.01" min="0" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="stock">Initial Stock</label>
                    <input type="number" name="stock" value={newProduct.stock} onChange={handleInputChange} min="0" required />
                  </div>
                  <div className="modal-buttons">
                    <button type="submit" className="submit-btn">Add Product</button>
                    <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
        )}
      </div>
  );
}

export default ManageProducts;
