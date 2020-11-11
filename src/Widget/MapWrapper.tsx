import React, { Component } from 'react';
import ROSLIB from 'roslib';
import '../scss/Map.css'; 
import { connect } from 'react-redux';
import GoogleMaps from './Map'
import { addRegion } from '../store/actionCreators';
import { ReduxState } from '../store/types';

var ros: ROSLIB.Ros = new ROSLIB.Ros({url : 'ws://localhost:9090'});

const topic = new ROSLIB.Topic({
  ros: ros,
  name: "/agbot_gps/fix",
  messageType: "sensor_msgs/NavSatFix"
});

interface MapState {
  center: {lat:number; lng:number},
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
      this.props.addRegionFunc(this.props.map, this.state.newRegion?.getPath(), this.props.density);

      if (this.state.newRegion) {this.state.newRegion.setMap(null); }
      this.setState({newRegion: undefined});
      marker.setMap(null);
    });
  }

  
  render() {
    if (this.props.map && this.props.robot) {
        this.props.robot.setPosition(this.state.center);
        this.props.map.setCenter(this.state.center);
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
      map: state.map,
      density: state.density,
      regions: state.regions,
      robot: state.robot
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
    addRegionFunc: (path: any, map: any, density: number) => dispatch(addRegion(path, map, density))
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(MapWrapper);