import React from 'react';
import Header from '../../Componentes/Header';
import Footer from '../../Componentes/Footer';
const turnosMock = [
  { fecha: '24/05/2025', desde: '09:00', hasta: '12:00', duracion: '30 min' },
  { fecha: '25/05/2025', desde: '14:00', hasta: '17:00', duracion: '20 min' }
];

const SolicitarTurno = () => {
  return (
    <>
    <Header/>
        <div className="table-container">
      <h3 className="table-title">📅 Turnos disponibles</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Día</th>
            <th>Desde</th>
            <th>Hasta</th>
            <th>Duración</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {turnosMock.map((turno, index) => (
            <tr key={index}>
              <td>{turno.fecha}</td>
              <td>{turno.desde}</td>
              <td>{turno.hasta}</td>
              <td>{turno.duracion}</td>
              <td><button className="btn-reservar">Reservar</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    <Footer/>
    </>

  );
};

export default SolicitarTurno;
