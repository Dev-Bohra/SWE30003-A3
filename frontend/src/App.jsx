import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Signup from './pages/Signup'
import Support from './pages/Support'
import AdminDashboard from './admin/pages/AdminDashboard'
import ViewOrders from './admin/pages/ViewOrders'
import ManageProducts from './admin/pages/ManageProducts'
import Analytics from './admin/pages/Analytics'
import ManageUsers from './admin/pages/ManageUsers'
import './App.css'

// ProtectedRoute component to protect routes
function ProtectedRoute({ element, adminOnly }) {
 const { currentUser } = useAuth();
 if (!currentUser) return <Navigate to="/signup" />;
 if (adminOnly && currentUser.role !== 'Admin') return <Navigate to="/" />;
 return element;
}

function App() {
 return (
   <Router>
     <AuthProvider>
       <CartProvider>
         <div className="app-wrapper">
           <Navbar />
           <main className="flex-grow-1">
             <Routes>
               <Route path="/" element={<Home />} />
               <Route path="/products" element={<Products />} />
               <Route path="/cart" element={<ProtectedRoute element={<Cart />} />} />
               <Route path="/orders" element={<ProtectedRoute element={<Orders />} />} />
               <Route path="/support" element={<ProtectedRoute element={<Support />} />} />
               <Route path="/admin" element={<ProtectedRoute element={<AdminDashboard />} adminOnly={true} />} />
               <Route path="/admin/orders" element={<ProtectedRoute element={<ViewOrders />} adminOnly={true} />} />
               <Route path="/admin/products" element={<ProtectedRoute element={<ManageProducts />} adminOnly={true} />} />
               <Route path="/admin/analytics" element={<ProtectedRoute element={<Analytics />} adminOnly={true} />} />
               <Route path="/admin/users" element={<ProtectedRoute element={<ManageUsers />} adminOnly={true} />} />
               <Route path="/signup" element={<Signup />} />
             </Routes>
           </main>
           <Footer />
         </div>
       </CartProvider>
     </AuthProvider>
   </Router>
 )
}

export default App