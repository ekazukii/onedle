import { Character, createEmptyGuess, Guess } from './types.js';

export const createGuess = (character: Character, dailyChar: Character): Guess => {
  const guess = createEmptyGuess();

  if (character.ename === dailyChar.ename) {
    guess.ename.color = 'green';
  }

  if (character.affiliation === dailyChar.affiliation) {
    guess.affiliation.color = 'green';
  } else if (character.affiliation && dailyChar.affiliation) {
    const totalSet = new Set([...character.affiliation, ...dailyChar.affiliation]);
    if (totalSet.size === character.affiliation.length + dailyChar.affiliation.length) {
      guess.affiliation.color = 'red';
    } else if (
      totalSet.size === character.affiliation.length &&
      character.affiliation.length === dailyChar.affiliation.length
    ) {
      guess.affiliation.color = 'green';
    } else {
      guess.affiliation.color = 'orange';
    }
  }

  if (character.occupation === dailyChar.occupation) {
    guess.occupation.color = 'green';
  } else if (character.occupation && dailyChar.occupation) {
    const totalSet = new Set([...character.occupation, ...dailyChar.occupation]);
    if (totalSet.size === character.occupation.length + dailyChar.occupation.length) {
      guess.occupation.color = 'red';
    } else if (
      totalSet.size === character.occupation.length &&
      character.occupation.length === dailyChar.occupation.length
    ) {
      guess.occupation.color = 'green';
    } else {
      guess.occupation.color = 'orange';
    }
  }

  if (character.status === dailyChar.status) {
    guess.status.color = 'green';
  }

  if (character.firstChap === dailyChar.firstChap) {
    guess.firstChap.color = 'green';
  } else if (character.firstChap && dailyChar.firstChap) {
    if (character.firstChap < dailyChar.firstChap) {
      guess.firstChap.direction = 'up';
    } else {
      guess.firstChap.direction = 'down';
    }
  }

  if (character.firstEpisode === dailyChar.firstEpisode) {
    guess.firstEpisode.color = 'green';
  } else if (character.firstEpisode && dailyChar.firstEpisode) {
    if (character.firstEpisode < dailyChar.firstEpisode) {
      guess.firstEpisode.direction = 'up';
    } else {
      guess.firstEpisode.direction = 'down';
    }
  }

  if (character.origin === dailyChar.origin) {
    guess.origin.color = 'green';
  }

  if (character.residence === dailyChar.residence) {
    guess.residence.color = 'green';
  }

  if (character.dftype === dailyChar.dftype) {
    guess.dftype.color = 'green';
  } else if (character.dftype && dailyChar.dftype) {
    const totalSet = new Set([...character.dftype, ...dailyChar.dftype]);
    if (totalSet.size === character.dftype.length + dailyChar.dftype.length) {
      guess.dftype.color = 'red';
    } else if (totalSet.size === character.dftype.length && character.dftype.length === dailyChar.dftype.length) {
      guess.dftype.color = 'green';
    } else {
      guess.dftype.color = 'orange';
    }
  }

  if (character.age === dailyChar.age) {
    guess.age.color = 'green';
  } else if (character.age && dailyChar.age) {
    if (character.age < dailyChar.age) {
      guess.age.direction = 'up';
    } else {
      guess.age.direction = 'down';
    }
  }

  if (character.bounty === dailyChar.bounty) {
    guess.bounty.color = 'green';
  } else if (character.bounty && dailyChar.bounty) {
    if (character.bounty < dailyChar.bounty) {
      guess.bounty.direction = 'up';
    } else {
      guess.bounty.direction = 'down';
    }
  }
  return guess;
};
