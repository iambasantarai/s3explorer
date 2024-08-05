import logo from './logo.svg';
import './App.css';
import { useState, useEffect } from 'react';

function App() {
  const [heartbeat, setHeartbeat] = useState(null);
  useEffect(() => {
    fetch('/heartbeat')
        .then((response) => response.json())
        .then((response) => { 
                setHeartbeat(response.heartbeat);
            });
  },[]);
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h3 className='App-title'>s3explorer</h3>
        <p>
        API Heartbeat: {heartbeat}
        </p>
      </header>
    </div>
  );
}

export default App;
