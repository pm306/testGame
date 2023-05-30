// src/contexts/GameContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Item, ItemTypes } from '../types';

// ダンジョンの大きさを定義
const DUNGEON_WIDTH = 10;
const DUNGEON_HEIGHT = 10;

// 初期アイテムの配置を生成する関数
function generateItems() {
  const items: Item[] = [];
  const itemTypes = Object.values(ItemTypes);

  for (let i = 0; i < 5; i++) {  // 5つのアイテムを生成
    const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
    const position = { x: Math.floor(Math.random() * DUNGEON_WIDTH), y: Math.floor(Math.random() * DUNGEON_HEIGHT) };
    items.push({ type: itemType, position });
  }

  return items;
}

// GameContextに渡す値の型を定義
// GameContext.tsx
interface GameContextProps {
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  playerPosition: { x: number, y: number };
  movePlayer: (newPosition: { x: number, y: number }) => void;
  collectedItems: Item[];  // ここを追加
  setCollectedItems: React.Dispatch<React.SetStateAction<Item[]>>; // 追加
}


const GameContext = createContext<GameContextProps | undefined>(undefined);

interface ProviderProps {
  children: React.ReactNode;
}

export const GameProvider: React.FC<ProviderProps> = ({ children }) => {
  const [items, setItems] = useState(generateItems());
  const [playerPosition, setPlayerPosition] = useState({ x: 0, y: 0 });
  const [collectedItems, setCollectedItems] = useState<Item[]>([]); // 追加

const movePlayer = (newPosition: { x: number, y: number }) => {
  setPlayerPosition(newPosition);

  const itemIndex = items.findIndex(item => item.position.x === newPosition.x && item.position.y === newPosition.y);
  if (itemIndex !== -1) {
    const itemCollected = items[itemIndex];
    const newItems = [...items];
    newItems.splice(itemIndex, 1);  // プレイヤーが収集したアイテムを削除
    setItems(newItems);
    setCollectedItems(prev => [...prev, itemCollected]);  // アイテムを collectedItems に追加
  }
};


  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowUp':
          movePlayer({ x: playerPosition.x, y: Math.max(playerPosition.y - 1, 0) });
          break;
        case 'ArrowLeft':
          movePlayer({ x: Math.max(playerPosition.x - 1, 0), y: playerPosition.y });
          break;
        case 'ArrowDown':
          movePlayer({ x: playerPosition.x, y: Math.min(playerPosition.y + 1, DUNGEON_HEIGHT - 1) });
          break;
        case 'ArrowRight':
          movePlayer({ x: Math.min(playerPosition.x + 1, DUNGEON_WIDTH - 1), y: playerPosition.y });
          break;
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, [playerPosition]);

  return (
    <GameContext.Provider value={{ items, setItems, playerPosition, movePlayer, collectedItems, setCollectedItems }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
};