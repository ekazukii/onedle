import express from 'express';
import cat1 from './cat1.json' assert { type: 'json' };
import cat1Anime from './cat1-anime.json' assert { type: 'json' };
import morgan from 'morgan';
import helmet from 'helmet';
import { Character } from './types.js';
import { createGuess } from './characters.js';
import { schedule } from 'node-cron';
import seedrandom from 'seedrandom';
import fetch from 'node-fetch';
import { addWinner, getWinners } from './redis.js';
import dotenv from 'dotenv';
dotenv.config();

const animeMapByEName = new Map<String, Character>(),
  mangaMapByEName = new Map<String, Character>();
const initialSeed = process.env.SEED || Math.random().toString();

const initMap = (json: { [key: string]: Character }, map: Map<any, any>) => {
  const entriesList = Object.entries(json).map(([url, character]) =>
    Object.assign(Object.assign({}, character), { url })
  );

  for (const entry of entriesList) {
    map.set(entry.ename, entry);
  }
};

initMap(cat1Anime, animeMapByEName);
initMap(cat1, mangaMapByEName);

const animeEntries = Array.from(animeMapByEName.values());
const mangaEntries = Array.from(mangaMapByEName.values());

let animeDailyChar: Character, mangaDailyChar: Character;

const resetDailyChars = async () => {
  const today = new Date();
  const dayString = today.toISOString().split('T')[0];
  const rng = seedrandom(`${dayString}${initialSeed}`);

  // between 0 and charactersMap.length
  const animeRandomIndex = Math.floor(rng() * animeEntries.length);
  animeDailyChar = animeMapByEName.get(animeEntries[animeRandomIndex].ename)!;
  if (!animeDailyChar) {
    throw new Error('Could not find anime daily char');
  }

  const randomIndex = Math.floor(rng() * mangaEntries.length);
  mangaDailyChar = mangaMapByEName.get(mangaEntries[randomIndex].ename)!;
  if (!mangaDailyChar) {
    throw new Error('Could not find manga daily char');
  }
};

schedule('0 1 * * *', () => {
  resetDailyChars();
});
resetDailyChars();

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
let btcPriceCache: any = null;
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

app.get('/', async (req, res) => {
  const winners = await getWinners();
  res.render('index', { entries: mangaEntries, winners });
});

app.get('/charlist', async (req, res) => {
  res.render('charlist', { entries: mangaEntries });
});

app.get('/charlist/anime', async (req, res) => {
  res.render('partials/char-list', { entries: animeEntries });
});

app.post('/htmx/guess', async (req, res) => {
  const guessed = req.body.character;
  const cryptoBroMode = req.body.cryptoBroMode == 'true';
  const char: any = mangaMapByEName.get(guessed);
  if (!char) {
    res.status(404).send('Character not found');
    return;
  }
  if (cryptoBroMode && char.bounty && !char.btcBounty) {
    const btcUsdPrice = await getBTCPrice();
    const charDollarsBounty = char.bounty / 100;
    char.btcBounty = charDollarsBounty / btcUsdPrice;
  }
  const guess = createGuess(char, mangaDailyChar);
  if (guess.ename.color === 'green') {
    addWinner();
  } else {
    res.status(206);
  }
  res.render('partials/trow', { char, guess, cryptoBroMode, anime: false });
});

app.post('/htmx/guess/anime', async (req, res) => {
  const guessed = req.body.character;
  const cryptoBroMode = req.body.cryptoBroMode == 'true';
  const char: any = animeMapByEName.get(guessed);
  if (!char) {
    res.status(404).send('Character not found');
    return;
  }
  if (cryptoBroMode && char.bounty && !char.btcBounty) {
    const btcUsdPrice = await getBTCPrice();
    const charDollarsBounty = char.bounty / 100;
    char.btcBounty = charDollarsBounty / btcUsdPrice;
  }
  const guess = createGuess(char, animeDailyChar);
  if (guess.ename.color === 'green') {
    addWinner();
  } else {
    res.status(206);
  }
  res.render('partials/trow', { char, guess, cryptoBroMode, anime: true });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
