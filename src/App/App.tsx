/* eslint-disable prettier/prettier */
import * as React from "react";
import { useState } from "react";

import logo from "../assets/logo.png";
import Game from "../components/Game";

import styles from "./App.module.scss";

const App: React.FC = () => {

  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  return (
    <main className={styles.container}>
      <header className={`${styles.header} ${isPlaying ? styles.hideHeader : ""}`}>
        <h1>
          <img alt="BlackBox Vision" src={logo} width={480} />
        </h1>
        <button onClick={() => setIsPlaying(true)}>
          <h3>¡Empezar a jugar!</h3>
        </button>
      </header>
     
      <div className={`${styles.game} ${isPlaying ? styles.showGame : ""}}`}>
        <Game />
      </div>

    </main>
  );
};

export default App;
