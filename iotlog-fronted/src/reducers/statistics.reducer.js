import {
  SET_USERS_FILTER,
  SET_USER_FILTER_WHATSAPP,
} from "../actions/actionsTypes";

export const statistics = (
  state = {
    usersFilter: [],
    name: "",
    userFilterWhatsappName: "",
    userFilterWhatsapp: "",
  },
  action
) => {
  switch (action.type) {
    case SET_USERS_FILTER:
      const alreadyInState = !!state?.usersFilter?.some(
        (x) => x === action.payload[0]?.id
      );
      return {
        ...state,
        usersFilter:
          alreadyInState || !action.payload?.length
            ? []
            : [action.payload[0].id],
        name:
          alreadyInState || !action.payload?.length
            ? ""
            : action.payload[0].name,
      };
    case SET_USER_FILTER_WHATSAPP:
      const alreadyInStateWhats = !!(
        state?.userFilterWhatsapp === action.payload.id
      );
      return {
        ...state,
        userFilterWhatsapp: alreadyInStateWhats ? "" : action.payload.id,
        userFilterWhatsappName: alreadyInStateWhats
          ? ""
          : action.payload.name,
      };
    default:
      return state;
  }
};
