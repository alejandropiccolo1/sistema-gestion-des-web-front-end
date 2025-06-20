// Header.jsx
import { LogOut, Menu, X, User, Stethoscope, Calendar } from 'lucide-react';
import { useAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../styles/Header.css';

const Header = ({ title = 'Sistema de Reservas Médica', mostrarMenu = true }) => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  // Ya no cargamos opciones del menú para ninguno
  const opciones = []; // vacio para que no muestre nada

  const getRolIcon = (rol) => {
    return rol === 'profesional' ? Stethoscope : User;
  };

  const RolIcon = getRolIcon(usuario?.rol);

  return (
    <>
      <header className={`header ${isScrolled ? 'header--scrolled' : ''}`}>
        <div className="header__container">
          <div className="header__content">

            {/* Logo y título */}
            <div className="header__brand" >
              <div className="header__logo">
                <Stethoscope size={24} />
              </div>
              <h1 className="header__title">{title}</h1>
            </div>

            {/* Mostrar menú solo si mostrarMenu es true */}
            {mostrarMenu && (
              <>
                {/* Información del usuario (Desktop) */}
                <div className="header__desktop">
                  <div className="header__user-info">
                    <div className="header__user-avatar">
                      <RolIcon size={16} />
                    </div>
                    <div className="header__user-details">
                      <div className="header__user-name">{usuario?.nombre}</div>
                      <div className="header__user-role">
                        {usuario?.rol === 'profesional' ? 'Profesional' : 'Paciente'}
                      </div>
                    </div>
                  </div>

                  {/* Navegación Desktop (vacía) */}
                  <nav className="header__nav">
                    {/* Ya no mostramos opciones */}

                    <button onClick={handleLogout} className="header__nav-item header__nav-item--logout">
                      <LogOut size={18} />
                      <span>Salir</span>
                    </button>
                  </nav>
                </div>

                {/* Botón menú móvil */}
                <button onClick={toggleMenu} className="header__mobile-toggle">
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Menú móvil */}
                <div className={`header__mobile-menu ${isMenuOpen ? 'header__mobile-menu--open' : ''}`}>
                  <div className="header__mobile-content">

                    {/* Info usuario móvil */}
                    <div className="header__mobile-user">
                      <div className="header__mobile-avatar">
                        <RolIcon size={20} />
                      </div>
                      <div className="header__mobile-user-details">
                        <div className="header__mobile-user-name">{usuario?.nombre}</div>
                        <div className="header__mobile-user-role">
                          {usuario?.rol === 'profesional' ? 'Profesional' : 'Paciente'}
                        </div>
                      </div>
                    </div>

                    {/* Navegación móvil vacía */}

                    <button onClick={handleLogout} className="header__mobile-nav-item header__mobile-nav-item--logout">
                      <LogOut size={20} />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Espaciador */}
      <div className="header__spacer"></div>
    </>
  );
};


export default Header;
