import {
  SET_ENTERPRISES_FILTER,
  SET_VISIBLE_ENTERPRISES_FILTER,
} from "../actions/actionsTypes";

export const enterpriseFilter = (
  state = {
    enterprises: [],
    idEnterprises: [],
    optionsEnterprises: [],
    visible: true,
    isReady: false
  },
  action
) => {
  switch (action.type) {
    case SET_ENTERPRISES_FILTER:
      return {
        ...state,
        enterprises: action.payload.enterprises,
        idEnterprises: action.payload.enterprises.map((x) => x.id),
        optionsEnterprises: action.payload.options,
        isReady: true
      };
    case SET_VISIBLE_ENTERPRISES_FILTER:
      return {
        ...state,
        visible: action.payload.visible,
      };
    default:
      return state;
  }
};
