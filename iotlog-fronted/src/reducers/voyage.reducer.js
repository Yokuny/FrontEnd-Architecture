import {
  SET_DATA_VOYAGE,
  ADD_DATA_VOYAGE,
  ADD_DATA_CONSUME_VOYAGE,
  SET_INTEGRATION_VOYAGE_SELECTED,
  SET_VOYAGE_KICK_FILTER,
  SET_INTEGRATION_ASSETS_SELECTED
} from "../actions/actionsTypes";

export const voyage = (
  state = {
    data: undefined,
    consume: undefined,
    integrationVoyageSelect: undefined,
    kickVoyageFilter: undefined,
    assetSelect: undefined
  },
  action
) => {
  switch (action.type) {
    case SET_DATA_VOYAGE:
      return {
        ...state,
        data: action.payload?.data?.data,
        consume: action.payload?.data?.consume,
      };
    case ADD_DATA_VOYAGE:
      return {
        ...state,
        data: {
          ...(state?.data || {}),
          ...action.payload.data,
        },
      };
    case ADD_DATA_CONSUME_VOYAGE:
      return {
        ...state,
        consume: {
          ...(state?.consume || {}),
          ...action.payload.consume,
        },
      };
    case SET_INTEGRATION_VOYAGE_SELECTED:
      return {
        ...state,
        integrationVoyageSelect: action.payload.integrationVoyageSelect
      }
    case SET_VOYAGE_KICK_FILTER:
      return {
        ...state,
        kickVoyageFilter: action.payload.kickVoyageFilter
      }
    case SET_INTEGRATION_ASSETS_SELECTED:
      return {
        ...state,
        assetSelect: action.payload.assetSelect
      }
    default:
      return state;
  }
};
