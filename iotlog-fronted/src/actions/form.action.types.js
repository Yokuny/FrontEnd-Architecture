import { SET_FIELDS_FORM, ADD_FIELDS_FORM, SET_FORM } from "./actionsTypes";

export const setFormFields = (fields) => async (dispatch) => {
  dispatch({
    type: SET_FIELDS_FORM,
    payload: { fields },
  });
};

export const addFormFields = (fields) => async (dispatch) => {
  dispatch({
    type: ADD_FIELDS_FORM,
    payload: { fields },
  });
};

export const setForm = (form) => async (dispatch) => {
  dispatch({
    type: SET_FORM,
    payload: { form },
  });
};
