import { useState, useEffect } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [heartbeat, setHeartbeat] = useState(null);

  useEffect(() => {
    fetch("api/heartbeat")
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        setHeartbeat(response.heartbeat);
      })
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>s3explorer</h1>
      <div className="card">
        <p>
          Server heartbeat: <code>{heartbeat}</code>
        </p>
      </div>
    </>
  );
}

export default App;
