export {};

chrome.commands.onCommand.addListener(function(command) {
  if (command === "toggle-extension") {
    chrome.storage.local.get("enabled", (result) => {
      let { enabled } = result;

      if (enabled) {
        chrome.storage.local.set({ "enabled": false });
      } else {
        chrome.storage.local.set({ "enabled": true });
      }
      chrome.tabs.reload();
    });
  }

  chrome.tabs.query({ active: true, lastFocusedWindow: true }, tabs => {
    let url = tabs[0].url;

    if (url?.startsWith("https://study4.com")) {
      if (command === "control-player") {
        // Send message to the content script
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id!, "control-player");
        });
      }
    }
  });

});