import React from 'react';
import { useGameContext } from '../../contexts/GameContext';
import { Cell, Grid, Row } from './Dungeon.styles';
import Player from '../Player/Player';
import Item from '../Item/Item';

const DUNGEON_SIZE = 10;  // ダンジョンのサイズを10x10とする

const Dungeon: React.FC = () => {
  const context = useGameContext();

  // Contextがない場合は何も描画しない
  if (!context) {
    return null;
  }

  const { items, playerPosition } = context;

  const dungeon = Array(DUNGEON_SIZE).fill(0).map((_, y) =>
    Array(DUNGEON_SIZE).fill(0).map((_, x) => {
      const item = items.find(item => item.position.x === x && item.position.y === y);

      return (
        <Cell key={`${x}-${y}`}>
          {x === playerPosition.x && y === playerPosition.y && <Player />}
          {item && <Item type={item.type} />}
        </Cell>
      );
    })
  );

  return (
    <Grid>
      {dungeon.map((row, i) => (
        <Row key={i}>{row}</Row>
      ))}
    </Grid>
  );
};

export default Dungeon;
