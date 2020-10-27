import React, { Component } from 'react';
import './scss/StatusBar.css'; 
import ROSLIB from 'roslib';
import Battery from './Widget/Battery';

var ros: ROSLIB.Ros = new ROSLIB.Ros({url : 'ws://localhost:9090'});

const motor_speed_topic = new ROSLIB.Topic({
  ros: ros,
  name: "/motors/speed",
  messageType: "motor_drive/MotorPair_Float"
});

const pos_topic = new ROSLIB.Topic({
  ros: ros,
  name: "/agbot_gps/fix",
  messageType: "sensor_msgs/NavSatFix"
});

//add current to motors as bar display, dial indicator to see danger zone
//30 amp per motor
//change gps to say position relative to base agrobot_gps/navrelposned
//convert from that topic to actual value - mark will send how
//show the gps position accuracy - marc will send
//show tilt and roll of robot figure out from /camera/imu linear_acceleration topic

interface StatusBarState {
  left_speed : number,
  right_speed : number,
  position: {lat: number, lng: number}
}

class StatusBar extends Component<any,StatusBarState> {
  constructor(props: any, state: StatusBarState) {
    super(props,state);
    this.state = {
      left_speed: 0,
      right_speed: 0,
      position: {
        lat: 42.360092,
        lng: -71.094162
      }
    };
    
    pos_topic.subscribe((message:any) => {
      //console.log('Received message on ' + this.state.topic.name + ': ' + message.latitude);
      this.setState({position:{lat:message.latitude, lng:message.longitude}});
    });
    
    motor_speed_topic.subscribe((message:any) => {
      this.setState({left_speed: message.left, right_speed: message.right});
    });
  }

  toDMSLat(convert: number) : string {
    let dir = (Math.abs(convert) == convert)? "N" : "S";
    let lat = Math.abs(convert);
    let d = Math.floor(lat);
    let m = Math.floor((lat - d)*60)
    let s = Math.round((lat - d - m/60) * 3600);
    return d + "° " + m + "' " + s + '" ' + dir;
  }

  toDMSLng(convert: number) : string {
    let dir = (Math.abs(convert) == convert)? "E" : "W";
    let lat = Math.abs(convert);
    let d = Math.floor(lat);
    let m = Math.floor((lat - d)*60)
    let s = Math.round((lat - d - m/60) * 3600);
    return d + "° " + m + "' " + s + '" ' + dir;
  }

  render() {
    return (
      <div className="statusbar">
          <Battery percentage={100}/>
          <div> Average Velocity: {((this.state.right_speed + this.state.left_speed)/2).toFixed(2)} m/s </div>
          <div> Position: {this.toDMSLat(this.state.position.lat)}, {this.toDMSLng(this.state.position.lng)} </div>
      </div>
    )
  }
}

export default StatusBar;