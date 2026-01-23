import {
  SET_LAST_SENSOR_STATE,
  SET_ISLOADING_LAST_SENSOR_STATE
} from "../actions/actionsTypes";

export const sensorState = (
  state = {
    isLoading: false,
    listLastState: []
  },
  action
) => {
  switch (action.type) {
    case SET_ISLOADING_LAST_SENSOR_STATE:
      return {
        ...state,
        isLoading: action.payload.isLoading,
      }
    case SET_LAST_SENSOR_STATE:
      return {
        ...state,
        isLoading: action.payload.isLoading,
        listLastState: action.payload.list,
      };
    default:
      return state;
  }
};
