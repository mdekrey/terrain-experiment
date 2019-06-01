import React from 'react';
import './App.css';
import { GameContainer } from "./components/GameContainer";
import { BindHotKeys } from './components/keymap';
import { ChildInjector, Scope } from './injector';

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
        <ChildInjector beginScopes={[ Scope.Component ]}>
          <GameContainer />
        </ChildInjector>
      </BindHotKeys>
  );
}

export default App;
