import * as actionTypes from "./actionTypes"

const initialState: ReduxState = {
  addRegion: false,
  map: null
}


const reducer = (
    state: ReduxState = initialState,
    action: ReduxAction
  ): ReduxState => {
    switch (action.type) {
      case actionTypes.CHANGE_ADD_REGION:
        return {
          ...state,
          addRegion: !state.addRegion,
        }
    }
    switch (action.type) {
      case actionTypes.SET_MAP_REF:
        console.log("in redicer")
        console.log(action.payload);
        return {
          ...state,
          map: action.payload,
        }
    }
    return state
  }
  
  export default reducer