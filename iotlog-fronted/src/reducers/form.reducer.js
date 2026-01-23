import { SET_FIELDS_FORM, ADD_FIELDS_FORM, SET_FORM } from "../actions/actionsTypes";

export const form = (
  state = {
    fields: [],
    form: undefined
  },
  action
) => {
  switch (action.type) {
    case SET_FIELDS_FORM:
      return {
        ...state,
        fields: action.payload?.fields,
      };
    case ADD_FIELDS_FORM:
      return {
        ...state,
        fields: [...(state?.fields || []), ...(action.payload?.fields || [])],
      };
    case SET_FORM:
      return {
        ...state,
        form: action.payload.form,
        fields: action.payload?.form?.fields || [],
      }
    default:
      return state;
  }
};
