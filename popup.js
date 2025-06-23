document.addEventListener('DOMContentLoaded', async () => {
  const inputContainer = document.getElementById('inputContainer');
  const addPairBtn = document.getElementById('addPair');
  const setSessionBtn = document.getElementById('setSession');
  const resetBtn = document.getElementById('resetConfig');
  const clearBtn = document.getElementById('clearFields');

  const createInputRow = (key = '', value = '') => {
    const div = document.createElement('div');
    div.className = 'pair';

    const keyInput = document.createElement('input');
    keyInput.placeholder = 'Key';
    keyInput.value = key;

    const valueInput = document.createElement('input');
    valueInput.placeholder = 'Value';
    valueInput.value = value;

    div.appendChild(keyInput);
    div.appendChild(valueInput);

    inputContainer.appendChild(div);
  };

  addPairBtn.addEventListener('click', () => createInputRow());

  setSessionBtn.addEventListener('click', async () => {
    const pairs = inputContainer.querySelectorAll('.pair');
    const keyValues = {};
    pairs.forEach(pair => {
      const [keyInput, valueInput] = pair.querySelectorAll('input');
      if (keyInput.value && valueInput.value) {
        keyValues[keyInput.value] = valueInput.value;
      }
    });

    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      args: [keyValues],
      func: (config) => {
        for (const key in config) {
          sessionStorage.setItem(key, config[key]);
        }
        alert("✅ sessionStorage updated!");
      }
    });
  });

  resetBtn.addEventListener('click', async () => {
    inputContainer.innerHTML = '';
    const res = await fetch(chrome.runtime.getURL('config.json'));
    const config = await res.json();
    Object.entries(config).forEach(([k, v]) => createInputRow(k, v));
  });

  clearBtn.addEventListener('click', () => {
    inputContainer.innerHTML = '';
  });

  resetBtn.click(); // Load default on open
});
