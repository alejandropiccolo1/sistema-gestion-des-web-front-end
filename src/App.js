import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Registro from './Auth/Registro';
import Login from './Auth/Login';
import Paciente from './Pages/Paciente/Paciente';
 import Profesional from './Pages/Profesional/Profesional';
import Turnos from './Pages/Turnos/Turnos';
import CrearDisponibilidad from './Pages/Profesional/CrearDisponibilidad';
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          
          <Route path="/" element={<Registro />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/login" element={<Login/>} />
           <Route path="/header" element={<Header/>} />
          <Route path="/paciente" element={<Paciente/>} />
          <Route path="/profesional" element={<Profesional/>} /> 
         <Route path="/profesional/disponibilidad" element={<CrearDisponibilidad />} />
          <Route path="/paciente/turnos" element={<Turnos/>} /> 
          <Route path="/profesional/disponibilidad" element={<CrearDisponibilidad />} />
          {/* Acá más adelante podés agregar otras rutas como /login, /panel, etc. */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
