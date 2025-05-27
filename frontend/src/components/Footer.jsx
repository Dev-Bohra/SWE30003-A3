import { Link } from 'react-router-dom';
import '../styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        {/* company info */}
        <div className="footer-brand">
          <h5>AWE Electronics</h5>
          <p>Your trusted electronics partner</p>
          <p className="footer-copyright-text">© 2025 AWE Electronics | SWE30003</p>
        </div>

        {/* team info */}
        <div className="footer-developers">
          <span>Development Team</span>
          <div className="developer-names">
            <div className="developer-row">
              <span>Eshmam Nawar</span>
              <span>Sadikin Seam</span>
            </div>
            <div className="developer-row">
              <span>Joby Trigg</span>
              <span>Dev Bohra</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer; 