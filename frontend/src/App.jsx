import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import './App.css'

function App() {
  return (
    <Router>
      <div className="app-wrapper">
        <Navbar />
        <main className="flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/cart" element={<div>Cart Page</div>} />
            <Route path="/orders" element={<div>Orders Page</div>} />
            <Route path="/support" element={<div>Support Page</div>} />
            <Route path="/login" element={<div>Login Page</div>} />
            <Route path="/register" element={<div>Register Page</div>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App
