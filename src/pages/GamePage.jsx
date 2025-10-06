import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../api/useApi";
import { useGame } from "../context/GameContext";
import Board from "../components/Board/Board";

export default function GamePage() {
  const { getGameById } = useApi();
  const { players } = useGame();
  const navigate = useNavigate();
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!players?.gameId) {
      navigate("/setup");
      return;
    }

    (async () => {
      try {
        const data = await getGameById(players.gameId);
        setGame(data);
      } catch (error) {
        console.error("Kunde inte hämta spelet:", error);
      } finally {
        setLoading(false);
      }
    })();
  }, [players?.gameId, getGameById, navigate]);

  if (loading) return <p>Laddar spel...</p>;
  if (!game) return null;

  return (
    <div>
      <Board />
    </div>
  );
}
