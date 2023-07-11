import "./Popup.scss";
import React, { useEffect, useState } from "react";

export default function Popup() {
  const [enabled, setEnabled] = useState();

  useEffect(() => {
    chrome.storage.local.get("enabled", (result) => {
      let { enabled } = result;
      setEnabled(enabled);
    });
  },[]);

  return(
    <>
      <div>
        <h3 className="rounded-pill">Practice Highlight For IELTS</h3>
        <div>
          <div className="rounded-pill title">Toggle Extension On/ Off:</div>
          <p>Use Ctrl+Shift+X</p>
          <p>Current State: {enabled ? "On" : "Off"}</p>
        </div>

        <div>
          <div className="rounded-pill title">Control Player On/ Off:</div>
          <p>Use Ctrl+Shift+Space</p>
        </div>
      </div>
    </>
  )
}