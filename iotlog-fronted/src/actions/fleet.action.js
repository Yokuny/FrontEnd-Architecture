import { loadAndGet } from "../components/Decode/FleetDecode";
import Fetch from "../components/Fetch/Fetch";
import TrackingService from "../services/TrackingService";
import {
  RESET_STATE_FLEET,
  SET_ASSET_VOYAGE_SELECTED,
  SET_COURSES,
  SET_EVENTS_STATUS_CONSUME,
  SET_EVENT_TIMELINE_SELECT,
  SET_ISLOADING_MACHINE_POINTS,
  SET_ISLOADING_STATUS_MACHINE,
  SET_IS_SHOW_LIST_FLEET,
  SET_ITEM_HISTORY_CONSUME,
  SET_ITEM_POINT_DETAILS,
  SET_LAST_MARKER,
  SET_MACHINES,
  SET_MACHINE_CAMERAS_SELECTED,
  SET_MACHINE_CONSUME_DETAILS,
  SET_MACHINE_CONTACT_SELECTED,
  SET_MACHINE_CREW_SELECTED,
  SET_MACHINE_DETAILS_POINTS,
  SET_MACHINE_FILTER,
  SET_MACHINE_INFO_SELECTED,
  SET_POSITIONS,
  SET_ROUTE_BACK_SELECTED,
  SET_ROUTE_CONSUMPTION,
  SET_ROUTE_CONSUMPTION_SENSORS,
  SET_ROUTE_HISTORY,
  SET_ROUTE_INTEGRATION,
  SET_STATUS_MACHINE,
  SET_TRAVEL_SELECTED,
} from "./actionsTypes";

export const getPointsDetailsFleet = (idMachines) => async (dispatch) => {
  dispatch({
    type: SET_ISLOADING_MACHINE_POINTS,
    payload: {
      isLoading: true,
    },
  });

  if (idMachines?.length) {
    const root = loadAndGet();
    const xAa4Collection = root.lookupType('positions.PositionsCollection');
    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    Fetch.post(
      `/fleet/lastpositions`,
      {
        idAssets: idMachines,
        ...(idEnterpriseFilter ? { idEnterprise: idEnterpriseFilter } : {}),
      },
      {
        isV2: true,
        responseType: 'arraybuffer',
        defaultTakeCareError: false,
      }
    )
      .then((response) => {
        if (response.data) {
          const buffer = new Uint8Array(response.data);
          const collection = xAa4Collection.decode(buffer);
          if (!collection) {
            dispatch({
              type: SET_MACHINE_DETAILS_POINTS,
              payload: {
                isLoading: false,
                positions: [],
                courses: [],
              },
            });
            return;
          }



          dispatch({
            type: SET_MACHINE_DETAILS_POINTS,
            payload: {
              isLoading: false,
              positions: collection?.points?.map((x) => ({
                date: new Date(x.timestamp * 1000),
                idMachine: x.idAsset,
                idSensor: x.idSensor,
                position: [x.lat,x.lon],
              })),
              courses: collection?.courses?.map((x) => ({
                date: new Date(x.timestamp * 1000),
                idMachine: x.idAsset,
                idSensor: x.idSensor,
                course: x.course,
              })),
            }
      });
  } else {
    dispatch({
      type: SET_MACHINE_DETAILS_POINTS,
      payload: {
        isLoading: false,
        positions: [],
        courses: [],
      },
    });
  }
})
      .catch ((e) => {
  dispatch({
    type: SET_MACHINE_DETAILS_POINTS,
    payload: {
      isLoading: false,
      positions: [],
      courses: [],
    },
  });
});
  } else {
  dispatch({
    type: SET_MACHINE_DETAILS_POINTS,
    payload: {
      isLoading: false,
      positions: [],
      courses: [],
    },
  });
}
};

export const setPositions = (positions) => async (dispatch) => {
  dispatch({
    type: SET_POSITIONS,
    payload: {
      positions,
    },
  });
};

export const setCourses = (courses) => async (dispatch) => {
  dispatch({
    type: SET_COURSES,
    payload: {
      courses,
    },
  });
};

export const getStatusMachines = (idMachines) => async (dispatch) => {
  dispatch({
    type: SET_ISLOADING_STATUS_MACHINE,
    payload: {
      isLoading: true,
    },
  });

  if (idMachines?.length) {
    Fetch.get(
      `/travel/machine/status?${idMachines
        ?.map((x, i) => `idMachines[]=${x}`)
        ?.join("&")}`
    )
      .then((response) => {
        dispatch({
          type: SET_STATUS_MACHINE,
          payload: {
            isLoading: false,
            statusMachine: response.data || [],
          },
        });
      })
      .catch((e) => {
        dispatch({
          type: SET_STATUS_MACHINE,
          payload: {
            positions: [],
            courses: [],
          },
        });
      });
  } else {
    dispatch({
      type: SET_STATUS_MACHINE,
      payload: {
        positions: [],
        courses: [],
      },
    });
  }
};

export const setMachineDetailsSelected = (machine) => async (dispatch) => {
  dispatch({
    type: SET_MACHINE_FILTER,
    payload: {
      machine,
    },
  });
  if (machine)
    TrackingService.saveTracking({
      pathname: window.location.pathname,
      action: "MACHINE_DETAILS",
      actionData: {
        idMachine: machine?.machine?.id,
        name: machine?.machine?.name,
      },
    });
};

export const setIsShowList = (isShowList) => async (dispatch) => {
  dispatch({
    type: SET_IS_SHOW_LIST_FLEET,
    payload: {
      isShowList,
    },
  });
};

