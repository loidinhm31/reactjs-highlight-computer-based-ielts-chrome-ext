import "./Popup.scss";
import React, { useEffect, useState } from "react";

export default function Popup() {
  const [enabled, setEnabled] = useState<boolean>();

  useEffect(() => {
    chrome.storage.local.get("enabled", (result) => {
      let { enabled } = result;
      setEnabled(enabled);
    });
  }, []);

  const handleChangeHighlight = async (val: string) => {
    setEnabled(!enabled);
    await chrome.storage.local.set({ "enabled": !enabled });
    await chrome.tabs.reload();
  };

  return (
    <>
      <div>
        <h3 className="rounded-pill">Practice Highlight For IELTS</h3>
        <div>
          <div className="rounded-pill title">Toggle Extension On/ Off:</div>
          <p>Use Ctrl+Shift+X</p>

          <label className="switch">
            <input type="checkbox"
                   checked={enabled}
                   onChange={(e) => handleChangeHighlight(e.target.value)} />
            <span className="slider round"></span>
          </label>

          <p>Current State: {enabled ? "On" : "Off"}</p>
        </div>

        <div>
          <div className="rounded-pill title">Control Player On/ Off:</div>
          <p>Use Ctrl+Shift+Space</p>
        </div>
      </div>
    </>
  );
}