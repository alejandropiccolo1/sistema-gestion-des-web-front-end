import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registro from './Auth/Registro';
import Login from './Auth/Login';
import Paciente from './Pages/Paciente/Paciente';
import Profesional from './Pages/Profesional/Profesional';
import SolicitarTurno from './Pages/Paciente/SolicitarTurno';
import CrearDisponibilidad from './Pages/Profesional/CrearDisponibilidad';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import Protegido from "./Componentes/Protegido";
import { AuthProvider } from './Context/AuthContext';
import { StatsProvider } from "./Context/StatsContext";
import TurnosAsignados from './Pages/Profesional/TurnosAsignados';
function App() {
  return (
    <AuthProvider>
      <StatsProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Registro />} />
            <Route path="/login" element={<Login />} />
            <Route path="/header" element={<Header />} />
            <Route path="/footer" element={<Footer />} />

            {/* Rutas protegidas */}
            <Route path="/paciente" element={
              <Protegido>
                <Paciente />
              </Protegido>
            } />
            <Route path="/paciente/solicitar-turno" element={
              <Protegido>
                <SolicitarTurno />
              </Protegido>
            } />

            <Route path="/profesional" element={
              <Protegido>
                <Profesional />
              </Protegido>
            } />

            <Route path="/profesional/disponibilidad" element={
              <Protegido>
                <CrearDisponibilidad />
              </Protegido>
            } />

            <Route path="/profesional/turnos-asignados" element={
              <Protegido>
               <TurnosAsignados />
              </Protegido>
            } />

            {/* Más rutas privadas, siempre con <Protegido> */}
          </Routes>
        </div>
      </Router>
      </StatsProvider>
    </AuthProvider>
  );
}

export default App;
