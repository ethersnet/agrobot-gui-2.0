import * as actionTypes from "./actionTypes"
import { ReduxAction, Region } from "./types"




export function changeAddRegion() {
  const action: ReduxAction = {
    type: actionTypes.CHANGE_ADD_REGION,
    payload: null
  }

  return action
}

export function setMapRef(map:any) {
  const action: ReduxAction = {
    type: actionTypes.SET_MAP_REF,
    payload: map
  }

  return action
}

export function setRobotRef(robot:any) {
  const action: ReduxAction = {
    type: actionTypes.SET_ROBOT_REF,
    payload: robot
  }

  return action
}

export function addRegion(map:any, path:any, density:number) {
  const action: ReduxAction = {
    type: actionTypes.ADD_REGION,
    payload: new Region(path, map, density)
  }

  return action
}

export function deleteRegion(index: number) {
  const action: ReduxAction = {
    type: actionTypes.DELETE_REGION,
    payload: index
  }

  return action
}

export function changeDensity(density: number) {
  const action: ReduxAction = {
    type: actionTypes.CHANGE_DENSITY,
    payload: density
  }

  return action
}