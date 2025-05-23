import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="row">
          {/* Company Info Section */}
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="footer-heading">AWE Electronics</h5>
            <p className="footer-text">
              Empowering your digital lifestyle with cutting-edge electronics. 
              We bring innovation and quality to your doorstep, making technology accessible to everyone.
            </p>
            <div className="social-links">
              <a href="#" className="social-link" aria-label="Facebook"><i className="bi bi-facebook"></i></a>
              <a href="#" className="social-link" aria-label="Twitter"><i className="bi bi-twitter"></i></a>
              <a href="#" className="social-link" aria-label="Instagram"><i className="bi bi-instagram"></i></a>
              <a href="#" className="social-link" aria-label="LinkedIn"><i className="bi bi-linkedin"></i></a>
            </div>
          </div>

          {/* Developers Section */}
          <div className="col-lg-4 col-md-6 mb-4 mb-md-0">
            <h5 className="footer-heading">Our Team</h5>
            <div className="developers-grid">
              <div className="developer-item">
                <i className="bi bi-code-square"></i>
                <span>Eshmam Nawar</span>
                
              </div>
              <div className="developer-item">
                <i className="bi bi-code-square"></i>
                <span>Sadikin Seam</span>
                
              </div>
              <div className="developer-item">
                <i className="bi bi-code-square"></i>
                <span>Joby Trigg</span>
                
              </div>
              <div className="developer-item">
                <i className="bi bi-code-square"></i>
                <span>Dev Bohra</span>
                
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="col-lg-4 col-md-6">
            <h5 className="footer-heading">Get in Touch</h5>
            <ul className="footer-contact">
              <li>
                <i className="bi bi-geo-alt"></i>
                <div>
                  <strong>Our Location</strong>
                  <span>Melbourne, VIC, Australia</span>
                </div>
              </li>
              <li>
                <i className="bi bi-telephone"></i>
                <div>
                  <strong>Call Us</strong>
                  <span>+61 234 567 890</span>
                </div>
              </li>
              <li>
                <i className="bi bi-envelope"></i>
                <div>
                  <strong>Email Us</strong>
                  <span>info@aweelectronics.com</span>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="row align-items-center">
            <div className="col-md-6">
              <p className="copyright">
                © 2025 AWE Electronics. All rights reserved.
                <span className="d-block mt-1">SWE30003 - Software Engineering Project</span>
              </p>
            </div>
            <div className="col-md-6">
              <ul className="footer-bottom-links">
                <li><Link to="/privacy">Privacy Policy</Link></li>
                <li><Link to="/terms">Terms of Service</Link></li>
                <li><Link to="/sitemap">Sitemap</Link></li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 