import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/CrearDisponibilidad.css';
import Header from '../../Componentes/Header';
import Footer from '../../Componentes/Footer';


function CrearDisponibilidad() {
  const [fecha, setFecha] = useState('');
  const [horaInicio, setHoraInicio] = useState('');
  const duracion = 30;
  const [disponibilidades, setDisponibilidades] = useState([]);
  const [mensaje, setMensaje] = useState('');
  const [modoEdicion, setModoEdicion] = useState(false);
  const [idEdicion, setIdEdicion] = useState(null);
  const [profesionalIdEdicion, setProfesionalIdEdicion] = useState(null);
  const [contadorTurnos, setContadorTurnos] = useState(0); // <-- Estado nuevo para contador
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  const calcularHoraFin = (hora) => {
    if (!hora) return '';
    const [h, m] = hora.split(':').map(Number);
    let minutos = m + duracion;
    let horas = h;
    if (minutos >= 60) {
      horas += 1;
      minutos -= 60;
    }
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  };

  const horaFin = calcularHoraFin(horaInicio);

  useEffect(() => {
    if (token) {
      fetch('http://localhost:5083/api/Disponibilidad', {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(res => res.json())
        .then(data => {
          setDisponibilidades(data);
          setContadorTurnos(data.length);  // <-- Actualizo contador aquí
        })
        .catch(() => setMensaje('Error al cargar disponibilidades'));

      setTimeout(() => setMensaje(''), 3000);
    } else {
      setMensaje('No estás autenticado');
      setTimeout(() => setMensaje(''), 3000);
    }
  }, [token]);

  const limpiarFormulario = () => {
    setFecha('');
    setHoraInicio('');
    setModoEdicion(false);
    setIdEdicion(null);
    setProfesionalIdEdicion(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fecha || !horaInicio) {
      setMensaje('Por favor, complete todos los campos');
      setTimeout(() => setMensaje(''), 3000);
      return;
    }

    const idProfesional = modoEdicion ? profesionalIdEdicion : 1;

    const nuevaDisponibilidad = {
      fechaHoraInicio: `${fecha}T${horaInicio}:00`,
      fechaHoraFin: `${fecha}T${horaFin}:00`,
      duracion: duracion,
      profesionalId: idProfesional,
      estado: "Disponible",
    };

    try {
      let res;
      if (modoEdicion) {
        res = await fetch(`http://localhost:5083/api/Disponibilidad/${idEdicion}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: idEdicion,
            ...nuevaDisponibilidad,
          }),
        });
      } else {
        res = await fetch('http://localhost:5083/api/Disponibilidad', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(nuevaDisponibilidad),
        });
      }

      if (!res.ok) throw new Error('Error en la petición');

      const listaActualizada = await fetch('http://localhost:5083/api/Disponibilidad', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await listaActualizada.json();
      setDisponibilidades(data);
      setContadorTurnos(data.length); // <-- Actualizo contador después de guardar

      setMensaje(modoEdicion ? 'Turno actualizado con éxito' : 'Turno creado con éxito');
      limpiarFormulario();
    } catch (error) {
      setMensaje('Error al guardar el turno');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleEliminar = async (id) => {
    if (!window.confirm('¿Seguro que querés eliminar este turno?')) return;

    try {
      const res = await fetch(`http://localhost:5083/api/Disponibilidad/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Error al eliminar');

      const listaActualizada = await fetch('http://localhost:5083/api/Disponibilidad', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await listaActualizada.json();
      setDisponibilidades(data);
      setContadorTurnos(data.length); // <-- Actualizo contador después de eliminar
      console.log("Contador actualizado:", data.length);
      setMensaje('Turno eliminado');
    } catch {
      setMensaje('Error al eliminar turno');
    }
    setTimeout(() => setMensaje(''), 3000);
  };

  const handleEditar = (disp) => {
    if (disp.estado !== 'Disponible') {
      alert('El turno está ocupado y no puede ser editado.');
      return;
    }
    setModoEdicion(true);
    setIdEdicion(disp.id);

    setFecha(disp.fechaHoraInicio.split('T')[0]);
    setHoraInicio(disp.fechaHoraInicio.split('T')[1].slice(0, 5));

    setProfesionalIdEdicion(disp.profesionalId);
  };

  const handleCancelarEdicion = () => {
    limpiarFormulario();
    setMensaje('');
  };

  const handleVolver = () => navigate(-1);

  return (
    <>
      <Header mostrarMenu={false} />
      <div className="container">
        <div className="form-container">
          <h2 className="form-title">{modoEdicion ? 'Editar disponibilidad' : 'Crear disponibilidad'}</h2>
          <p className="info-text">
            Crea los turnos disponibles para que los pacientes puedan reservarlos. Solo se permiten intervalos de 30 minutos entre la hora de inicio y la hora fin.
          </p>
          <p><strong>Total turnos disponibles: {contadorTurnos}</strong></p> {/* <-- Mostrar contador */}
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label className="form-label">📅 Fecha</label>
              <input
                type="date"
                value={fecha}
                onChange={e => setFecha(e.target.value)}
                required
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">🕘 Hora inicio</label>
              <input
                type="time"
                value={horaInicio}
                onChange={e => setHoraInicio(e.target.value)}
                required
                step="1800"
                className="form-input"
              />
              {horaInicio && (
                <p className="hora-fin-text">
                  La hora fin será: <strong>{horaFin}</strong> (duración fija de 30 minutos)
                </p>
              )}
            </div>
            <button type="submit" className="btn-submit">
              {modoEdicion ? 'Guardar cambios' : 'Crear turno disponible'}
            </button>

            {modoEdicion && (
              <button type="button" className="btn-volver" onClick={handleCancelarEdicion}>
                Cancelar edición
              </button>
            )}
            <button type="button" className="btn-volver" onClick={handleVolver}>
              Volver
            </button>

            {mensaje && <p className="mensaje-exito">{mensaje}</p>}
          </form>
        </div>
        <div className="table-container">
          <h3 className="table-title">Turnos creados</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Día</th>
                <th>Desde</th>
                <th>Hasta</th>
                <th>Duración</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {disponibilidades.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center" style={{ padding: '1rem' }}>
                    No hay turnos creados.
                  </td>
                </tr>
              ) : (
                disponibilidades.map((disp) => (
                  <tr key={disp.id}>
                    <td>{disp.fechaHoraInicio?.split('T')[0]}</td>
                    <td>{disp.fechaHoraInicio?.split('T')[1].slice(0, 5)}</td>
                    <td>{disp.fechaHoraFin?.split('T')[1].slice(0, 5)}</td>
                    <td>{disp.duracion} min</td>
                    <td>{disp.estado}</td>
                    <td>
                      <button onClick={() => handleEditar(disp)} className="btn-accion editar">
                        Editar
                      </button>
                      <button onClick={() => handleEliminar(disp.id)} className="btn-accion eliminar">
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default CrearDisponibilidad;
