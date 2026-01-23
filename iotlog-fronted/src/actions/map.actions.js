import TrackingService from "../services/TrackingService";
import {
  SET_MAP_SHOW_CODE,
  SET_MAP_SHOW_NAME,
  SET_MAP_SHOW_NAME_FENCE,
  SET_MAP_TECH,
  SET_MAP_ROUTER,
  SET_ROUTER_IS_LOADING,
  SET_MAP_THEME,
  SET_FILTER_ROUTER,
  SET_IS_SHOW_POINTS,
  SET_IS_SHOW_SEQUENCE_POINTS,
  SET_IS_SHOW_PREDICTION_ROUTE,
  SET_TIME_PLAYBACK,
  SET_PLAY_PAUSE_PLAYBACK,
  SET_SPEED_PLAYBACK,
  SET_IS_REGION_PLAYBACK,
  SET_STOP_PLAYBACK,
  SET_IS_COLOR_STATUS_FLEET,
  SET_SHOW_AIS,
  SET_PORT_FILTER_ACTIVITY,
  SET_IS_NAVIGATION,
  SET_IS_OPERATION,
  SET_OPERATION_MACHINES,
  SET_IS_SHOW_WEATHER_ROUTE,
  SET_IS_SHOW_DIRECTION_ROUTE,
  SET_IS_SHOW_ROUTE,
  SET_IS_SHOW_MESAURE_LINE,
  SET_POINTS_MEASURE_LINE,
  SET_UNIT_MEASURE_LINE,
  SET_FORCE_UPDATE
} from "./actionsTypes";

let playbackRef = null

export const setShowCode = (showCode) => async (dispatch) => {
  dispatch({
    type: SET_MAP_SHOW_CODE,
    payload: {
      showCode,
    },
  });
};

export const setShowName = (showName) => async (dispatch) => {
  dispatch({
    type: SET_MAP_SHOW_NAME,
    payload: {
      showName,
    },
  });
};

export const setMapTech = (mapTech) => async (dispatch) => {
  dispatch({
    type: SET_MAP_TECH,
    payload: {
      mapTech,
    },
  });
};

export const setShowNameFence = (showNameFence) => async (dispatch) => {
  dispatch({
    type: SET_MAP_SHOW_NAME_FENCE,
    payload: {
      showNameFence,
    },
  });
};

export const setMapRouter = (router) => async (dispatch) => {
  dispatch({
    type: SET_MAP_ROUTER,
    payload: {
      router,
    },
  });
};

export const setRouterIsLoading = (isLoading) => async (dispatch) => {
  dispatch({
    type: SET_ROUTER_IS_LOADING,
    payload: {
      isLoading,
    },
  });
};

export const setMapTheme = (mapTheme) => async (dispatch) => {
  dispatch({
    type: SET_MAP_THEME,
    payload: {
      mapTheme,
    },
  });
  TrackingService.saveTracking({
    pathname: window.location.pathname,
    action: "SHOW_MAP_THEME",
    actionData: {
      mapTheme
    }
  });
};

export const setFilterMapRouter = (filterRouter) => async (dispatch) => {
  dispatch({
    type: SET_FILTER_ROUTER,
    payload: {
      filterRouter,
    },
  });
};

export const setIsShowPoints = (isShowPoints) => async (dispatch) => {
  dispatch({
    type: SET_IS_SHOW_POINTS,
    payload: {
      isShowPoints,
    },
  });
};

export const setIsShowSequencePoints = (isShowSequencePoints) => async (dispatch) => {
  dispatch({
    type: SET_IS_SHOW_SEQUENCE_POINTS,
    payload: {
      isShowSequencePoints,
    },
  });
};

export const setIsShowPreditionRoute = (isShowPredicitonRoute) => async (dispatch) => {
  dispatch({
    type: SET_IS_SHOW_PREDICTION_ROUTE,
    payload: {
      isShowPredicitonRoute,
    },
  });
};

export const setTimePlayback = (timePlayback) => async (dispatch) => {
  dispatch({
    type: SET_TIME_PLAYBACK,
    payload: {
      time: timePlayback,
    },
  });
};

