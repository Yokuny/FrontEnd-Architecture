import { ADD_EMPTY_GENERATOR, SET_FIRST_FETCH_FLAG, ADD_EMPTY_THRUSTER, SET_FILTER_IHM, SET_IHM_DATA, SET_IHM_SENSOR_LIST, SET_IS_EDITING_IHM, SET_IS_LOADING_IHM } from "../actions/actionsTypes";

export const remoteIHMState = (state = {
  isLoading: false,
  isEditing: false,
  dataIHM: {},
  sensorList: [],
  filterIHM: {},
  statusResponse: 200,
  isFirstFetch: true,
},
  action
) => {
  switch (action.type) {
    case SET_FILTER_IHM:
      return {
        ...state,
        filterIHM: {
          ...state.filterIHM,
          ...action.payload,
        }
      }
    case SET_IS_EDITING_IHM:
      return {
        ...state,
        isEditing: action.payload,
      }
    case SET_IHM_DATA:
      return {
        ...state,
        dataIHM: action.payload,
      }
    case SET_IHM_SENSOR_LIST:
      return {
        ...state,
        sensorList: action.payload,
      }
    case SET_IS_LOADING_IHM:
      return {
        ...state,
        isLoading: action.payload,
      }
    case ADD_EMPTY_GENERATOR:
    case ADD_EMPTY_THRUSTER:
      return {
        ...state,
        dataIHM: action.payload
      }
    case SET_FIRST_FETCH_FLAG:
      return {
        ...state,
        isFirstFetch: action.payload,
      };
    default:
      return state;
  }
};