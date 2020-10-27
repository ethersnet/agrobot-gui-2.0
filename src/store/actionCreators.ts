import * as actionTypes from "./actionTypes"

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