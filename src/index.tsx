import React from "react";
import ReactDOM from "react-dom";
import App from "./App";

const container = document.createElement("highlight-integration");
document.body.insertAdjacentElement("afterend", container);

ReactDOM.render(<App />, container);
