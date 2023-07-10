import React from "react";
import ReactDOM from "react-dom";
import Inject from "./components/Injection/Inject";

chrome.storage.local.get("enabled", (result) => {
  let { enabled } = result;
  const container = document.createElement("highlight-integration");
  document.body.insertAdjacentElement("afterend", container);
  ReactDOM.render(<Inject enabled={enabled} />, container);
});
