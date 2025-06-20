import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CrearDisponibilidad.css';
import Header from '../../Componentes/Header';
import Footer from '../../Componentes/Footer';

const SolicitarTurno = () => {
  const [turnosDisponibles, setTurnosDisponibles] = useState([]);
  const navigate = useNavigate();

  const handleVolver = () => {
    navigate(-1); // vuelve a la página anterior
    // Si querés ir al inicio, usá: navigate('/');
  };

  useEffect(() => {
    fetch('http://localhost:5083/api/Disponibilidad/disponibles', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const disponibles = data.filter(
          (turno) => turno.estado === 'Disponible' || turno.estado === 'Reservado'
        );
        setTurnosDisponibles(disponibles);
      })
      .catch((err) => console.error('Error fetching turnos:', err));
  }, []);

  const actualizarTurno = async (turno, nuevoEstado) => {
    const turnoActualizado = {
      ...turno,
      estado: nuevoEstado,
    };

    try {
      const response = await fetch(`http://localhost:5083/api/Disponibilidad/${turno.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(turnoActualizado),
      });

      if (!response.ok) throw new Error('Error al actualizar turno');

      // Actualizar estado en frontend
      setTurnosDisponibles((prev) =>
        prev.map((t) => (t.id === turno.id ? { ...t, estado: nuevoEstado } : t))
      );
    } catch (error) {
      console.error('Error al cambiar estado del turno:', error);
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
          <p style={{ textAlign: 'center', color: '#6b46c1' }}>No hay turnos disponibles.</p>
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
              {turnosDisponibles.map((turno) => {
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
                          onClick={() => actualizarTurno(turno, 'Reservado')}
                        >
                          Solicitar
                        </button>
                      ) : (
                        <button
                          className="btn-liberar"
                          onClick={() => actualizarTurno(turno, 'Disponible')}
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
