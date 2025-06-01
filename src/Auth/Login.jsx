import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import '../styles/Registro.css';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    contraseña: '',
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:5083/api/Auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: formData.email,
        contraseña: formData.contraseña
      })
    });

    if (response.ok) {
      const data = await response.json();
      console.log("Token recibido:", data.token);

      const { token } = data;

      // Guardar el token en localStorage
      localStorage.setItem("token", token);

      // Decodificar el payload del JWT
      const payload = JSON.parse(atob(token.split(".")[1]));
      console.log("Payload:", payload);

      // Obtener directamente la clave role y especialidad
      const rol = payload.role;
      const especialidad = payload.Especialidad;

      console.log("Rol:", rol);
      console.log("Especialidad:", especialidad);

      // Guardar usuario en el contexto
      login({
        rol,
        email: payload.email,
        name: payload.unique_name,
        apellido: payload.apellido,
        especialidad
      });

      // Redirigir según el rol
      if (rol === "profesional") {
        navigate("/profesional");
      } else {
        navigate("/paciente");
      }
    } else {
      alert("Email o contraseña incorrectos");
    }
  } catch (error) {
    console.error("Error en el login:", error);
    alert("Ocurrió un error. Intentalo de nuevo más tarde.");
  }
};

  return (
    <div className="registro-container">
      <div className="form-box">
        <h2>Iniciar Sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input
              type="password"
              name="contraseña"
              value={formData.contraseña}
              onChange={handleChange}
              required
            />
          </div>
          <button type="submit">Entrar</button>
        </form>
        <p className="text-center-link">
          ¿No tenés cuenta? <a href="/">Registrate</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
