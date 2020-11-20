import * as actionTypes from "./actionTypes"
import { ReduxState, ReduxAction } from "./types"
import { deleteRegion } from "./actionCreators"

const initialState: ReduxState = {
  map: null,
  robot: null,
  density: .01,
  regions: [],
  addRegion: false
}


function reducer(state: ReduxState | undefined, action: ReduxAction) : ReduxState {
    if (state === undefined) {
        return initialState;
    }
    switch (action.type) {
      case actionTypes.SET_MAP_REF: {
        return {
          ...state,
          map: action.payload
        }
      }
      case actionTypes.SET_ROBOT_REF: {
        return {
          ...state,
          robot: action.payload
        }
      }
      case actionTypes.ADD_REGION: {
        google.maps.event.addListener(action.payload.region, 'click', () => {
          action.payload.delete();
          deleteRegion(state.regions.indexOf(action.payload));
        });
        return {
          ...state,
          regions: [...state.regions, action.payload]
        }
      }
      case actionTypes.DELETE_REGION: {
        let newRegions = [...state.regions];
        newRegions.splice(action.payload);
        return {
          ...state,
            regions: newRegions
          }
        }
        case actionTypes.CHANGE_DENSITY: {
          for (let i = 0; i < state.regions.length; i++) {
            state.regions[i].changeDensity(action.payload);
          }
          return {
            ...state,
            density: action.payload
          }
        }
        case actionTypes.CHANGE_ADD_REGION: {
          return {
            ...state,
            addRegion: !state.addRegion
          }
        }
        default:
          return state

    }
  }
  
  export default reducer