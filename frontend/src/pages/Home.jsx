import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../styles/Home.css';

// Mock data structure aligned with backend expectations
const mockProducts = [
  {
    _id: '1',
    name: 'Sample Product 1',
    category: 'Electronics',
    price: 299.99,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '2',
    name: 'Sample Product 2',
    category: 'Accessories',
    price: 149.49,
    image: 'https://via.placeholder.com/300'
  },
  {
    _id: '3',
    name: 'Sample Product 3',
    category: 'Audio',
    price: 99.95,
    image: 'https://via.placeholder.com/300'
  }
];

// Mock categories
const mockCategories = [
  { name: 'Electronics', image: 'https://via.placeholder.com/150' },
  { name: 'Accessories', image: 'https://via.placeholder.com/150' },
  { name: 'Audio', image: 'https://via.placeholder.com/150' },
  { name: 'Wearables', image: 'https://via.placeholder.com/150' },
];

function Home() {
  return (
    <>
      <div className="jumbotron jumbotron-fluid bg-light text-dark text-center py-5 mb-5">
        <div className="container">
          <h1 className="display-4">Revolutionizing Electronics</h1>
          <p className="lead">Find the latest gadgets and accessories that power your life.</p>
          <button className="btn btn-primary btn-lg mt-3">Shop Now</button>
        </div>
      </div>

      <main className="container mt-5">
        <h2 className="text-center mb-4">Featured Products</h2>
        <p className="text-center mb-5 text-muted">
          Discover our top-selling gadgets and must-have accessories.
        </p>

        <div className="row">
          {mockProducts.map((product) => (
            <div className="col-md-4 mb-4" key={product._id}>
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
                  <button className="btn btn-outline-primary mt-auto">Add to Cart</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-center mt-5 mb-4">Explore Categories</h2>
        <div className="row justify-content-center">
          {mockCategories.map((category) => (
            <div className="col-md-3 col-sm-6 mb-4" key={category.name}>
              <div className="card h-100 text-center">
                <img src={category.image} className="card-img-top mx-auto mt-3" alt={category.name} style={{ width: '100px', height: '100px' }} />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{category.name}</h5>
                  <button className="btn btn-outline-secondary mt-auto">View All</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default Home;