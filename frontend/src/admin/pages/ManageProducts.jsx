import React, { useState } from 'react';
import '../styles/ManageProducts.css';
import '../styles/AdminDashboard.css';

function ManageProducts() {
  const [products, setProducts] = useState([
    {
      id: "P001",
      name: "iPhone 13",
      price: "999.99",
      stock: 25,
      disabled: false
    },
    {
      id: "P002",
      name: "Samsung Galaxy S21",
      price: "899.99",
      stock: 15,
      disabled: false
    },
    {
      id: "P003",
      name: "MacBook Pro",
      price: "1299.99",
      stock: 3,
      disabled: false
    },
    {
      id: "P004",
      name: "AirPods Pro",
      price: "249.99",
      stock: 8,
      disabled: false
    },
    {
      id: "P005",
      name: "iPad Air",
      price: "599.99",
      stock: 0,
      disabled: false
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    stock: ''
  });

  // Handle restock
  const handleRestock = (productId) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, stock: product.stock + 10 };
      }
      return product;
    }));
  };

  // Handle disable/enable
  const handleToggleDisable = (productId) => {
    setProducts(products.map(product => {
      if (product.id === productId) {
        return { ...product, disabled: !product.disabled };
      }
      return product;
    }));
  };

  // Handle new product form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const newId = `P${String(products.length + 1).padStart(3, '0')}`;
    const product = {
      id: newId,
      name: newProduct.name,
      price: newProduct.price,
      stock: parseInt(newProduct.stock),
      disabled: false
    };
    setProducts([...products, product]);
    setShowModal(false);
    setNewProduct({ name: '', price: '', stock: '' });
  };

  // Get stock status class
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
              <th>Product ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={product.disabled ? 'disabled' : ''}>
                <td>{product.id}</td>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{product.stock}</td>
                <td>
                  <span className={`stock-badge ${getStockStatusClass(product.stock)}`}>
                    {product.stock > 20 ? 'Sufficient' : product.stock >= 5 ? 'Low' : 'Critical'}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button 
                      className="restock-btn"
                      onClick={() => handleRestock(product.id)}
                      disabled={product.disabled}
                    >
                      Restock
                    </button>
                    <button 
                      className={`toggle-btn ${product.disabled ? 'enable' : 'disable'}`}
                      onClick={() => handleToggleDisable(product.id)}
                    >
                      {product.disabled ? 'Enable' : 'Disable'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Product Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Add New Product</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newProduct.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="price">Price ($)</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={newProduct.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="stock">Initial Stock</label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={newProduct.stock}
                  onChange={handleInputChange}
                  min="0"
                  required
                />
              </div>
              <div className="modal-buttons">
                <button type="submit" className="submit-btn">Add Product</button>
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProducts; 