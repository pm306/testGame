// src/types.ts
export enum ItemTypes {
    RICE = 'rice',
    TUNA = 'tuna',
    SALMON = 'salmon',
    ROE = 'roe'
  }
  
  export interface Item {
    type: ItemTypes;
    position: { x: number, y: number };
  }
  