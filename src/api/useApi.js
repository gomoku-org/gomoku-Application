// src/api/useApi.js
import { useApiClient } from "./ApiProvider";

export const useApi = () => {
  const api = useApiClient();

  const getGameIds = () => api.request(`/api/gomoku/games`, "GET");
  const getGameById = (id) => api.request(`/api/gomoku/games/${id}`, "GET");
  const createGame = (name) =>
    api.request(
      `/api/gomoku/games/add${name ? `?name=${encodeURIComponent(name)}` : ""}`,
      "GET"
    );

  const getGamesDetailed = async () => {
    const ids = await getGameIds();
    if (!Array.isArray(ids)) return [];
    const results = await Promise.allSettled(ids.map((id) => getGameById(id)));
    return results.filter(r => r.status === "fulfilled").map(r => r.value);
  };

  const listPlayers = () => api.request(`/api/gomoku/players`, "GET");
  const createPlayer = () => api.request(`/api/gomoku/player/create`, "GET");
  const getPlayerById = (id) => api.request(`/api/gomoku/player/${id}`, "GET");
  const joinGame = (gameId, playerId) =>
    api.request(`/api/gomoku/player/join/${gameId}/${playerId}`, "GET");
  const playMove = (gameId, playerId, col, row) =>
    api.request(
      `/api/gomoku/player/play/${gameId}/${playerId}/${col}/${row}`,
      "GET"
    );

  return {
    getGameIds,
    getGameById,
    getGamesDetailed,
    createGame,
    listPlayers,
    createPlayer,
    getPlayerById,
    joinGame,
    playMove,
  };
};
