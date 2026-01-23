import {
  SET_FILTER_ROUTER,
  SET_IS_COLOR_STATUS_FLEET,
  SET_IS_NAVIGATION,
  SET_IS_OPERATION,
  SET_IS_REGION_PLAYBACK,
  SET_IS_SHOW_POINTS,
  SET_IS_SHOW_PREDICTION_ROUTE,
  SET_IS_SHOW_SEQUENCE_POINTS,
  SET_IS_SHOW_WEATHER_ROUTE,
  SET_IS_SHOW_ROUTE,
  SET_MAP_ROUTER,
  SET_MAP_SHOW_CODE,
  SET_MAP_SHOW_NAME,
  SET_MAP_SHOW_NAME_FENCE,
  SET_MAP_TECH,
  SET_MAP_THEME,
  SET_OPERATION_MACHINES,
  SET_PLAY_PAUSE_PLAYBACK,
  SET_PORT_FILTER_ACTIVITY,
  SET_ROUTER_IS_LOADING,
  SET_SHOW_AIS,
  SET_SPEED_PLAYBACK,
  SET_STOP_PLAYBACK,
  SET_TIME_PLAYBACK,
  SET_IS_SHOW_MESAURE_LINE,
  SET_POINTS_MEASURE_LINE,
  SET_UNIT_MEASURE_LINE,
  SET_FORCE_UPDATE,
  SET_IS_SHOW_DIRECTION_ROUTE,
} from "../actions/actionsTypes";

const loadInitLocal = (prop) => {
  const valueRead = localStorage.getItem(prop);
  if (
    valueRead === null ||
    valueRead === undefined ||
    valueRead === "null" ||
    valueRead === "undefined" ||
    valueRead === "" ||
    valueRead === "false" ||
    valueRead === false
  ) {
    return false;
  }

  return true;
};

