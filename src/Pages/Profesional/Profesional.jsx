import React, { useState, useEffect } from 'react';
import { Calendar, Clock, Users } from 'lucide-react';
import Header from '../../Componentes/Header';
import Footer from '../../Componentes/Footer';
import '../../styles/Profesional.css';
import { useNavigate, useLocation } from 'react-router-dom';
import { useStats } from '../../Context/StatsContext'; // Asegurate de usar la ruta correcta

function getUserFromToken() {
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    console.log(payload);
    return {
      nombre: payload.name || payload.unique_name || 'Usuario',
      apellido: payload.apellido || '',
      rol: payload.role || 'profesional',
      especialidad: payload.Especialidad || payload.especialidad || "Sin especialidad",
    };
  } catch (e) {
    console.error('Error decodificando token:', e);
    return null;
  }
}

function getEspecialidad(rol) {
  if (rol === 'profesional') return 'Profesional Activo';
  if (rol === 'admin') return 'Administrador';
  return rol;
}

function Profesional() {
  const [usuario, setUsuario] = useState({ nombre: '', apellido: '', rol: '', especialidad: '' });
  const [turnosDisponiblesHoy, setTurnosDisponiblesHoy] = useState(0); // 👈 Nuevo estado
  const { pacientesActivos, disponibilidad } = useStats();

  const navigate = useNavigate();
  const location = useLocation();

  const fetchTurnosDisponiblesHoy = async () => {
    const fechaHoy = new Date().toISOString().split("T")[0];

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:5083/api/Disponibilidad?fecha=${fechaHoy}&estado=Disponible`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error("Error al obtener turnos");

      const data = await response.json();
      console.log("Turnos disponibles hoy:", data);

      setTurnosDisponiblesHoy(data.length); // 👈 Guardamos la cantidad de turnos
    } catch (error) {
      console.error("No se pudieron cargar los turnos disponibles hoy:", error);
    }
  };

  useEffect(() => {
    const userFromToken = getUserFromToken();
    if (userFromToken) setUsuario(userFromToken);
    fetchTurnosDisponiblesHoy();
  }, [location]);

  const menuItems = [
    {
      icon: Calendar,
      title: "Crear Disponibilidad",
      description: "Gestioná tus horarios disponibles.",
      color: "purple",
      action: () => navigate("/profesional/disponibilidad")
    },
    {
      icon: Clock,
      title: "Turnos Asignados",
      description: "Revisá tus citas programadas.",
      color: "blue",
      action: () => navigate('/profesional/turnos')
    },
    {
      icon: Users,
      title: "Pacientes",
      description: "Administrá tu lista de pacientes.",
      color: "green",
      action: () => navigate('/profesional/pacientes')
    }
  ];

  return (
    <>
      <div className="profesional-container">
        <Header />
        <div className="section-header">
          <h1>
            Bienvenid@, <span>{`${usuario.nombre} ${usuario.apellido}`.trim()}</span>
          </h1>
          <p>{usuario.especialidad || getEspecialidad(usuario.rol)}</p>
        </div>

        <div className="quick-stats">
          <div className="card stat">
            <Clock className="icon" />
            <div>
              <h3>Turnos Disponibles </h3>
              <p>{turnosDisponiblesHoy}</p>
            </div>
          </div>
          <div className="card stat">
            <Users className="icon" />
            <div>
              <h3>Pacientes Activos</h3>
              <p>{pacientesActivos}</p>
            </div>
          </div>
          <div className="card stat">
            <Calendar className="icon" />
            <div>
              <h3>Disponibilidad</h3>
              <p>{disponibilidad}%</p>
            </div>
          </div>
        </div>

        <div className="acciones">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={index} className={`card accion ${item.color}`} onClick={item.action}>
                <div className="icon-wrapper">
                  <Icon className="icon" />
                </div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                <span>Acceder →</span>
              </div>
            );
          })}
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profesional;
