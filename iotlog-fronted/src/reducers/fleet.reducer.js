import {
  SET_ISLOADING_MACHINE_POINTS,
  SET_POSITIONS,
  SET_COURSES,
  SET_MACHINE_DETAILS_POINTS,
  SET_STATUS_MACHINE,
  SET_ISLOADING_STATUS_MACHINE,
  SET_MACHINE_FILTER,
  SET_IS_SHOW_LIST_FLEET,
  SET_TRAVEL_SELECTED,
  SET_LAST_MARKER,
  SET_ITEM_POINT_DETAILS,
  SET_ROUTE_HISTORY,
  SET_MACHINES,
  SET_MACHINE_CONSUME_DETAILS,
  SET_ITEM_HISTORY_CONSUME,
  SET_EVENTS_STATUS_CONSUME,
  SET_ROUTE_CONSUMPTION,
  SET_ROUTE_CONSUMPTION_SENSORS,
  SET_MACHINE_CREW_SELECTED,
  SET_ROUTE_BACK_SELECTED,
  SET_MACHINE_INFO_SELECTED,
  SET_MACHINE_CONTACT_SELECTED,
  SET_EVENT_TIMELINE_SELECT,
  RESET_STATE_FLEET,
  SET_ROUTE_INTEGRATION,
  SET_MACHINE_CAMERAS_SELECTED,
  SET_ASSET_VOYAGE_SELECTED
} from "../actions/actionsTypes";

