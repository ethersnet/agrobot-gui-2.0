import React, { Component } from 'react';
import './scss/StatusBar.css'; 
import { connect } from 'react-redux';
import { changeAddRegion } from './store/actionCreators';

interface MapBarState {
  left_speed : number,
  right_speed : number,
  position: {lat: number, lng: number}
}

class MapBar extends Component<any,MapBarState> {
  constructor(props: any, state: MapBarState) {
    super(props,state);
    this.state = {
      left_speed: 0,
      right_speed: 0,
      position: {
        lat: 42.360092,
        lng: -71.094162
      }
    };
    
  }


  render() {
    return (
      <div className="mapbar">
        <button onClick = {this.props.addRegionFunc} >{(this.props.addRegion)? "End Region!" : "Add Region!"}</button>
      </div>
    )
  }
}

function mapStateToProps(state: ReduxState) {
    return {
        addRegion: state.addRegion
    }
  }
  
  function mapDispatchToProps(dispatch: any) {
    return {
      addRegionFunc: () => dispatch(changeAddRegion())
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(MapBar);