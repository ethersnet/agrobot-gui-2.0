import 'battery-indicator-element';
import React, { DetailedHTMLProps, HTMLAttributes, Component } from 'react';
import ROSLIB from 'roslib';
import '../scss/Battery.css'; 


interface BatteryIndicatorProps
	extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
	percentage: number;
}

interface BatteryState {
  left_current: number,
  right_current: number,
  percentage: number
}

declare global {
	namespace JSX {
		interface IntrinsicElements {
			'battery-indicator': BatteryIndicatorProps;
		}
	}
}

var ros: ROSLIB.Ros = new ROSLIB.Ros({url : 'ws://localhost:9090'});

const motor_current_topic = new ROSLIB.Topic({
  ros: ros,
  name: "/motors/current",
  messageType: "motor_drive/MotorPair_Float"
});

const voltage_topic = new ROSLIB.Topic({
  ros: ros,
  name: "/battery/voltage",
  messageType: "motor_drive/Stamped_Float"
});

class Battery extends Component<BatteryIndicatorProps,BatteryState> {
    constructor(props: BatteryIndicatorProps, state: BatteryState) {
      super(props,state);
      this.state = {
        left_current: 0,
        right_current: 0,
        percentage: 100
      };
      /*motor_current_topic.subscribe((message:any) => {
        this.setState({left_current: message.left,
                      right_current: message.right,
                      percentage: Math.round((1500 - message.left - message.right)/1500*100)});
      });*/

      let results: any[] = [];
 
      /*let readStream = fs.createReadStream('data.csv');/*
        .pipe(csv());/*
        .on('data', (data) => {results.push(data)})
        .on('end', () => {
          console.log(results);
        });*/

      voltage_topic.subscribe((message:any) => {
        this.setState({percentage: Math.round(this.getCurrent(message.data/5)/1500*100)});
      });
    }

    getCurrent(voltage: number) : number {

      return 0;
    }
  
    render() {
      return (
        <div className="battery">
            <battery-indicator percentage={this.state.percentage}></battery-indicator> {this.state.percentage}%
        </div>
      )
    }
  }

export default Battery;