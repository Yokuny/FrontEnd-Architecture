import { SET_NEW_NOTIFICATIONS } from "./actionsTypes";

export const setNewNotifications = (notifications) => async (dispatch) => {
  dispatch({
    type: SET_NEW_NOTIFICATIONS,
    payload: { notifications },
  });
};
