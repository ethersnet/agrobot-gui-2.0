import React, { Component } from 'react';
import './scss/MapBar.css'; 
import { connect } from 'react-redux';
import { changeAddRegion, changeDensity } from './store/actionCreators';
import { ReduxState } from './store/types';
import Slider from '@material-ui/core/Slider';
import { Button, FormControlLabel, Switch, Grid, Input, withStyles, createStyles, Typography } from '@material-ui/core';
import ROSLIB from 'roslib';

var ros: ROSLIB.Ros = new ROSLIB.Ros({url : 'ws://localhost:9090'});


interface MapBarState {
  left_speed : number,
  right_speed : number,
  position: {lat: number, lng: number}
}

const waypointsParam = new ROSLIB.Param({
  ros: ros,
  name: "/rosapi/gps-waypoints"
});

const styles = createStyles({
  root: {
    color: 'black',
  },
  slider: {
    width: 200,
    color: "black"
  },
  input: {
    width: 50
  },
  sendWaypoints: {
    backgroundColor: "black"
  }
});

const BlackSwitch = withStyles({
  switchBase: {
    '&$checked': {
      color: "black",
    },
    '&$checked + $track': {
      backgroundColor: "black",
    },
  },
  checked: {},
  track: {},
})(Switch);

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

  sendWaypoints() {
    let waypointsList : any = []
    for (let i = 0; i < this.props.regions.length; i++) {
      waypointsList.push(this.props.regions[i].getWaypoints())
    }
    alert(waypointsList);
    waypointsParam.set(waypointsList);
  }

  render() {
    const { classes } = this.props;
    const handleButtonChange = (event: any, newValue: number | number[]) => {
      event.preventDefault();
      this.props.changeDensityFunc(newValue as number);
    };
    const handleSwitchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.changeAddRegionFunc();
    };
    const handleSendWaypoints = () => {
      this.sendWaypoints();
    };

    return (
      <div className="mapbar">
          <FormControlLabel
            control={<BlackSwitch onChange={handleSwitchChange} />}
            label="Edit Regions"
          />
          <div className={classes.root}>
            <Typography gutterBottom>
              Waypoint Density
            </Typography>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs>
                <Slider
                    className={classes.slider}
                    value={this.props.density}
                    onChange={handleButtonChange}
                    aria-labelledby="input-slider"
                    min={.001}
                    max={1}
                    step={.001}
                  />
              </Grid>
              <Grid item>
                <Input
                    className={classes.input}
                    value={this.props.density}
                    margin="dense"
                    inputProps={{
                      step: .001,
                      min: .001,
                      max: 1,
                      type: 'number',
                      'aria-labelledby': 'input-slider',
                    }}
                  />
              </Grid>
            </Grid>
          </div>
          <div>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Button className = {classes.sendWaypoints} color="primary" variant = "contained" onClick={handleSendWaypoints}>Send Waypoints</Button>
              </Grid>
              <Grid item>
                <Button variant = "outlined" onClick={handleSendWaypoints}>Center Map</Button>
              </Grid>
            </Grid>
          </div>
      </div>
      
    )
  }
}

function mapStateToProps(state: ReduxState) {
    return {
        regions: state.regions,
        addRegion: state.addRegion,
        density: state.density
    }
  }
  
  function mapDispatchToProps(dispatch: any) {
    return {
      changeAddRegionFunc: () => dispatch(changeAddRegion()),
      changeDensityFunc: (density: number) => dispatch(changeDensity(density))
    }
  }
  
  export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(MapBar));