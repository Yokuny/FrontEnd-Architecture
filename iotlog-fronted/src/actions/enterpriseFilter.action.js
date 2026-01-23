import {
  SET_ENTERPRISES_FILTER,
  SET_VISIBLE_ENTERPRISES_FILTER,
} from "./actionsTypes";

export const setEnteprisesFilter = ({ enterprises, options }) => async (dispatch) => {
  if (enterprises?.length) {
    localStorage.setItem("id_enterprise_filter", enterprises[0].id);
  }
  else {
    localStorage.removeItem("id_enterprise_filter");
  }
  dispatch({
    type: SET_ENTERPRISES_FILTER,
    payload: { enterprises, options },
  });
};

export const setVisibleEnteprisesFilter = (params) => async (dispatch) => {
  dispatch({
    type: SET_VISIBLE_ENTERPRISES_FILTER,
    payload: { visible: params },
  });
};
