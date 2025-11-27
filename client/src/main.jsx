import React from "react";
import ReactDOM from "react-dom/client"; // <--- Atenção: É ReactDOM, não ReactDom
import App from "./App.jsx";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const GOOGLE_CLIENT_ID =
  "993746427504-rtq8nj6lni7ass2kaf9tkvsmi2i4qakm.apps.googleusercontent.com";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <App />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
