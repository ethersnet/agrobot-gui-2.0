import React, { Component } from 'react';
import '../scss/Stream.css'; 
import ROSLIB from 'roslib';

var ros: ROSLIB.Ros = new ROSLIB.Ros({url : 'ws://localhost:9090'});

const topic = new ROSLIB.Topic({
  ros: ros,
  name: "/camera/color/image_raw",
  messageType: "sensor_msgs/Image"
});

interface StreamState {
  topic: ROSLIB.Topic
  data: string
}

class Stream extends Component<any,StreamState> {
  constructor(props: any, state: StreamState) {
    super(props,state);
    this.state = {
      topic: topic,
      data: ""
    };

    this.state.topic.subscribe((message:any) => {
      //console.log(message);
      this.setState({data:message});
    });

    /*const decoder = new MjpegDecoder(
      'http://localhost:8080/stream_viewer?topic=/camera/color/image_raw', { interval: 3000 }
      );
      
    decoder.on('frame', (frame, seq) => {
      console.log(seq);
      fs.writeFileSync(`${seq}.jpg`, frame);
    });
      
    decoder.start();*/
  }
  

  render() {
    return (
      <div className="stream">
        <img src = "http://localhost:8080/stream?topic=/camera/color/image_raw"/>
      </div>
    )
  }
}

export default Stream;