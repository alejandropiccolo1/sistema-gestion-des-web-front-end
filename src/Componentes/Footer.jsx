import React from 'react';
import { Heart, Mail, Phone, MapPin, Shield, FileText, Users, Stethoscope } from 'lucide-react';
import '../styles/Footer.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        
        {/* Sección principal */}
        <div className="footer__main">
          
          {/* Información de la empresa */}
          <div className="footer__section">
            <div className="footer__brand">
              <div className="footer__logo">
                <Stethoscope size={24} />
              </div>
              <h3 className="footer__brand-title">Sistema de Reservas Médicas</h3>
            </div>
            <p className="footer__description">
              Plataforma integral para la gestión de turnos médicos, conectando pacientes 
              y profesionales de la salud de manera eficiente y segura.
            </p>
            
          </div>

          

         

          {/* Contacto */}
          <div className="footer__section">
            <h4 className="footer__section-title">Contacto</h4>
            <div className="footer__contact">
              <div className="footer__contact-item">
                <Phone size={16} />
                <span>+54 11 1234-5678</span>
              </div>
              <div className="footer__contact-item">
                <Mail size={16} />
                <span>info@sistemareservas.com</span>
              </div>
              <div className="footer__contact-item">
                <MapPin size={16} />
                <span>Buenos Aires, Argentina</span>
              </div>
            </div>
          </div> 

          <div className="footer__section">
            <h4 className="footer__section-title">Sobre Nosotros</h4>
            <div className="footer__contact">
              
              <div className="footer__contact-item">
                <Mail size={16} />
                <span>Nos apasiona hacer más fácil el acceso a la salud. Esta app fue creada para que pedir un turno médico sea simple y sin complicaciones.</span>
              </div>
              
            </div>
          </div>

        </div>

        {/* Línea divisoria */}
        <div className="footer__divider"></div>

        {/* Pie del footer */}
        <div className="footer__bottom">
          <div className="footer__copyright">
            <p>&copy; {currentYear} Sistema de Turnos Médicos. Todos los derechos reservados.</p>
          </div>
          <div className="footer__made-with">
            <span>Hecho con</span>
            <Heart size={14} className="footer__heart" />
            <span>para mejorar la salud</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

export default Footer;