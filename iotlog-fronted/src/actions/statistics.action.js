import { SET_USERS_FILTER, SET_USER_FILTER_WHATSAPP } from "./actionsTypes";

export const setUsersFilter = (usersFilter) => async (dispatch) => {
  dispatch({
    type: SET_USERS_FILTER,
    payload: usersFilter,
  });
};

export const setUserFilterWhatsapp = (user) => async (dispatch) => {
  dispatch({
    type: SET_USER_FILTER_WHATSAPP,
    payload: user,
  });
};
