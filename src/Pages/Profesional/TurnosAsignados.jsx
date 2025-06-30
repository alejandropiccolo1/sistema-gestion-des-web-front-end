import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
 import '../../styles/TurnosAsignados.css';
import { Calendar, Clock, Users } from 'lucide-react';

import Header from '../../Componentes/Header';
import Footer from '../../Componentes/Footer';

function TurnosAsignados() {
  const [turnosAsignados, setTurnosAsignados] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5083/api/Disponibilidad', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          // Filtrar solo turnos que no estén disponibles (asignados)
          const asignados = data.filter(turno => turno.estado !== 'Disponible');
          setTurnosAsignados(asignados);

          if (asignados.length === 0) {
            setMensaje('No hay turnos asignados actualmente.');
          } else {
            setMensaje('');
          }
        })
        .catch(() => setMensaje('Error al cargar los turnos asignados'));
      
      setTimeout(() => setMensaje(''), 3000);
    } else {
      setMensaje('No estás autenticado');
      setTimeout(() => setMensaje(''), 3000);
    }
  }, [token]);

  const handleVolver = () => navigate(-1);

  // Ejemplo de función para cancelar turno asignado
  // (dependerá de la lógica que quieras implementar)
  const handleCancelarAsignacion = async (id) => {
    if (!window.confirm('¿Querés cancelar este turno asignado?')) return;

    try {
      const res = await fetch(`http://localhost:5083/api/Disponibilidad/${id}`, {
        method: 'PUT', // o el método que uses para cambiar estado
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          estado: 'Disponible', // Cambiar estado a disponible
        }),
      });
      if (!res.ok) throw new Error('Error al cancelar el turno');

      // Refrescar lista después de cancelar
      const listaActualizada = await fetch('http://localhost:5083/api/Disponibilidad', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await listaActualizada.json();
      const asignados = data.filter(turno => turno.estado !== 'Disponible');
      setTurnosAsignados(asignados);
      setMensaje('Turno cancelado correctamente');
    } catch {
      setMensaje('Error al cancelar el turno');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  return (
    <>
      <Header mostrarMenu={false} />
      <div className="container">
        <div className="table-container">
          <h2 className="table-title">Turnos Asignados</h2>
          {mensaje && <p className="mensaje-exito">{mensaje}</p>}

          <table className="table">
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Duración</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {turnosAsignados.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ padding: '1rem', textAlign: 'center' }}>
                    No hay turnos asignados.
                  </td>
                </tr>
              ) : (
                turnosAsignados.map(turno => (
                  <tr key={turno.id}>
                    <td>{turno.fechaHoraInicio?.split('T')[0]}</td>
                    <td>{turno.fechaHoraInicio?.split('T')[1].slice(0, 5)}</td>
                    <td>{turno.fechaHoraFin?.split('T')[1].slice(0, 5)}</td>
                    <td>{turno.duracion} min</td>
                    <td>{turno.estado}</td>
                    <td>
                      {/* Si quieres alguna acción como cancelar */}
                      <button
                        className="btn-accion eliminar"
                        onClick={() => handleCancelarAsignacion(turno.id)}
                      >
                        Cancelar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <button className="btn-volver" onClick={handleVolver}>
            Volver
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default TurnosAsignados;
