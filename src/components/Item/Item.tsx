// src/components/Item/Item.tsx
import React from 'react';
import styled from '@emotion/styled';
import { ItemTypes } from '../../types';

interface ItemProps {
  type: ItemTypes;
}

const ItemIcon = styled.div`
  font-size: 2em;  // アイテムの大きさを調整
`;

const Item: React.FC<ItemProps> = ({ type }) => {
  let display;

  switch (type) {
    case ItemTypes.RICE:
      display = '🍚';
      break;
    case ItemTypes.TUNA:
      display = '🐟';
      break;
    case ItemTypes.SALMON:
      display = '🐠';
      break;
    case ItemTypes.ROE:
      display = '🍣';
      break;
  }

  return (
    <ItemIcon>
      {display}
    </ItemIcon>
  );
};

export default Item;
