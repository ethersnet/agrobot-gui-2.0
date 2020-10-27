import React from 'react';
import './App.css';
import Stream from './Widget/Stream';
import StatusBar from './StatusBar';
import MapContainer from './Widget/MapContainer';
import MapBar from './MapBar';
import GoogleMaps from './Widget/Map';
import MapWrapper from './Widget/MapWrapper';


function App() {
  return (
    <div className="App">
      <MapWrapper />
      <MapBar />
    </div>
  );
}

export default App;
