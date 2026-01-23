import {
  SET_DATA_STATUS_CONSUME,
  SET_ISLOADING_STATUS_CONSUME,
  SET_FILTER_STATUS_CONSUME,
  SET_UNIT_STATUS_CONSUME
} from "../actions/actionsTypes";

export const chartData = (
  state = {
    isLoadingStatusConsume: false,
    dataStatusConsume: [],
    filterStatusConsume: [],
    unitStatusConsume: 'm³',
    statusResponse: 200
  },
  action
) => {
  switch (action.type) {
    case SET_ISLOADING_STATUS_CONSUME:
      return {
        ...state,
        isLoadingStatusConsume: action.payload.isLoading,
      }
    case SET_DATA_STATUS_CONSUME:
      return {
        ...state,
        isLoadingStatusConsume: action.payload.isLoading,
        dataStatusConsume: action.payload.dataStatusConsume,
        statusResponse: action.payload.statusResponse
      };
    case SET_FILTER_STATUS_CONSUME:
      return {
        ...state,
        filterStatusConsume: action.payload.filterStatusConsume,
      };
    case SET_UNIT_STATUS_CONSUME:
      return {
        ...state,
        unitStatusConsume: action.payload.unit,
      };
    default:
      return state;
  }
};
