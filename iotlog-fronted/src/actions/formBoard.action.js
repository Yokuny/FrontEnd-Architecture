import { SET_LAST_FILLED_FORM_BOARD } from "./actionsTypes";

export const setLastFilledForm = (lastFilled) => async (dispatch) => {
  dispatch({
    type: SET_LAST_FILLED_FORM_BOARD,
    payload: { lastFilled },
  });
};
