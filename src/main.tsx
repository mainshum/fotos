import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Galery from "./components/galery.tsx";

import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={client}>
      <main className="container">
        <Galery />
      </main>
    </QueryClientProvider>
  </React.StrictMode>
);
