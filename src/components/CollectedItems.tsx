import React from 'react';
import styled from '@emotion/styled';
import { useGameContext } from '../contexts/GameContext';
import { ItemTypes } from '../types';

const Container = styled.div`
  text-align: center;
  margin-top: 20px;
`;

const ItemContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const Item = styled.div`
  font-size: 2em; /* 修正 */
`;

const CollectedItems: React.FC = () => {
  const { collectedItems } = useGameContext();

  return (
    <Container>
      <h2>Collected Items</h2>
      <ItemContainer>
        {collectedItems.map((item: { type: ItemTypes }, index: number) => (
          <Item key={index}>{/* 修正 */}
            {item.type === ItemTypes.RICE && '🍚'}
            {item.type === ItemTypes.TUNA && '🐟'}
            {item.type === ItemTypes.SALMON && '🐠'}
            {item.type === ItemTypes.ROE && '🍣'}
          </Item>
        ))}
      </ItemContainer>
    </Container>
  );
};

export default CollectedItems;
