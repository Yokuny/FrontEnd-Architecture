import { SET_LAST_FILLED_FORM_BOARD } from "../actions/actionsTypes";

export const formBoard = (
  state = {
    lastFilled: undefined,
  },
  action
) => {
  switch (action.type) {
    case SET_LAST_FILLED_FORM_BOARD:
      return {
        lastFilled: action.payload?.lastFilled,
      };
    default:
      return state;
  }
};
