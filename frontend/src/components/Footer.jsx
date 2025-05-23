import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h5>AWE Electronics</h5>
          <p>Your trusted electronics partner</p>
        </div>

        <div className="footer-developers">
          <span>Development Team</span>
          <div className="developer-names">
            <span>Eshmam Nawar</span>
            <span>•</span>
            <span>Sadikin Seam</span>
            <span>•</span>
            <span>Joby Trigg</span>
            <span>•</span>
            <span>Dev Bohra</span>
          </div>
        </div>

        <div className="footer-copyright">
          <p>© 2025 AWE Electronics | SWE30003</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 