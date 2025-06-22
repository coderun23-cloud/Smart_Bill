import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import AppProvider from "./pages/context/AppContext.jsx";
import { StrictMode } from "react";

createRoot(document.getElementById("root")).render(
  <AppProvider>
    <StrictMode>
      {" "}
      <App />
    </StrictMode>
  </AppProvider>
);
