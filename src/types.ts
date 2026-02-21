export interface Pokemon {
  id: number;
  name: string;
  sprites: {
    front_default: string;
    other: {
      'official-artwork': {
        front_default: string;
      };
    };
  };
  stats: {
    base_stat: number;
    stat: {
      name: string;
    };
  }[];
  types: {
    type: {
      name: string;
    };
  }[];
}

export interface BattleState {
  pokemon1: Pokemon | null;
  pokemon2: Pokemon | null;
  hp1: number;
  hp2: number;
  maxHp1: number;
  maxHp2: number;
  logs: string[];
  isBattling: boolean;
  winner: Pokemon | null;
  currentTurn: 1 | 2;
}

export interface Stat {
  name: string;
  value: number;
}
