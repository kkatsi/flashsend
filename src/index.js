import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./components/App";
import reportWebVitals from "./reportWebVitals";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { FirestoreBeforeLoginProvider } from "./contexts/FirestoreBeforeLoginContext";

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <FirestoreBeforeLoginProvider>
          <App />
        </FirestoreBeforeLoginProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
