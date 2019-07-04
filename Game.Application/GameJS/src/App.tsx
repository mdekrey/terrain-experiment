import React from 'react';
import './App.css';
import { GameEngine } from "./components/GameEngine";
import { CharacterSelection } from "./components/CharacterSelection";
import { BindHotKeys } from './components/keymap';
import { Switch, Route } from 'react-router';
import { useService } from './injector';
import "./authentication";
import { useObservable } from './rxjs';

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
  const authService = useService("authenticationService");
  const token = useObservable(authService.activeToken, undefined);
  if (token === null) {
    window.location.href = "/api/account/login";
    return null;
  }
  const prerenderedLoginScreen =
    token === undefined ? <>Loading</>
    : null;
  return (
    <BindHotKeys keyMap={keyMap} continuousMap={continuousMap} className="App" attach={window}>
      <Switch>
        {prerenderedLoginScreen}
        <Route exact path="/" component={CharacterSelection} />
        <Route exact path="/play/:characterId" component={GameEngine} />
      </Switch>
    </BindHotKeys>
  );
}

export default App;
