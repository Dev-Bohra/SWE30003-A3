import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import '../styles/Navbar.css';


function Navbar() {
 const { currentUser, logout } = useAuth();
 const { cartItems } = useCart();
 const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
 const navigate = useNavigate();


 return (
   <nav className="navbar navbar-expand-lg sticky-top">
     <div className="container">
       <Link className="navbar-brand" to="/">
         AWE Electronics
       </Link>
       <button
         className="navbar-toggler"
         type="button"
         data-bs-toggle="collapse"
         data-bs-target="#navbarNav"
         aria-controls="navbarNav"
         aria-expanded="false"
         aria-label="Toggle navigation"
       >
         <span className="navbar-toggler-icon"></span>
       </button>
       <div className="collapse navbar-collapse" id="navbarNav">
         <ul className="navbar-nav ms-auto mb-2 mb-lg-0 gap-2">
           <li className="nav-item">
             <Link className="nav-link" to="/">Home</Link>
           </li>
           <li className="nav-item">
             <Link className="nav-link" to="/products">Products</Link>
           </li>
           {currentUser && (
             <>
               <li className="nav-item">
                 <Link className="nav-link" to="/cart">
                   Cart
                   {cartItemCount > 0 && (
                     <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                       {cartItemCount}
                     </span>
                   )}
                 </Link>
               </li>
               <li className="nav-item">
                 <Link className="nav-link" to="/orders">My Orders</Link>
               </li>
               <li className="nav-item">
                 <Link className="nav-link" to="/support">Support</Link>
               </li>
             </>
           )}
           {currentUser ? (
             <li className="nav-item user-menu">
               {currentUser.role === 'Admin' ? (
                 <>
                   <div className="user-info-display">
                     <button className="admin-badge" onClick={() => navigate('/admin')}>Admin Dashboard</button>
                   </div>
                   <button className="btn btn-logout" onClick={logout}>Logout</button>
                 </>
               ) : (
                 <div className="user-info-display">
                   <span className="user-icon">👤</span>
                   <span className="username-text">{currentUser.username}</span>
                   <button className="btn btn-logout" onClick={logout}>Logout</button>
                 </div>
               )}
             </li>
           ) : (
             <li className="nav-item">
               <Link className="btn btn-signup" to="/signup">Sign in</Link>
             </li>
           )}
         </ul>
       </div>
     </div>
   </nav>
 );
}


export default Navbar;