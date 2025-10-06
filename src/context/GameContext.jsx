import React, { createContext, useContext, useState } from "react";

export const GameContext = createContext();

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState({
    player1: null,
    player2: null,
  });

  return (
    <GameContext.Provider value={{ players, setPlayers }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
