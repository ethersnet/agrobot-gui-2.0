import React from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Widget/Map';
import Stream from './Widget/Stream';

function App() {
  return (
    <div className="App">
      <Map />
      <Stream/>
    </div>
  );
}

export default App;