export const setTravelDetailsSelected = (travel) => async (dispatch) => {
  dispatch({
    type: SET_TRAVEL_SELECTED,
    payload: {
      travel,
    },
  });
  if (travel)
    TrackingService.saveTracking({
      pathname: window.location.pathname,
      action: "TRAVEL_DETAILS",
      actionData: {
        idTravel: travel?.id,
        code: travel?.code,
      },
    });
};

export const clearPoints = () => async (dispatch) => {
  dispatch({
    type: SET_MACHINE_DETAILS_POINTS,
    payload: {
      isLoading: false,
      positions: [],
      courses: [],
    },
  });
};

export const setLastMarker = (lastMarker) => async (dispatch) => {
  dispatch({
    type: SET_LAST_MARKER,
    payload: {
      lastMarker,
    },
  });
};

export const setListSelectedPoint = (listSelectedPoints) => async (dispatch) => {
  dispatch({
    type: SET_ITEM_POINT_DETAILS,
    payload: {
      listSelectedPoints,
    },
  });
};

export const setRouteHistory = (routeHistory) => async (dispatch) => {
  dispatch({
    type: SET_ROUTE_HISTORY,
    payload: {
      routeHistory,
    },
  });
};

export const setMachines = (machines) => async (dispatch) => {
  dispatch({
    type: SET_MACHINES,
    payload: {
      machines,
    },
  });
};

export const setMachineConsume = (machineConsumptionSelected) => async (dispatch) => {
  dispatch({
    type: SET_MACHINE_CONSUME_DETAILS,
    payload: {
      machineConsumptionSelected,
    },
  });
};

export const setItemHistoryConsume = (itemHistoryConsume) => async (dispatch) => {
  dispatch({
    type: SET_ITEM_HISTORY_CONSUME,
    payload: {
      itemHistoryConsume,
    },
  });
};

export const setEventsStatusConsume = (events) => async (dispatch) => {
  dispatch({
    type: SET_EVENTS_STATUS_CONSUME,
    payload: {
      events,
    },
  });
};

export const setRouteConsumptionData = ({ routeConsumption, sensors }) => async (dispatch) => {
  dispatch({
    type: SET_ROUTE_CONSUMPTION,
    payload: {
      routeConsumption,
    },
  });
  dispatch({
    type: SET_ROUTE_CONSUMPTION_SENSORS,
    payload: {
      sensors,
    },
  });
};

export const setMachineCrew = (machineCrewSelected) => async (dispatch) => {
  dispatch({
    type: SET_MACHINE_CREW_SELECTED,
    payload: {
      machineCrewSelected,
    },
  });
};

export const setRouteBack = (routeBackSelected) => async (dispatch) => {
  dispatch({
    type: SET_ROUTE_BACK_SELECTED,
    payload: {
      routeBackSelected,
    },
  });
};

export const setMachineInfoSelected = (machineInfoSelected) => async (dispatch) => {
  dispatch({
    type: SET_MACHINE_INFO_SELECTED,
    payload: {
      machineInfoSelected,
    },
  });
};

export const setMachineContactSelected = (machineContactSelected) => async (dispatch) => {
  dispatch({
    type: SET_MACHINE_CONTACT_SELECTED,
    payload: {
      machineContactSelected,
    },
  });
};

export const setMachineCamerasSelected = (machineCamerasSelected) => async (dispatch) => {
  dispatch({
    type: SET_MACHINE_CAMERAS_SELECTED,
    payload: {
      machineCamerasSelected,
    },
  });
};

export const resetStateFleet = () => async (dispatch) => {
  dispatch({
    type: RESET_STATE_FLEET,
  });
  dispatch({
    type: SET_ROUTE_INTEGRATION,
    payload: {
      routeIntegration: [],
      vesselIntegration: undefined,
      isLoadingRouteIntegration: false
    },
  });
};

export const setTimelineSelected = (eventTimelineSelect) => async (dispatch) => {
  dispatch({
    type: SET_EVENT_TIMELINE_SELECT,
    payload: {
      eventTimelineSelect,
    },
  });
};

export const setAssetVoyageSelected = (assetVoyageSelected) => async (dispatch) => {
  dispatch({
    type: SET_ASSET_VOYAGE_SELECTED,
    payload: {
      assetVoyageSelected,
    },
  });
};

export const setRouteIntegration = ({ routeIntegration, vesselIntegration }) => async (dispatch) => {
  dispatch({
    type: SET_ROUTE_INTEGRATION,
    payload: {
      routeIntegration,
      vesselIntegration,
    },
  });
};


export const getRouteIntegration = (vesselInfo) => async (dispatch) => {
  dispatch({
    type: SET_ROUTE_INTEGRATION,
    payload: {
      routeIntegration: [],
      vesselIntegration: undefined,
      isLoadingRouteIntegration: true
    },
  });
  Fetch.get(`/integrationthird/vesselrouter?imo=${vesselInfo?.imo}`)
    .then((response) => {
      if (response.data?.features?.length) {
        dispatch({
          type: SET_ROUTE_INTEGRATION,
          payload: {
            routeIntegration: response.data?.features?.flatMap(x => x.properties?.gap === false ? x?.properties?.timestamps : null)?.filter(x => x?.length),
            vesselIntegration: vesselInfo,
            isLoadingRouteIntegration: false
          },
        });
      }
    })
    .catch((e) => {
      dispatch({
        type: SET_ROUTE_INTEGRATION,
        payload: {
          routeIntegration: [],
          vesselIntegration: undefined,
          isLoadingRouteIntegration: false
        },
      });
    });
}

export const setVesselsInFence = (vesselsInFence) => (dispatch) => {
  dispatch({
    type: 'SET_VESSELS_IN_FENCE',
    payload: {
      vesselsInFence,
    },
  });
};


