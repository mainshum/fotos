import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Galery from "./components/galery.tsx";

import { QueryClient, QueryClientProvider } from "react-query";
import Photo from "./components/photo.tsx";
import { Router } from "./lib/router.ts";

const client = new QueryClient();

function App() {
  const route = Router.useRoute(["Home", "Photo"]);

  return (
    <QueryClientProvider client={client}>
      <main className="container">
        {/* greatly simplfied - all links that do not point to a specific foto are mapped to galery */}
        {route?.name === "Photo" ? (
          <Photo photoId={route.params.photoId} />
        ) : (
          <Galery />
        )}
      </main>
    </QueryClientProvider>
  );
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
