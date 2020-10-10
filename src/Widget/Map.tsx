import React, { Component } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import ROSLIB from 'roslib';
import '../scss/Map.css'; 

var ros: ROSLIB.Ros = new ROSLIB.Ros({url : 'ws://localhost:9090'});

const param = new ROSLIB.Param({
  ros: ros,
  name: "/rosapi/gps-waypoints"
});

const topic = new ROSLIB.Topic({
  ros: ros,
  name: "/agbot_gps/fix",
  messageType: "sensor_msgs/NavSatFix"
});

const topic_clients = new ROSLIB.Topic({
  ros: ros,
  name: "/client_count",
  messageType: "std_msgs/Int32"
});

const containerStyle = {
  width: '100vw',
  height: '100vh'
};

interface MapState {
  center: {lat:number; lng:number},
  topic: ROSLIB.Topic
}

class Map extends Component<any,MapState> {
  constructor(props: any, state: MapState) {
    super(props,state);
    this.state = {
      center: {
        lat: 42.360092,
        lng: -71.094162
      },
      topic: topic
    };
    
    this.state.topic.subscribe((message:any) => {
      //console.log('Received message on ' + this.state.topic.name + ': ' + message.latitude);
      this.setState({center:{lat:message.latitude, lng:message.longitude}});
    });
  }

  /*componentDidMount() {
    let data:any;
    console.log("in mount: " + this.state.topic);
    this.state.topic.subscribe(function(message:any) {
      console.log('Received message on ' + topic.name + ': ' + message.data);
      data = message.data
    });
    this.setState({center:data});
  }*/

  render() {
    return (
      <div className="map">
        <LoadScript
          googleMapsApiKey="AIzaSyBXLWtitszgxow6ixws-ZbV7TDrsErfCv8"
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={this.state.center}
            zoom={15}
          >
            { /* Child components, such as markers, info windows, etc. */ }
            <></>
            <Marker
              /*onLoad={}*/
              position={this.state.center}
            />
          </GoogleMap>
        </LoadScript>
      </div>
    )
  }
}

export default Map;