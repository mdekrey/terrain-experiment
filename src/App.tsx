import React from 'react';
import './App.css';
import { GameContainer } from "./components/GameContainer";
import { BindHotKeys } from './components/keymap';
import { ChildInjector, Scope } from './injector';

const keyMap = {
  MOVE_LEFT: "left",
  MOVE_RIGHT: "right",
  MOVE_UP: "up",
  MOVE_DOWN: "down",
};

const App: React.FC = () => {
  return (
      <BindHotKeys keyMap={keyMap} className="App">
        <ChildInjector beginScopes={[ Scope.Component ]}>
          <GameContainer />
        </ChildInjector>
      </BindHotKeys>
  );
}

export default App;
