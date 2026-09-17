import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "@fontsource/space-grotesk/400.css";
import "@fontsource/space-grotesk/500.css";
import "@fontsource/space-grotesk/600.css";
import "@fontsource/space-grotesk/700.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "@fontsource/dm-sans/600.css";
import "./index.css";

const host = window.location.hostname;
const isPreview = host.includes("id-preview") || host.includes("lovableproject.com") || host === "localhost" || host === "127.0.0.1";
if ("serviceWorker" in navigator && !isPreview) {
  window.addEventListener("load", () => { navigator.serviceWorker.register("/sw.js").catch(() => {}); });
}

createRoot(document.getElementById("root")!).render(<App />);
