import React from 'react';
import './App.css';
import { GameContainer } from "./components/GameContainer";
import { BindHotKeys } from './components/keymap';

const keyMap = {
  MOVE_LEFT: "left",
  MOVE_RIGHT: "right",
  MOVE_UP: "up",
  MOVE_DOWN: "down",
};

const App: React.FC = () => {
  return (
    <div className="App">
      <BindHotKeys keyMap={keyMap}>
        <GameContainer />
      </BindHotKeys>
    </div>
  );
}

export default App;
