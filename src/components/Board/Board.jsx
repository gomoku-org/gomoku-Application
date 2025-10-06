import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameContext";
import { useApi } from "../../api/useApi";
import ResetButton from "../ResetButton/ResetButton";
import styles from "./Board.module.css";

export default function Board() {
  const { players, setPlayers } = useGame();
  const { getGameById, playMove } = useApi();
  const navigate = useNavigate();

  const [game, setGame] = useState(null);
  const [sending, setSending] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState(
    players?.player1?.piece === "red" ? 1 : 2
  );

  useEffect(() => {
    let alive = true;
    if (!players?.player1 || !players?.player2 || !players?.gameId) {
      navigate("/setup");
      return;
    }
    (async () => {
      const g = await getGameById(players.gameId);
      if (!alive) return;
      setGame(g);
      if (g?.player != null) setCurrentPlayer(g.player);
    })();
    return () => {
      alive = false;
    };
  }, [players, navigate, getGameById]);

  const board = game?.board || {};
  const tiles = board?.tiles || [];
  const rows = board?.rows ?? (tiles[1]?.length ? tiles[1].length - 1 : 0);
  const cols = board?.cols ?? (tiles.length ? tiles.length - 1 : 0);

  const cellSize = useMemo(() => {
    const maxW = Math.min(window.innerWidth, 900) - 80;
    const maxH = Math.min(window.innerHeight, 700) - 240;
    if (!rows || !cols) return 50;
    const byW = Math.floor(maxW / cols);
    const byH = Math.floor(maxH / rows);
    return Math.max(24, Math.min(70, Math.min(byW, byH)));
  }, [rows, cols]);

  const inBounds = (r, c) => r >= 0 && c >= 0 && r < rows && c < cols;

  const getCell = (r, c) => {
    const colIdx = c + 1;
    const rowIdx = r + 1;
    return tiles?.[colIdx]?.[rowIdx] ?? 0;
  };

  const handleCellClick = async (r, c) => {
    if (sending) return;
    if (!inBounds(r, c)) return;
    if (getCell(r, c) !== 0) return;
    if (game?.player && game.player !== currentPlayer) return;

    setSending(true);
    const playerId = currentPlayer === 1 ? players.player1.id : players.player2.id;

    try {
      const colParam = c + 1;
      const rowParam = r + 1;
      await playMove(players.gameId, playerId, colParam, rowParam);
      const after = await getGameById(players.gameId);
      setGame(after ?? null);
      if (after?.player != null) setCurrentPlayer(after.player);
    } catch (e) {
      console.error("Kunde inte spela draget:", e);
      alert(`Draget misslyckades.\n${e?.message || ""}`);
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setPlayers({ player1: null, player2: null, gameId: null });
    navigate("/");
  };

  return (
    <div className={styles.boardContainer}>
      <button onClick={() => navigate("/setup")} className={styles.backBtn}>
        ⬅ Tillbaka
      </button>

      {!game && <p>Laddar spel…</p>}

      {game && (!game?.player1 || !game?.player2) && (
        <p style={{ marginTop: 80 }}>Spelet väntar på att båda spelarna ska gå med…</p>
      )}

      {game?.player1 && game?.player2 && (
        <>
          <div className={styles.header}>
            <div className={styles.playerCard}>
              <span className={styles.playerPiece}>
                {players.player1.piece === "red" ? "🔴" : "🟡"}
              </span>
              <span>{players.player1.name}</span>
              {currentPlayer === 1 && <span title="Tur"> ⏳</span>}
            </div>
            <span className={styles.vs}>vs</span>
            <div className={styles.playerCard}>
              <span className={styles.playerPiece}>
                {players.player2.piece === "red" ? "🔴" : "🟡"}
              </span>
              <span>{players.player2.name}</span>
              {currentPlayer === 2 && <span title="Tur"> ⏳</span>}
            </div>
          </div>

          <div
            className={styles.board}
            style={{
              gridTemplateColumns: `repeat(${cols}, ${cellSize}px)`,
              gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
            }}
          >
            {Array.from({ length: rows }).map((_, rr) =>
              Array.from({ length: cols }).map((_, cc) => {
                const cell = getCell(rr, cc);
                const filled = cell !== 0;
                return (
                  <div
                    key={`${rr}-${cc}`}
                    className={styles.cell}
                    onClick={!filled && !sending ? () => handleCellClick(rr, cc) : undefined}
                    aria-disabled={filled || sending}
                    style={{
                      width: cellSize,
                      height: cellSize,
                      backgroundColor:
                        cell === 1 ? "red" : cell === 2 ? "yellow" : "#d9d9d9",
                      cursor: filled || sending ? "not-allowed" : "pointer",
                      pointerEvents: filled ? "none" : "auto",
                    }}
                  />
                );
              })
            )}
          </div>

          <div className={styles.resetWrapper}>
            <ResetButton label="Starta Om" onClick={handleReset} />
          </div>
        </>
      )}
    </div>
  );
}