export const setStartPlayback = () => async (dispatch, getState) => {
  dispatch({
    type: SET_PLAY_PAUSE_PLAYBACK,
    payload: {
      isPlaying: true
    },
  });
}

export const setPausePlayback = () => async (dispatch) => {
  if (playbackRef) {
    clearInterval(playbackRef)
  }
  dispatch({
    type: SET_PLAY_PAUSE_PLAYBACK,
    payload: {
      isPlaying: false
    },
  });
}

export const setStopPlayback = () => async (dispatch) => {
  if (playbackRef) {
    clearInterval(playbackRef)
  }
  dispatch({
    type: SET_STOP_PLAYBACK,
    payload: {
      isPlaying: false,
      time: undefined
    },
  });
}

export const setSpeedPlayback = (speed) => async (dispatch) => {
  dispatch({
    type: SET_SPEED_PLAYBACK,
    payload: {
      speed
    },
  });
}

export const setIsRegionPlayback = (isPlaybackRegion) => async (dispatch) => {
  dispatch({
    type: SET_IS_REGION_PLAYBACK,
    payload: {
      isPlaybackRegion
    },
  });
}

export const setIsColorStatusFleet = (isColorStatusFleet) => async (dispatch) => {
  dispatch({
    type: SET_IS_COLOR_STATUS_FLEET,
    payload: {
      isColorStatusFleet
    },
  });
}

export const setIsNavigationIndicator = (isNavigationIndicator) => async (dispatch) => {
  dispatch({
    type: SET_IS_NAVIGATION,
    payload: {
      isNavigationIndicator
    },
  });
}

export const setIsOperationIndicator = (isOperationIndicator) => async (dispatch) => {
  dispatch({
    type: SET_IS_OPERATION,
    payload: {
      isOperationIndicator
    },
  });
}

export const setOperationMachines = (operationMachines) => async (dispatch) => {
  dispatch({
    type: SET_OPERATION_MACHINES,
    payload: {
      operationMachines
    }
  })
}

export const setShowAISVessels = (isShowAIS) => async (dispatch) => {
  dispatch({
    type: SET_SHOW_AIS,
    payload: {
      isShowAIS,
    },
  });
};

export const setFilterPortActivity = (filterPortActivity) => async (dispatch) => {
  dispatch({
    type:  SET_PORT_FILTER_ACTIVITY,
    payload: {
      filterPortActivity,
    },
  });
};

export const setIsShowWeatherRoute = (isShowWeatherRoute) => async (dispatch) => {
  dispatch({
    type: SET_IS_SHOW_WEATHER_ROUTE,
    payload: {
      isShowWeatherRoute,
    },
  });
}

export const setIsShowDirectionRoute = (isShowDirectionRoute) => async (dispatch) => {
  dispatch({
    type: SET_IS_SHOW_DIRECTION_ROUTE,
    payload: {
      isShowDirectionRoute,
    },
  });
}

export const setIsShowRoute = (isShowRoute) => async (dispatch) => {
  dispatch({
    type: SET_IS_SHOW_ROUTE,
    payload: {
      isShowRoute,
    },
  });
}

export const setIsShowMeasureLine = (isShowMeasureLine) => async (dispatch) => {
  dispatch({
    type: SET_IS_SHOW_MESAURE_LINE,
    payload: {
      isShowMeasureLine,
    },
  });
}

export const setPointsMeasureLine = (pointsMeasureLine) => async (dispatch) => {
  dispatch({
    type: SET_POINTS_MEASURE_LINE,
    payload: {
      pointsMeasureLine,
    },
  });
}

export const setUnitMeasureLine = (unitMeasureLine) => async (dispatch) => {
  dispatch({
    type: SET_UNIT_MEASURE_LINE,
    payload: {
      unitMeasureLine,
    },
  });
}

export const setForceUpdate = (forceUpdate) => async (dispatch) => {
  dispatch({
    type: SET_FORCE_UPDATE,
    payload: {
      forceUpdate,
    },
  });
}
