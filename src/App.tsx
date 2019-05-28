import React from 'react';
import logo from './logo.svg';
import './App.css';
import { Terrain } from './components/terrain';

const App: React.FC = () => {
  return (
    <div className="App">
        <Terrain/>
    </div>
  );
}

export default App;