export const fleet = (
  state = {
    isLoadingPositions: false,
    positions: [],
    courses: [],
    isLoadingStatus: false,
    statusMachine: [],
    machineDetailsSelected: undefined,
    travelDetailsSelected: undefined,
    routeBackSelected: undefined,
    machineConsumptionSelected: undefined,
    isShowList: localStorage.getItem("show_list_fleet") === "true",
    lastMarker: undefined,
    listSelectedPoints: [],
    routeHistory: [],
    machines: [],
    itemHistoryConsume: undefined,
    eventsStatusHistory: [],
    routeConsumption: [],
    routeConsumptionSensors: undefined,
    machineCrewSelected: undefined,
    machineInfoSelected: undefined,
    machineContactSelected: undefined,
    machineCamerasSelected: undefined,
    eventTimelineSelect: undefined,
    routeIntegration: [],
    vesselIntegration: undefined,
    isLoadingRouteIntegration: false,
    vesselsInFence: [],
    assetVoyageSelected: undefined,
  },
  action
) => {
  switch (action.type) {
    case SET_ISLOADING_MACHINE_POINTS:
      return {
        ...state,
        isLoadingPositions: action.payload.isLoading,
      };
    case SET_POSITIONS:
      return {
        ...state,
        positions: action.payload.positions,
      };
    case SET_COURSES:
      return {
        ...state,
        courses: action.payload.courses,
      };
    case SET_MACHINE_DETAILS_POINTS:
      return {
        ...state,
        isLoadingPositions: action.payload.isLoading,
        positions: action.payload.positions,
        courses: action.payload.courses,
      };
    case SET_ISLOADING_STATUS_MACHINE:
      return {
        ...state,
        isLoadingStatus: action.payload.isLoading,
      };
    case SET_STATUS_MACHINE:
      return {
        ...state,
        isLoadingStatus: action.payload.isLoading,
        statusMachine: action.payload.statusMachine,
      };
    case SET_MACHINE_FILTER:
      return {
        ...state,
        travelDetailsSelected: undefined,
        eventTimelineSelect: undefined,
        machineConsumptionSelected: undefined,
        routeConsumption: undefined,
        machineContactSelected: undefined,
        machineInfoSelected: undefined,
        machineCrewSelected: undefined,
        routeBackSelected: undefined,
        machineDetailsSelected: action.payload.machine,
      };
    case SET_IS_SHOW_LIST_FLEET:
      localStorage.setItem(
        "show_list_fleet",
        action.payload.isShowList ? "true" : ""
      );
      return {
        ...state,
        isShowList: action.payload.isShowList,
      };
    case SET_TRAVEL_SELECTED:
      return {
        ...state,
        eventTimelineSelect: undefined,
        machineConsumptionSelected: undefined,
        routeConsumption: undefined,
        machineContactSelected: undefined,
        machineInfoSelected: undefined,
        machineDetailsSelected: undefined,
        machineCrewSelected: undefined,
        routeBackSelected: undefined,
        travelDetailsSelected: action.payload.travel,
      };
    case SET_LAST_MARKER: {
      return {
        ...state,
        lastMarker: action.payload.lastMarker,
      };
    }
    case SET_ITEM_POINT_DETAILS: {
      return {
        ...state,
        listSelectedPoints: action.payload.listSelectedPoints,
      };
    }
    case SET_ROUTE_HISTORY: {
      return {
        ...state,
        routeHistory: action.payload.routeHistory,
      };
    }
    case SET_MACHINES: {
      return {
        ...state,
        machines: action.payload.machines,
      }
    }
    case SET_MACHINE_CONSUME_DETAILS: {
      return {
        ...state,
        eventTimelineSelect: undefined,
        routeConsumption: undefined,
        machineContactSelected: undefined,
        machineInfoSelected: undefined,
        machineDetailsSelected: undefined,
        machineCrewSelected: undefined,
        routeBackSelected: undefined,
        travelDetailsSelected: undefined,
        machineConsumptionSelected: action.payload.machineConsumptionSelected
      }
    }
    case SET_ITEM_HISTORY_CONSUME: {
      return {
        ...state,
        itemHistoryConsume: action.payload.itemHistoryConsume
      }
    }
    case SET_EVENTS_STATUS_CONSUME: {
      return {
        ...state,
        eventsStatusHistory: action.payload.events
      }
    }
    case SET_ROUTE_CONSUMPTION: {
      return {
        ...state,
        routeConsumption: action.payload.routeConsumption
      }
    }
    case SET_ROUTE_CONSUMPTION_SENSORS: {
      return {
        ...state,
        routeConsumptionSensors: action.payload.sensors
      }
    }
    case SET_MACHINE_CREW_SELECTED: {
      return {
        ...state,
        eventTimelineSelect: undefined,
        machineConsumptionSelected: undefined,
        routeConsumption: undefined,
        machineContactSelected: undefined,
        machineInfoSelected: undefined,
        machineDetailsSelected: undefined,
        routeBackSelected: undefined,
        travelDetailsSelected: undefined,
        machineCrewSelected: action.payload.machineCrewSelected
      }
    }
    case SET_ROUTE_BACK_SELECTED: {
      return {
        ...state,
        eventTimelineSelect: undefined,
        machineConsumptionSelected: undefined,
        routeConsumption: undefined,
        machineContactSelected: undefined,
        machineInfoSelected: undefined,
        machineDetailsSelected: undefined,
        machineCrewSelected: undefined,
        travelDetailsSelected: undefined,
        routeBackSelected: action.payload.routeBackSelected
      }
    }
    case SET_MACHINE_INFO_SELECTED: {
      return {
        ...state,
        eventTimelineSelect: undefined,
        machineConsumptionSelected: undefined,
        routeConsumption: undefined,
        machineContactSelected: undefined,
        machineDetailsSelected: undefined,
        routeBackSelected: undefined,
        machineCrewSelected: undefined,
        travelDetailsSelected: undefined,
        machineInfoSelected: action.payload.machineInfoSelected
      }
    }
    case SET_MACHINE_CONTACT_SELECTED: {
      return {
        ...state,
        eventTimelineSelect: undefined,
        machineConsumptionSelected: undefined,
        routeConsumption: undefined,
        machineDetailsSelected: undefined,
        routeBackSelected: undefined,
        machineCrewSelected: undefined,
        travelDetailsSelected: undefined,
        machineInfoSelected: undefined,
        machineContactSelected: action.payload.machineContactSelected
      }
    }
    case SET_MACHINE_CAMERAS_SELECTED: {
      return {
        ...state,
        eventTimelineSelect: undefined,
        machineConsumptionSelected: undefined,
        routeConsumption: undefined,
        machineDetailsSelected: undefined,
        routeBackSelected: undefined,
        machineCrewSelected: undefined,
        travelDetailsSelected: undefined,
        machineInfoSelected: undefined,
        machineContactSelected: undefined,
        machineCamerasSelected: action.payload.machineCamerasSelected
      }
    }
    case SET_EVENT_TIMELINE_SELECT: {
      return {
        ...state,
        eventTimelineSelect: action.payload.eventTimelineSelect,
      };
    }
    case RESET_STATE_FLEET: {
      return {
        ...state,
        machineDetailsSelected: undefined,
        travelDetailsSelected: undefined,
        routeBackSelected: undefined,
        machineConsumptionSelected: undefined,
        itemHistoryConsume: undefined,
        eventsStatusHistory: [],
        routeConsumption: [],
        routeConsumptionSensors: undefined,
        machineCrewSelected: undefined,
        machineInfoSelected: undefined,
        machineContactSelected: undefined,
        eventTimelineSelect: undefined,
      }
    }
    case SET_ROUTE_INTEGRATION: {
      return {
        ...state,
        routeIntegration: action.payload.routeIntegration,
        vesselIntegration: action.payload.vesselIntegration,
        isLoadingRouteIntegration: action.payload.isLoadingRouteIntegration
      }
    }
    case SET_ASSET_VOYAGE_SELECTED: {
      return {
        ...state,
        assetVoyageSelected: action.payload.assetVoyageSelected,
      }
    }
    case 'SET_VESSELS_IN_FENCE': {
      return {
        ...state,
        vesselsInFence: action.payload.vesselsInFence,
      }
    }
    default:
      return state;
  }
};