export const map = (
  state = {
    showCode: loadInitLocal("map_show_code"),
    showName: loadInitLocal("map_show_name"),
    showNameFence: loadInitLocal("map_show_name_fence"),
    mapTech: loadInitLocal("map_tech"),
    mapTheme: localStorage.getItem("map_theme") || "default",
    router: {
      interval: 1,
      hourPosition: 12,
    },
    isShowPoints: false,
    isShowSequencePoints: false,
    routerIsLoading: false,
    filterRouter: undefined,
    isShowPredicitonRoute: loadInitLocal("show_predicition_route"),
    playback: {
      time: undefined,
      isPlaying: false,
      speed: 6e4, // 30seconds
    },
    isPlaybackRegion: false,
    isColorStatusFleet: loadInitLocal("color_status_fleet"),
    isShowAIS: false,
    filterPortActivity: undefined,
    isNavigationIndicator: loadInitLocal("is_navigation"),
    isOperationIndicator: loadInitLocal("is_operation"),
    operationMachines: null,
    isShowWeatherRoute: false,
    isShowDirectionRoute: false,
    isShowRoute: true,
    isShowMeasureLine: false,
    pointsMeasureLine: [],
    unitMeasureLine: "nm",
    forceUpdate: 0,
  },
  action
) => {
  switch (action.type) {
    case SET_MAP_SHOW_CODE:
      localStorage.setItem(
        "map_show_code",
        action.payload.showCode ? "true" : ""
      );
      return {
        ...state,
        showCode: action.payload.showCode,
      };
    case SET_MAP_SHOW_NAME:
      localStorage.setItem(
        "map_show_name",
        action.payload.showName ? "true" : ""
      );
      return {
        ...state,
        showName: action.payload.showName,
      };
    case SET_MAP_TECH:
      localStorage.setItem("map_tech", action.payload.mapTech);
      return {
        ...state,
        mapTech: action.payload.mapTech,
      };
    case SET_MAP_SHOW_NAME_FENCE:
      localStorage.setItem(
        "map_show_name_fence",
        action.payload.showNameFence ? "true" : ""
      );
      return {
        ...state,
        showNameFence: action.payload.showNameFence,
      };
    case SET_MAP_ROUTER:
      return {
        ...state,
        router: {
          ...state.router,
          ...action.payload.router,
        },
      };
    case SET_ROUTER_IS_LOADING:
      return {
        ...state,
        routerIsLoading: action.payload.isLoading,
      };
    case SET_MAP_THEME:
      const mapTheme = action.payload.mapTheme;
      localStorage.setItem("map_theme", mapTheme);
      return {
        ...state,
        mapTheme,
      };
    case SET_FILTER_ROUTER:
      return {
        ...state,
        filterRouter: action.payload.filterRouter,
      };
    case SET_IS_SHOW_POINTS:
      return {
        ...state,
        isShowPoints: action.payload.isShowPoints,
      };
    case SET_IS_SHOW_SEQUENCE_POINTS:
      return {
        ...state,
        isShowSequencePoints: action.payload.isShowSequencePoints,
      };
    case SET_IS_SHOW_PREDICTION_ROUTE: {
      localStorage.setItem(
        "show_predicition_route",
        action.payload.isShowPredicitonRoute ? "true" : ""
      );
      return {
        ...state,
        isShowPredicitonRoute: action.payload.isShowPredicitonRoute,
      };
    }
    case SET_TIME_PLAYBACK: {
      return {
        ...state,
        playback: {
          ...state?.playback,
          time: action.payload.time,
        },
      };
    }
    case SET_PLAY_PAUSE_PLAYBACK: {
      return {
        ...state,
        playback: {
          ...state?.playback,
          isPlaying: action.payload.isPlaying,
        },
      };
    }
    case SET_SPEED_PLAYBACK: {
      return {
        ...state,
        playback: {
          ...state?.playback,
          speed: action.payload.speed,
        },
      };
    }
    case SET_IS_REGION_PLAYBACK: {
      return {
        ...state,
        isPlaybackRegion: action.payload.isPlaybackRegion,
      };
    }
    case SET_STOP_PLAYBACK: {
      return {
        ...state,
        playback: {
          isPlaying: action.payload.isPlaying,
          time: action.payload.time,
          speed: 6e4,
        },
      };
    }
    case SET_IS_COLOR_STATUS_FLEET: {
      localStorage.setItem(
        "color_status_fleet",
        action.payload.isColorStatusFleet ? "true" : ""
      );
      return {
        ...state,
        isColorStatusFleet: action.payload.isColorStatusFleet,
      };
    }
    case SET_SHOW_AIS: {
      return {
        ...state,
        isShowAIS: action.payload.isShowAIS,
      };
    }
    case SET_PORT_FILTER_ACTIVITY: {
      return {
        ...state,
        filterPortActivity: action.payload.filterPortActivity,
      };
    }
    case SET_IS_NAVIGATION: {
      localStorage.setItem(
        "is_navigation",
        action.payload.isNavigationIndicator ? "true" : "false"
      );

      if (action.payload.isNavigationIndicator) {
        localStorage.setItem("is_operation", "false");
      }

      return {
        ...state,
        isOperationIndicator: action.payload.isNavigationIndicator
          ? false
          : state.isOperationIndicator,
        isNavigationIndicator: action.payload.isNavigationIndicator,
      };
    }
    case SET_IS_OPERATION: {
      localStorage.setItem(
        "is_operation",
        action.payload.isOperationIndicator ? "true" : "false"
      );

      if (action.payload.isOperationIndicator) {
        localStorage.setItem("is_navigation", "false");
      }

      return {
        ...state,
        isNavigationIndicator: action.payload.isOperationIndicator
          ? false
          : state.isNavigationIndicator,
        isOperationIndicator: action.payload.isOperationIndicator,
      };
    }
    case SET_OPERATION_MACHINES: {
      return {
        ...state,
        operationMachines: action.payload.operationMachines,
      };
    }
    case SET_IS_SHOW_WEATHER_ROUTE: {
      return {
        ...state,
        isShowWeatherRoute: action.payload.isShowWeatherRoute,
      };
    }
    case SET_IS_SHOW_DIRECTION_ROUTE: {
      return {
        ...state,
        isShowDirectionRoute: action.payload.isShowDirectionRoute,
      };
    }
    case SET_IS_SHOW_ROUTE: {
      return {
        ...state,
        isShowRoute: action.payload.isShowRoute,
      };
    }
    case SET_IS_SHOW_MESAURE_LINE: {
      return {
        ...state,
        isShowMeasureLine: action.payload.isShowMeasureLine,
      };
    }
    case SET_POINTS_MEASURE_LINE: {
      return {
        ...state,
        pointsMeasureLine: action.payload.pointsMeasureLine,
      };
    }
    case SET_UNIT_MEASURE_LINE: {
      return {
        ...state,
        unitMeasureLine: action.payload.unitMeasureLine,
      };
    }
    case SET_FORCE_UPDATE: {
      return {
        ...state,
        forceUpdate: state.forceUpdate + 1,
      };
    }
    default:
      return state;
  }
};
