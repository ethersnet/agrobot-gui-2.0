  
  type ReduxState = {
    addRegion: bool,
    map: any
  }
  
  type ReduxAction = {
    type: string,
    payload: any
  }
  
  type DispatchType = (args: ReduxAction) => ReduxAction