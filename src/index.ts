import express from 'express';
import cat1 from './cat1.json' assert { type: 'json' };
import morgan from 'morgan';
import helmet from 'helmet';
import { Character } from './types.js';
import { createGuess } from './characters.js';
import { schedule } from 'node-cron';
import seedrandom from 'seedrandom';
import fetch from 'node-fetch';

const charactersMap = cat1 as { [key: string]: Character };
const initialSeed = process.env.SEED || Math.random().toString();

const entriesList = Object.entries(charactersMap).map(([url, character]) =>
  Object.assign(Object.assign({}, character), { url })
);

const mapByEName = new Map();

for (const entry of entriesList) {
  mapByEName.set(entry.ename, entry);
}

let dailyChar: Character;
let dailyWinners = 0;

const resetDailyChamp = async () => {
  const today = new Date();
  const dayString = today.toISOString().split('T')[0];
  const rng = seedrandom(`${dayString}${initialSeed}`);

  // between 0 and charactersMap.length
  const randomIndex = Math.floor(rng() * Object.keys(charactersMap).length);
  dailyChar = entriesList[randomIndex];
  if (!dailyChar) {
    throw new Error('Could not find daily char');
  }
};

schedule('0 1 * * *', () => {
  resetDailyChamp();
});
resetDailyChamp();

const app = express();
const port = 3000;

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        'script-src': ["'self'", 'https://unpkg.com'],
        'script-src-attr': ["'unsafe-inline'"]
      }
    }
  })
);

let btcPrice = 30000;
let btcPriceCache: Date | null = null;
const fiveMinutes = 1000 * 60 * 5;

const getBTCPrice = async () => {
  if (!btcPriceCache || Math.abs(new Date().getDate() - btcPriceCache.getDate()) > fiveMinutes) {
    const data = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd');
    const json = (await data.json()) as any;
    btcPrice = json.bitcoin.usd;
  }

  return btcPrice;
};

app.use(morgan('common'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.render('index', { entries: entriesList, winners: dailyWinners });
});

app.post('/htmx/guess', async (req, res) => {
  const guessed = req.body.character;
  const cryptoBroMode = req.body.cryptoBroMode == 'true';
  const char = mapByEName.get(guessed);
  if (!char) {
    res.status(404).send('Character not found');
    return;
  }
  console.log(cryptoBroMode);
  if (cryptoBroMode && char.bounty && !char.btcBounty) {
    const btcUsdPrice = await getBTCPrice();
    const charDollarsBounty = char.bounty / 100;
    char.btcBounty = charDollarsBounty / btcUsdPrice;
  }
  const guess = createGuess(char, dailyChar);
  if (guess.ename.color === 'green') {
    dailyWinners++;
  } else {
    res.status(206);
  }
  res.render('partials/trow', { char, guess, cryptoBroMode });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
