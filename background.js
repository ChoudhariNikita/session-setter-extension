chrome.action.onClicked.addListener(async (tab) => {
  const response = await fetch(chrome.runtime.getURL('config.json'));
  const config = await response.json();

  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    args: [config],
    func: (config) => {
      for (const key in config) {
        sessionStorage.setItem(key, config[key]);
      }
      alert('🟢 Session storage keys dynamically set!');
    }
  });
});
