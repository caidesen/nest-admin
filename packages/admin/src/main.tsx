import { createRoot } from "react-dom/client";
import "./index.css";
import "antd/dist/reset.css";
import App from "./App";

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
