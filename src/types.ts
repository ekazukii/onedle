export type Character = {
  ename: string;
  affiliation?: string[];
  occupation?: string[];
  status: string;
  firstChap?: number;
  firstEpisode?: number;
  origin?: string;
  residence?: string;
  age?: number;
  dftype?: string[];
  bounty?: number;
};

export type Guess = Required<{
  [index in keyof Character]: {
    color: 'red' | 'green' | 'orange';
    direction?: 'up' | 'down';
  };
}>;

export const createEmptyGuess = (): Guess => ({
  ename: { color: 'red' },
  affiliation: { color: 'red' },
  occupation: { color: 'red' },
  status: { color: 'red' },
  firstChap: { color: 'red' },
  firstEpisode: { color: 'red' },
  origin: { color: 'red' },
  residence: { color: 'red' },
  age: { color: 'red' },
  dftype: { color: 'red' },
  bounty: { color: 'red' }
});
