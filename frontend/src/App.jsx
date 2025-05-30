import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
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
import './App.css'


// ProtectedRoute component to protect routes
function ProtectedRoute({ element }) {
 const { currentUser } = useAuth();
 return currentUser ? element : <Navigate to="/signup" />;
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