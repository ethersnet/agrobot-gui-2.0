import React, { Component } from 'react';
import './App.css';
import Stream from './Widget/Stream';
import StatusBar from './StatusBar';
import MapBar from './MapBar';
import MapWrapper from './Widget/MapWrapper';
import ReactSpeedometer from 'react-d3-speedometer';
import ROSLIB from 'roslib';
var ros: ROSLIB.Ros = new ROSLIB.Ros({url : 'ws://localhost:9090'});

const motor_current_topic = new ROSLIB.Topic({
  ros: ros,
  name: "/motors/current",
  messageType: "motor_drive/MotorPair_Float"
});

interface AppState {
  left_motor_current: number,
  right_motor_current: number,
}

class App extends Component<any,AppState> {
  constructor(props: any, state: AppState) {
    super(props,state);
    this.state = {
      left_motor_current: 0,
      right_motor_current: 0,
    };

    motor_current_topic.subscribe((message:any) => {
      this.setState({left_motor_current: message.left, right_motor_current: message.right});
    });

  }

    render() {
    return (
      <div className="App">
        <StatusBar />
        <MapWrapper />
        <MapBar />
        <div className = "bareWidgets">
          <div className = "motorCurrent">
            <div className = "left">
              <ReactSpeedometer
                      maxValue = {30}
                      value = {this.state.left_motor_current}
                      currentValueText = {"Left: " + this.state.left_motor_current.toPrecision(4) + "A"}
                      fluidWidth={true}
                      textColor = "white"
                      startColor="green"
                      endColor="red"
                      segments={5555}
                      maxSegmentLabels={2}
                      />
            </div>
            <div className = "right">
              <ReactSpeedometer
                      maxValue = {30}
                      value = {this.state.right_motor_current}
                      currentValueText = {"Right: " + this.state.right_motor_current.toPrecision(4) + "A"}
                      fluidWidth={true}
                      textColor = "white"
                      startColor="green"
                      endColor="red"
                      segments={5555}
                      maxSegmentLabels={2}
                      />
            </div>
          </div>
          <Stream />
        </div>
      </div>
    );
  }
}

export default App;
