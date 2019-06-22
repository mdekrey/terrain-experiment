import React from 'react';
import './App.css';
import { GameEngine } from "./components/GameEngine";
import { BindHotKeys } from './components/keymap';

// TODO - these should be driven by user settings
const keyMap = {
  ACTIVATE: "enter"
};

const continuousMap = {
  MOVE_LEFT: "ArrowLeft",
  MOVE_RIGHT: "ArrowRight",
  MOVE_UP: "ArrowUp",
  MOVE_DOWN: "ArrowDown",
}

const App: React.FC = () => {
  return (
      <BindHotKeys keyMap={keyMap} continuousMap={continuousMap} className="App" attach={window}>
        <GameEngine />
      </BindHotKeys>
  );
}

export default App;
