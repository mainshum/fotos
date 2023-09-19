import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Galery from "./components/galery.tsx";

import { QueryClient, QueryClientProvider } from "react-query";

const client = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={client}>
      {/* <nav>
        <header>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            Fotos
          </h1>
        </header>
      </nav> */}
      <main className="container">
        <Galery />
      </main>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
