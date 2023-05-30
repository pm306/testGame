import styled from '@emotion/styled';
import Dungeon from './Dungeon';

export const Grid = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Row = styled.div`
  display: flex;
`;

export const Cell = styled.div`
  width: 50px;
  height: 50px;
  border: 1px solid black;
`;
