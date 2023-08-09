function openSettings() {
  document.getElementById('page').classList.add('blur');
  document.getElementById('settings-modal').classList.add('open');
}

function closeSettings() {
  document.getElementById('page').classList.remove('blur');
  document.getElementById('settings-modal').classList.remove('open');
}

function initSettings() {
  console.log('initSettings');
  const settings = document.getElementsByClassName('settings-box');
  for (let i = 0; i < settings.length; i++) {
    const id = settings[i].id;
    const value = getSetting(id);
    if (value) {
      settings[i].checked = value === 'true';
    }
  }
}

function getSetting(id) {
  return localStorage.getItem(id);
}

function setSetting(checkbox) {
  const isCheck = checkbox.checked;
  const id = checkbox.id;
  localStorage.setItem(id, isCheck);
}

function clearSettings() {
  localStorage.clear();
  const toast = document.getElementById('local-clear');
  toast.classList.add('show');
  setTimeout(function () {
    toast.classList.remove('show');
  }, 3000);
}

initSettings();
