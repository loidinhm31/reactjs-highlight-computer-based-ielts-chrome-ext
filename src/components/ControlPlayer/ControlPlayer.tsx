import { useEffect } from "react";

// This only use on study4.com
export default function ControlPlayer() {

  useEffect(() => {
    if (window.location.hostname === "study4.com") {
      const messageListener = (message: string) => {
        if (message === "control-player") {
          chrome.storage.local.get("played", (result) => {
            const { played } = result;

            const activeTab = document.querySelectorAll("a[class='nav-link active'][role='tab']")[0];

            const playedNodes = document.querySelectorAll("button[class='plyr__controls__item plyr__control plyr__control--pressed'][data-plyr='play']");

            if (played) {
              if (playedNodes && activeTab) {
                const player: HTMLElement = playedNodes[0] as HTMLElement;
                player.click();
                chrome.storage.local.set({ "played": false });
              }
            } else {
              if (playedNodes.length === 0) {
                const nodes = document.querySelectorAll("button[class='plyr__controls__item plyr__control'][data-plyr='play']");

                if (nodes && activeTab) {
                  const activeText = activeTab.textContent;

                  if (activeText) {
                    const selected = activeText.charAt(activeText.length - 1);

                    const player: HTMLElement = nodes[Number(selected) - 1] as HTMLElement;

                    player.click();
                  }
                }
              } else {
                // Turn off unexpected played audios
                playedNodes.forEach((p) => {
                  (p as HTMLElement).click();
                });
              }
              chrome.storage.local.set({ "played": false });
            }
          });
        }
      };

      // Listen for messages from the background script
      chrome.runtime.onMessage.addListener(messageListener);

      // Clean up the listener when the component unmounts
      return () => {
        chrome.runtime.onMessage.removeListener(messageListener);
      };
    }
  }, [window.location.hostname]);

  return (
    <></>
  );
}