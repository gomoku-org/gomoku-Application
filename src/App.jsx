// App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import GameSetup from "./pages/GameSetup";
import GamePage from "./pages/GamePage";
import "./App.css";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/setup" element={<GameSetup />} />
        <Route path="/board" element={<GamePage />} />
      </Routes>
    </div>
  );
}
export default App;
