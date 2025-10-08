// src/context/GameContext.jsx
import React, { createContext, useContext, useState } from "react";

const GameContext = createContext(undefined);

export const GameProvider = ({ children }) => {
  const [players, setPlayers] = useState({
    player1: null,
    player2: null,
    gameId: null,
  });

  return (
    <GameContext.Provider value={{ players, setPlayers }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const ctx = useContext(GameContext);
  if (ctx === undefined) {
    throw new Error("useGame() called outside <GameProvider>. Kontrollera att Provider omsluter Board.");
  }
  return ctx;
};
