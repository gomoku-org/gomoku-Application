import React from "react";
import { useNavigate } from "react-router-dom";
import { Header, ReglerButton, StartButton } from "gomoku-component";
import styles from "./HomePage.module.css";

const HomePage = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    navigate("/setup");
  };

  return (
    <div>
      <Header />

      <div className={styles.buttonContainer}>
        <StartButton
          StartButtonText="Starta spelet"
          onStart={() => { console.log("Start klick!"); handleStart(); }}
        />
        <ReglerButton buttonLabel="Regler" />
      </div>
    </div>
  );
};

export default HomePage;
