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
}

async function backupGuesses() {
  localStorage.setItem('tableHTML', document.getElementById('tbody').innerHTML);
  localStorage.setItem('character-list', document.getElementById('character-list').innerHTML);
}

async function submitGuess(event) {
  const formData = new FormData(document.getElementById('form'));
  const input = document.getElementById('character');
  const cryptoBroMode = getSetting('cryptoBro');
  formData.append('cryptoBroMode', cryptoBroMode);
  event.preventDefault();
  const bodyData = new URLSearchParams(formData);

  document.querySelector('option[value="' + input.value + '"]').remove();
  input.value = '';

  const data = await fetch('/htmx/guess', {
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
  // if exist and same day
  if (win && win === new Date().toISOString().slice(0, 10)) {
    const tableHTML = localStorage.getItem('tableHTML');
    document.getElementById('tbody').innerHTML = tableHTML;
    document.getElementById('win-message').classList.add('active');
    return;
  }

  const game = document.getElementById('interactive-game');
  game.classList.add('active');

  const characterList = localStorage.getItem('character-list');
  const tableHTML = localStorage.getItem('tableHTML');

  if (tableHTML) {
    document.getElementById('tbody').innerHTML = tableHTML;
  }

  if (characterList) {
    document.getElementById('character-list').innerHTML = characterList;
  }
}

initGame();
