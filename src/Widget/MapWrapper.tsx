import React, { Component } from 'react';
import ROSLIB from 'roslib';
import '../scss/Map.css'; 
import { connect } from 'react-redux';
import GoogleMaps from './Map'
import { Polyline } from '@react-google-maps/api';

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

interface MapState {
  center: {lat:number; lng:number},
  regions: google.maps.Polygon[],
  newRegion: google.maps.Polyline | undefined
}

class MapWrapper extends Component<any,MapState> {
  constructor(props: any, state: MapState) {
    super(props,state);
    this.state = {
      center: {
        lat: 42.360092,
        lng: -71.094162
      },
      regions: [],
      newRegion: undefined
    };
    
    topic.subscribe((message:any) => {
      //console.log('Received message on ' + this.state.topic.name + ': ' + message.latitude);
      this.setState({center:{lat:message.latitude, lng:message.longitude}});
    });    
  }

  closeRegion (point : google.maps.LatLng) {
    var marker = new google.maps.Marker({ map: this.props.map, position: point });
    google.maps.event.addListenerOnce(marker, 'click', () => {
        let polygon = new window.google.maps.Polygon(
        {
            map: this.props.map,
            paths: this.state.newRegion?.getPath(),
            fillColor: "#D43AAC",
            strokeColor: "#EB807E",
            fillOpacity: 0.2,
            strokeWeight: 5,
            editable: true,
            clickable: true,
        }
        );
        if (this.state.newRegion) {this.state.newRegion.setMap(null); }

        this.setState({regions: [
            ...this.state.regions,
            polygon
        ],
        newRegion: undefined
        });

        google.maps.event.addListener(polygon, 'click', function () {
            polygon.setMap(null);
        });
        marker.setMap(null);
    });
}
  
  render() {
    if (this.props.map) {
        this.props.map.addListener("click", (e : any) => {
            if (this.props.addRegion) {
                let newPoint = e.latLng;
                if (this.state.newRegion == undefined) {

                    let polyline = new google.maps.Polyline({
                        map: this.props.map,
                        path: [newPoint],
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    this.setState({
                        newRegion: polyline
                    });

                    this.closeRegion(newPoint);
                    
                } else {
                    this.state.newRegion.getPath().push(newPoint);
                }
            } 
        });
    }

    return (
      <div className = "map" >
        <GoogleMaps />
      </div>
    );
  }
}

function mapStateToProps(state: ReduxState) {
  return {
      addRegion: state.addRegion,
      map: state.map
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MapWrapper);