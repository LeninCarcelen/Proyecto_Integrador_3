import React from 'react';
import './Footer.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-bar">Aplicación Campus</div>

      <div className="footer-content">
        <div className="footer-left">
          <div className="university-name">Pontificia Universidad Catolica del Ecuador</div>
          <div className="faculty">Tecnologia</div>
        </div>

        <div className="footer-right">
          <div>Dirección: Av. 12 de Octubre, Ciudad: Quito</div>
          <div>Tel: +56 9 1234 5678</div>
          <div>Email: contacto@puce.edu.ec</div>
        </div>
      </div>

      <div className="footer-copy">© {year} Pontificia Universidad Catolica del Ecuador. Todos los derechos reservados.</div>
    </footer>
  );
}

export default Footer;
