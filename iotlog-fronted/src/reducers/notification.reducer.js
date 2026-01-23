import {
  SET_NEW_NOTIFICATIONS,
} from "../actions/actionsTypes";

export const notification = (
  state = {
    listNew: []
  },
  action
) => {
  switch (action.type) {
    case SET_NEW_NOTIFICATIONS:
      return {
        listNew: action.payload.notifications,
      };
    default:
      return state;
  }
};
