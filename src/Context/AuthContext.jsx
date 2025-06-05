import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  // Cargar usuario y verificar expiración
  useEffect(() => {
  const usuarioGuardado = localStorage.getItem("usuarioActual");
  const tokenExpira = localStorage.getItem("tokenExpira");
  console.log("Usuario guardado:", usuarioGuardado);
  console.log("Token expira en:", tokenExpira);

  if (usuarioGuardado && tokenExpira) {
    const ahora = Date.now();
    console.log("Hora actual:", ahora);
    console.log("Hora expiración token:", Number(tokenExpira));

    if (ahora > Number(tokenExpira)) {
      console.log("Token expiró, logout");
       alert("Tu sesión expiró. Por favor, inicia sesión de nuevo.");
      logout();
    } else {
      console.log("Token válido, usuario cargado");
      setUsuario(JSON.parse(usuarioGuardado));
    }
  } else {
    console.log("No hay usuario o token");
  }
  setCargando(false);
  }, []);


  // Función para login
  const login = (userData, expiracionMs) => {
    setUsuario(userData);
    localStorage.setItem("usuarioActual", JSON.stringify(userData));

    // Guardar la expiración del token (ej: Date.now() + 3600000 para 1h)
    if (expiracionMs) {
      localStorage.setItem("tokenExpira", Date.now() + expiracionMs);
    }
  };

  // Función para logout
  const logout = () => {
    setUsuario(null);
    localStorage.removeItem("usuarioActual");
    localStorage.removeItem("tokenExpira");
  };

  return (
    <AuthContext.Provider value={{ usuario, login, logout, cargando}}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};
