import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Activity } from 'lucide-react';
import Header from '../../Componentes/Header';
import Footer from '../../Componentes/Footer';
import '../../styles/Paciente.css';

function Paciente() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const { name, apellido } = usuario || {};
  const nombreCompleto = name ? `${name} ${apellido}` : 'invitado';

  // Solo queda la acción de "Solicitar Turno"
  const acciones = [
    { titulo: 'Solicitar Turno', icon: Stethoscope, ruta: '/paciente/solicitar-turno' }
  ];

  return (
    <div className="paciente">
      <Header />

      <main className="paciente-main">
        <section className="bienvenida">
          <h1>Hola, {nombreCompleto} 👋</h1>
          <p>Bienvenido a tu espacio de salud</p>
          <Heart className="icono-grande" />
        </section>

        <section className="acciones">
          <h2>Acciones rápidas</h2>
          <div className="acciones-grid">
            {acciones.map(({ icon: Icon, titulo, ruta }, i) => (
              <div key={i} className="accion" onClick={() => navigate(ruta)}>
                <Icon size={32} />
                <span>{titulo}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="consejo">
          <Activity size={28} />
          <div>
            <h3>Consejo del día</h3>
            <p>Caminar 30 minutos al día puede mejorar tu salud 💪</p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Paciente;
