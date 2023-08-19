//hx-post="/htmx/guess" hx-include="#character" hx-target="#tbody" hx-swap="afterbegin"
// element.classList.add('sunny-container-win');
async function handleWin() {
  const sunnies = document.getElementsByClassName('sunny-container');

  for (let i = 0; i < sunnies.length; i++) {
    console.log(i);
    sunnies[i].classList.add('sunny-container-win');
  }

  localStorage.setItem('win', new Date().toISOString().slice(0, 10));

  document.getElementById('win-message').classList.add('active');
  document.getElementById('interactive-game').classList.remove('active');

  const tries = document.getElementById('tbody').childElementCount;
  document.getElementById('n-tries').innerHTML = tries;

  const toast = document.getElementById('win-toast');
  toast.classList.add('show', 'gray');
  setTimeout(function () {
    toast.classList.remove('show', 'gray');
  }, 3000);
}

async function backupGuesses() {
  localStorage.setItem('tableHTML', document.getElementById('tbody').innerHTML);
  localStorage.setItem('character-list', document.getElementById('character-list').innerHTML);
  localStorage.setItem('tableHTMLDate', new Date().toISOString().slice(0, 10));
}

async function submitGuess(event) {
  const formData = new FormData(document.getElementById('form'));
  const input = document.getElementById('character');
  const cryptoBroMode = getSetting('cryptoBro') === 'true';
  const animeMode = getSetting('anime-mode') === 'true';
  formData.append('cryptoBroMode', cryptoBroMode);
  event.preventDefault();
  const bodyData = new URLSearchParams(formData);

  document.querySelector('option[value="' + input.value + '"]').remove();
  input.value = '';
  resetGuess();

  const url = animeMode ? '/htmx/guess/anime' : '/htmx/guess';
  const data = await fetch(url, {
    method: 'POST',
    body: bodyData
  });
  const html = await data.text();
  document.getElementById('tbody').insertAdjacentHTML('afterbegin', html);
  if (data.status === 200) {
    handleWin();
  }
  backupGuesses();
}

async function initGame() {
  const win = localStorage.getItem('win');

  const tableHTMLDate = localStorage.getItem('tableHTMLDate');
  const tableHTML = localStorage.getItem('tableHTML');
  const characterList = localStorage.getItem('character-list');

  if (characterList === null && getSetting('anime-mode') === 'true') {
    setAnimeCharList().then(() => {
      resetGuess();
    });
  } else {
    resetGuess();
  }

  if (tableHTMLDate === new Date().toISOString().slice(0, 10)) {
    if (tableHTML) document.getElementById('tbody').innerHTML = tableHTML;
    if (characterList) document.getElementById('character-list').innerHTML = characterList;
  }

  // if exist and same day
  if (win && win === new Date().toISOString().slice(0, 10)) {
    document.getElementById('win-message').classList.add('active');
    return;
  }

  const game = document.getElementById('interactive-game');
  game.classList.add('active');
}

initGame();

// --------- HELP ------------

function openHelp() {
  document.getElementById('page').classList.add('blur');
  document.getElementById('help-modal').classList.add('open');
}

function closeHelp() {
  document.getElementById('page').classList.remove('blur');
  document.getElementById('help-modal').classList.remove('open');
}

// --------- AUTOCOMPLETE ------------

function nameToImage(ename) {
  return `img/chars/${ename.replace(/\s/g, '_').replace(/\//g, '_')}.jpeg`;
}

function changeGuess(event) {
  const value = event.target.value;
  const options = document.querySelectorAll('#character-list option');
  const optionList = [...options].map(option => option.value);

  const filteredOptions = optionList.filter(option => option.toLowerCase().includes(value.toLowerCase()));

  setAutocomplete(filteredOptions);
}

function setAutocomplete(filteredOptions) {
  const list = document.getElementById('autocomplete-list');
  const items = filteredOptions.map(option => {
    const item = document.createElement('li');
    const image = document.createElement('img');
    const text = document.createElement('span');
    const imageCtn = document.createElement('div');
    text.innerHTML = option;
    image.src = nameToImage(option);
    image.loading = 'lazy';
    imageCtn.classList.add('img-auto-ctn');
    imageCtn.appendChild(image);
    item.appendChild(imageCtn);
    item.appendChild(text);
    item.addEventListener('click', function () {
      document.getElementById('character').value = option;
      list.innerHTML = '';
    });
    return item;
  });
  list.innerHTML = '';
  items.forEach(item => list.appendChild(item));
}

async function setAnimeCharList() {
  const data = await fetch('/charlist/anime');
  const html = await data.text();
  document.getElementById('character-list').innerHTML = html;
}

function resetGuess() {
  changeGuess({ target: { value: '' } });
}
