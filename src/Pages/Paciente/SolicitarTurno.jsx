import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CrearDisponibilidad.css';
import Header from '../../Componentes/Header';
import Footer from '../../Componentes/Footer';

const SolicitarTurno = () => {
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate(-1);
  };

  // Fetch inicial de turnos disponibles
  const fetchTurnos = () => {
    fetch('http://localhost:5083/api/disponibilidad/disponibles', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then(res => res.json())
      .then(data => setTurnosDisponibles(data))
      .catch(err => console.error('Error fetching turnos:', err));
  };

  useEffect(() => {
    fetchTurnos();
  }, []);

  // Reservar turno
  const reservarTurno = async (turnoId) => {
    try {
      const response = await fetch(
        `http://localhost:5083/api/disponibilidad/reservar/${turnoId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) throw new Error(await response.text());
      // Al reservar, refrescar lista o actualizar estado localmente
      setTurnosDisponibles(prev =>
        prev.map(t =>
          t.id === turnoId ? { ...t, estado: 'Reservado' } : t
        )
      );
    } catch (error) {
      console.error('Error reservando turno:', error);
      alert(error.message);
    }
  };

  // Cancelar turno
  const cancelarTurno = async (turnoId) => {
    try {
      const response = await fetch(
        `http://localhost:5083/api/disponibilidad/cancelar/${turnoId}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) throw new Error(await response.text());
      setTurnosDisponibles(prev =>
        prev.map(t =>
          t.id === turnoId ? { ...t, estado: 'Disponible', pacienteId: null } : t
        )
      );
    } catch (error) {
      console.error('Error cancelando turno:', error);
      alert(error.message);
    }
  };

  return (
    <>
      <Header />
      <div className="table-container">
        <button type="button" className="btn-volver" onClick={handleVolver}>
          Volver
        </button>
        <h3 className="table-title">Turnos</h3>

        {turnosDisponibles.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b46c1' }}>
            No hay turnos disponibles.
          </p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nombre Profesional</th>
                <th>Apellido Profesional</th>
                <th>Especialidad</th>
                <th>Fecha Inicio</th>
                <th>Hora Inicio</th>
                <th>Hora Fin</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnosDisponibles.map(turno => {
                const inicio = new Date(turno.fechaHoraInicio);
                const fin = new Date(turno.fechaHoraFin);
                const fechaInicio = inicio.toLocaleDateString();
                const horaInicio = inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const horaFin = fin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

                return (
                  <tr key={turno.id}>
                    <td>{turno.nombreProfesional}</td>
                    <td>{turno.apellidoProfesional}</td>
                    <td>{turno.especialidad}</td>
                    <td>{fechaInicio}</td>
                    <td>{horaInicio}</td>
                    <td>{horaFin}</td>
                    <td>{turno.estado}</td>
                    <td>
                      {turno.estado === 'Disponible' ? (
                        <button
                          className="btn-solicitar"
                          onClick={() => reservarTurno(turno.id)}
                        >
                          Solicitar
                        </button>
                      ) : (
                        <button
                          className="btn-liberar"
                          onClick={() => cancelarTurno(turno.id)}
                        >
                          Liberar
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
      <Footer />
    </>
  );
};

export default SolicitarTurno;
