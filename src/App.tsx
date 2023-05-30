import React from 'react';
import Dungeon from './components/Dungeon/Dungeon';
import { GameProvider } from './contexts/GameContext';
import CollectedItems from './components/CollectedItems';

const App: React.FC = () => {
  return (
    <GameProvider>
      <div className="App">
        <Dungeon />
        <CollectedItems />

      </div>
    </GameProvider>
  );
}

export default App;
