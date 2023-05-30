// src/contexts/GameContext.tsx
import React, {useRef, createContext, useContext, useState, useEffect } from 'react';
import { Item, ItemTypes } from '../types';

// ダンジョンの大きさを定義
const DUNGEON_WIDTH = 10;
const DUNGEON_HEIGHT = 10;
// 初期生成されるアイテムの数を定義
const ITEM_NUMBER = 8;

interface Position {
  x: number;
  y: number;
}

// ダンジョンの全ての座標を生成する
const allPositions: Position[] = [];
for(let x = 0; x < DUNGEON_WIDTH; x++) {
  for(let y = 0; y < DUNGEON_HEIGHT; y++) {
    allPositions.push({ x, y });
  }
}

// 初期アイテムの配置を生成する関数
function generateItems() {
  const items: Item[] = [];
  const itemTypes = Object.values(ItemTypes);

// allPositionsからランダムに座標を選び、アイテムを生成する
for (let i = 0; i < ITEM_NUMBER; i++) {
  const randomIndex = Math.floor(Math.random() * allPositions.length);
  const position = allPositions.splice(randomIndex, 1)[0]; // spliceを使って座標を取り出すと同時にallPositionsからその座標を削除する
  const itemType = itemTypes[Math.floor(Math.random() * itemTypes.length)];
  items.push({ type: itemType, position });
}

  return items;
}

// プレイヤーの初期位置をランダムに生成する関数
function generateRandomPlayerPosition(items: Item[]) {
  let playerPosition: Position;
  while (true) {
    const randomX = Math.floor(Math.random() * DUNGEON_WIDTH);
    const randomY = Math.floor(Math.random() * DUNGEON_HEIGHT);
    playerPosition = { x: randomX, y: randomY };

    // アイテムと重ならない位置が生成されたらループを抜ける
    const overlap = items.some(item => item.position.x === playerPosition.x && item.position.y === playerPosition.y);
    if (!overlap) {
      break;
    }
  }
  return playerPosition;
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
  const [playerPosition, setPlayerPosition] = useState(generateRandomPlayerPosition(items)); // プレイヤーの初期位置をランダムに生成
  const [collectedItems, setCollectedItems] = useState<Item[]>([]); // 追加
  const itemsRef = useRef(items);
  const collectedItemsRef = useRef(collectedItems);
  const [renderCount, setRenderCount] = useState(0);

  const movePlayer = (newPosition: { x: number, y: number }) => {
    setPlayerPosition(newPosition);
  
    const itemIndex = itemsRef.current.findIndex(item => item.position.x === newPosition.x && item.position.y === newPosition.y);
    if (itemIndex !== -1) {
      const item = itemsRef.current[itemIndex];
      itemsRef.current.splice(itemIndex, 1);
      collectedItemsRef.current.push(item);
  
      setRenderCount(renderCount => renderCount + 1); // notify React to re-render
    }

    return (
      <GameContext.Provider value={{ items, setItems, playerPosition, movePlayer, collectedItems, setCollectedItems }}>
        {children}
      </GameContext.Provider>
    );
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