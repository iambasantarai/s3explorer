import { useState, useEffect } from "react";

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
      <div className="background mx-auto max-w-sm">
        <h1 className="font-semibold text-lg">s3explorer</h1>
        <div className="card">
          <p className="text-xs uppercase">
            Server heartbeat: <code className="text-xs">{heartbeat}</code>
          </p>
        </div>
      </div>
    </>
  );
}

export default App;
