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

const rel_pos_topic = new ROSLIB.Topic({
  ros: ros,
  name: "/agbot_gps/navrelposned",
  messageType: "ublox_msgs/NavRELPOSNED9"
});

const imu_topic = new ROSLIB.Topic({
  ros: ros,
  name: "/camera/imu",
  messageType: "sensor_msgs/Imu"
});

//show tilt and roll of robot figure out from /camera/imu linear_acceleration topic

interface StatusBarState {
  left_speed : number,
  right_speed : number,
  left_motor_current: number,
  right_motor_current: number,
  position: {lat: number, lng: number},
  rel_position: {x: number, y: number, z: number},
  rel_pos_accuracy: {x: number, y: number, z: number},
  pitch: number,
  roll: number
}

class StatusBar extends Component<any,StatusBarState> {
  constructor(props: any, state: StatusBarState) {
    super(props,state);
    this.state = {
      left_speed: 0,
      right_speed: 0,
      left_motor_current: 0,
      right_motor_current: 0,
      position: {
        lat: 42.360092,
        lng: -71.094162
      },
      rel_position: {
        x: 0,
        y: 0,
        z: 0
      },
      rel_pos_accuracy: {
        x: 0,
        y: 0,
        z: 0
      },
      pitch: 0,
      roll: 0
    };
    
    pos_topic.subscribe((message:any) => {
      //console.log('Received message on ' + this.state.topic.name + ': ' + message.latitude);
      this.setState({position:{lat:message.latitude, lng:message.longitude}});
    });
    
    motor_speed_topic.subscribe((message:any) => {
      this.setState({left_speed: message.left, right_speed: message.right});
    });

    imu_topic.subscribe((message:any) => {
      let x = message.linear_acceleration.x;
      let y = message.linear_acceleration.y;
      let z = message.linear_acceleration.z;
      let pitch = Math.atan(x/Math.sqrt(y*y + z*z))* (180.0/Math.PI);
      let roll = Math.atan(y/Math.sqrt(x*x + z*z))* (180.0/Math.PI);
      this.setState({pitch: pitch, roll: roll});
    });

    rel_pos_topic.subscribe((message:any) => {
      let north = message.relPosN*0.01+message.relPosHPN*0.0001;
      let east = message.relPosE*0.01+message.relPosHPE*0.0001;
      let down = message.relPosD*0.01+message.relPosHPD*0.0001;

      let north_acc = message.accN*0.0001;
      let east_acc = message.accE*0.0001;
      let down_acc = message.accD*0.0001;

      this.setState({rel_pos_accuracy: {x: north_acc, y: east_acc, z:down_acc}, rel_position:{x: north, y: east, z:-down}});
    });
  }

  toDMSLat(convert: number) : string {
    let dir = (Math.abs(convert) === convert)? "N" : "S";
    let lat = Math.abs(convert);
    let d = Math.floor(lat);
    let m = Math.floor((lat - d)*60)
    let s = Math.round((lat - d - m/60) * 3600);
    return d + "° " + m + "' " + s + '" ' + dir;
  }

  toDMSLng(convert: number) : string {
    let dir = (Math.abs(convert) === convert)? "E" : "W";
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
          <div> Average Velocity: <span className="negSign">{((this.state.right_speed + this.state.left_speed)/2).toFixed(2)} m/s</span> </div>
          <div> Pitch: <span className="negSign">{this.state.pitch.toFixed(2)}°</span></div>
          <div> Roll: <span className="negSign">{this.state.roll.toFixed(2)}°</span></div>
          <div> Coordinates: {this.toDMSLat(this.state.position.lat)}, {this.toDMSLng(this.state.position.lng)} </div>
          <div> (x, y, z): {this.state.rel_position.x.toFixed(2)}, {this.state.rel_position.y.toFixed(2)}, {this.state.rel_position.z.toFixed(2)} </div>
          <div> Accuracy: {this.state.rel_pos_accuracy.x.toFixed(2)}, {this.state.rel_pos_accuracy.y.toFixed(2)}, {this.state.rel_pos_accuracy.z.toFixed(2)} </div>
      </div>
    )
  }
}

export default StatusBar;