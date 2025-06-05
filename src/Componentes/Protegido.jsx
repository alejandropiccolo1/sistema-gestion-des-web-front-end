import { useAuth } from "../Context/AuthContext";
import { Navigate } from "react-router-dom";

const Protegido = ({ children }) => {
  const { usuario, cargando } = useAuth();

  if (cargando) {
    return <p>Cargando...</p>; // Podés poner un spinner o loader
  }

  if (!usuario) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default Protegido;
