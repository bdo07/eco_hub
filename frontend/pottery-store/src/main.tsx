import { createRoot } from "react-dom/client";
import { setBaseUrl } from "@workspace/api-client-react";
import App from "./App";
import "./index.css";

// Configure API client to point to backend on port 5001
setBaseUrl("http://localhost:5001");

createRoot(document.getElementById("root")!).render(<App />);
