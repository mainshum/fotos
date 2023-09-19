import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./App.css";
import Galery from "./components/galery.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <main>
      <Galery />
    </main>
  </React.StrictMode>
);
