export {};

let extensionEnabled = true;

chrome.commands.onCommand.addListener(function(command) {
  if (command === "toggle-extension") {
    extensionEnabled = !extensionEnabled;

    chrome.storage.local.set({ "enabled": extensionEnabled });
    chrome.tabs.reload();
  }
});
