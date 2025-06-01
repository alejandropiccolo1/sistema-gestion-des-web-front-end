import React from 'react';
import { useAuth } from '../../Context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, FileText, Stethoscope, User, Heart, Activity } from 'lucide-react';
import Header from '../../Componentes/Header';
import Footer from '../../Componentes/Footer';
import '../../styles/Paciente.css'; // creá este archivo simple

function Paciente() {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const acciones = [
    { titulo: 'Mis Turnos', icon: Calendar, ruta: '/paciente/turnos' },
    { titulo: 'Historial', icon: FileText, ruta: '/paciente/historial' },
    { titulo: 'Solicitar Turno', icon: Stethoscope, ruta: '/paciente/solicitar-turno' },
    { titulo: 'Perfil', icon: User, ruta: '/paciente/perfil' }
  ];

  return (
    <div className="paciente">
      <Header />

      <main className="paciente-main">
        <section className="bienvenida">
<h1>Hola, {usuario?.name ? `${usuario.name} ${usuario.apellido}` : 'invitado'} 👋</h1>

          <p>Bienvenido a tu espacio de salud</p>
          <Heart className="icono-grande" />
        </section>

        <section className="acciones">
          <h2>Acciones rápidas</h2>
          <div className="acciones-grid">
            {acciones.map((a, i) => (
              <div key={i} className="accion" onClick={() => navigate(a.ruta)}>
                <a.icon size={32} />
                <span>{a.titulo}</span>
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
