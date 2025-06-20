import React, { useState } from 'react';
import "../styles/Registro.css"

function Registro() {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contraseña: '',
    rol: 'paciente',
    especialidad: '',
    matricula: '' // agregado matricula
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // // Validación simple frontend para matrícula
    // if (formData.rol === 'profesional' && formData.matricula.trim() === '') {
    //   alert("La matrícula es obligatoria para profesionales");
    //   return;
    // }

    try {
      const resPost = await fetch("http://localhost:5083/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (resPost.ok) {
        alert("Usuario registrado correctamente");
        window.location.href = "/login";
      } else {
        const errorData = await resPost.json();
        alert(errorData.message || "Hubo un error al registrar el usuario.");
      }

    } catch (error) {
      console.error("Error al registrar:", error);
      alert("Error al registrar el usuario.");
    }
  };

  return (
    <div className="registro-container">
      <div className='form-box'>
        <h2>Registro de Usuario</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nombre:</label>
            <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Apellido:</label>
            <input type="text" name="apellido" value={formData.apellido} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contraseña:</label>
            <input type="password" name="contraseña" value={formData.contraseña} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Rol:</label>
            <select name="rol" value={formData.rol} onChange={handleChange}>
              <option value="paciente">Paciente</option>
              <option value="profesional">Profesional</option>
            </select>
          </div>

          {formData.rol === 'profesional' && (
            <>
              <div className="form-group">
                <label>Especialidad:</label>
                <input
                  type="text"
                  name="especialidad"
                  value={formData.especialidad}
                  onChange={handleChange}
                  placeholder="Ej: Traumatólogo, Psicólogo, etc."
                  required
                />
              </div>
              {/* <div className="form-group">
                <label>Matrícula:</label>
                <input
                  type="text"
                  name="matricula"
                  value={formData.matricula}
                  onChange={handleChange}
                  placeholder="Ej: 12345"
                  required
                />
              </div> */}
            </>
          )}

          <button type="submit">Registrarse</button>
          <p className="text-center-link">
            ¿Ya tenés cuenta? <a href="/login">Iniciá sesión</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Registro;
