function openSettings() {
  document.getElementById('page').classList.add('blur');
  document.getElementById('settings-modal').classList.add('open');
}

function closeSettings() {
  document.getElementById('page').classList.remove('blur');
  document.getElementById('settings-modal').classList.remove('open');
}

function openSpoilPopup() {
  document.getElementById('page').classList.add('blur');
  document.getElementById('manga-anime-modal').classList.add('open');
}

function closeSpoilPopup() {
  document.getElementById('page').classList.remove('blur');
  document.getElementById('manga-anime-modal').classList.remove('open');
}

function initSettings() {
  const settings = document.getElementsByClassName('settings-box');
  for (let i = 0; i < settings.length; i++) {
    const id = settings[i].id;
    const value = getSetting(id);
    if (value) {
      settings[i].checked = value === 'true';
    }
  }
  if (getSetting('anime-mode') === null) {
    openSpoilPopup();
  }
}

function getSetting(id) {
  return localStorage.getItem(id);
}

function setSetting(checkbox) {
  const isCheck = checkbox.checked;
  const id = checkbox.id;
  localStorage.setItem(id, isCheck);
  if (id === 'anime-mode') {
    localStorage.removeItem('tableHTML');
    localStorage.removeItem('character-list');
    localStorage.removeItem('tableHTMLDate');
    location.reload();
  }
}

function clearSettings() {
  localStorage.clear();
  const toast = document.getElementById('local-clear');
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 3000);
}

function setVersion(type) {
  localStorage.removeItem('tableHTML');
  localStorage.removeItem('tableHTMLDate');
  localStorage.removeItem('character-list');
  if (type === 'anime') {
    localStorage.setItem('anime-mode', 'true');
    setAnimeCharList();
    document.getElementById('anime-mode').checked = true;
  } else if (type === 'manga') {
    localStorage.setItem('anime-mode', 'false');
    document.getElementById('anime-mode').checked = false;
  }
  closeSpoilPopup();
}

initSettings();
