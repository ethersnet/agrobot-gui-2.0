import React, { Component } from 'react';
import { GoogleApiWrapper, InfoWindow, Map} from 'google-maps-react';
import {Marker, Polygon, Polyline} from '@react-google-maps/api';
import ROSLIB from 'roslib';
import '../scss/Map.css'; 
import { connect } from 'react-redux';

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
  regions: any[] | [],
  newRegion: {lat:number; lng:number}[] | []
}

class MapContainer extends Component<any,MapState> {
  constructor(props: any, state: MapState) {
    super(props,state);
    this.state = {
      center: {
        lat: 42.360092,
        lng: -71.094162
      },
      regions: [],
      newRegion: []
    };
    
    topic.subscribe((message:any) => {
      //console.log('Received message on ' + this.state.topic.name + ': ' + message.latitude);
      this.setState({center:{lat:message.latitude, lng:message.longitude}});
    });
    
  }

  onMapClick(t: any, map: any, coord: { latLng: any; }) {
    const { latLng } = coord;
    const lat : number= latLng.lat();
    const lng : number = latLng.lng();

    if (this.props.addRegion) {
      let newPoint = { lat, lng }
      this.setState({
        newRegion: [...this.state.newRegion, newPoint]
      });
    } else if (this.state.newRegion) {
      let polygon = new this.props.google.maps.Polygon(
        {
          path: this.state.newRegion,
          fillColor: "#D43AAC",
          strokeColor: "#EB807E",
          fillOpacity: 0.2,
          strokeWeight: 5,
          editable: true,
          clickable: true,
        }
      );
      this.setState({regions: [
          ...this.state.regions,
          polygon
        ],
        newRegion: []
      });
    }
  }

  createPolygon(path: any) {
    const polygon = this.props.google.maps.Polygon({
      path: path,
      fillColor: "#D43AAC",
      strokeColor: "#EB807E",
      fillOpacity: 0.2,
      strokeWeight: 5,
      editable: true,
      clickable: true,
    });

    return polygon;
  };

  onPolygonComplete(polygon: any, polyIndex: number) {
    var pathArray = [polygon.latLng.lat(), polygon.latLng.lng()];
    console.log(polygon.vertex);
    console.log(polygon.edge);
    console.log(pathArray);

    if (polyIndex == -1) {
      if (polygon.vertex) {

      } else {
        
      }
    }
    let newPoly = this.createPolygon(polygon.paths);
    console.log(newPoly.key)
  };

  render() {
    return (
      <div className = "map" >
        <Map
          google={this.props.google}
          initialCenter={this.state.center}
          onClick={this.onMapClick.bind(this)}>
          
            
            <Marker 
              title={"Agrobot"}
              position={this.state.center} />

            <Polygon
              key={-1}
              paths={this.state.newRegion}
              editable={true}
              onMouseUp={(e) => {this.onPolygonComplete(e, -1)}}
            />
            {(this.state.regions as any[]).map((region: any, index: number) => (
              <Polygon
                key={index}
                paths={region.latLngs.i[0].i}
                editable={region.editable}
                onMouseUp={(e) => {this.onPolygonComplete(e, index)}}
              />
            ))}

        </Map>
      </div>
    );
  }
}

function mapStateToProps(state: ReduxState) {
  return {
      addRegion: state.addRegion
  }
}

function mapDispatchToProps(dispatch: any) {
  return {
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(GoogleApiWrapper({
  apiKey: ("AIzaSyBXLWtitszgxow6ixws-ZbV7TDrsErfCv8")
})(MapContainer));