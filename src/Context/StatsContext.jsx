import React, { createContext, useContext, useState } from "react";

const StatsContext = createContext();

export const StatsProvider = ({ children }) => {
  const [stats, setStats] = useState({
    turnosHoy: 0,
    pacientesActivos: 0,
    disponibilidad: 0
  });

  const updateStats = (newStats) => {
    setStats(prev => ({
      ...prev,
      ...newStats
    }));
  };

  return (
    <StatsContext.Provider value={{ stats, updateStats }}>
      {children}
    </StatsContext.Provider>
  );
};

export const useStats = () => useContext(StatsContext);
