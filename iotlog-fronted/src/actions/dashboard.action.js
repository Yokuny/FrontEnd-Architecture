import {
  SET_DISABLED_BTN_SAVE,
  SET_DATA_CHART,
  ADD_NEW_CHART,
  SET_FILTER_DASHBOARD,
  SET_EDITOR_ITEM,
  SET_DRAG_ENABLED,
  SET_LIST_GROUP,
  ADD_GROUP
} from "./actionsTypes";

export const setDisabledSave = (disabled) => async (dispatch) => {
  dispatch({
    type: SET_DISABLED_BTN_SAVE,
    payload: { disabled },
  });
};

export const setDataChart = (data) => async (dispatch) => {
  dispatch({
    type: SET_DATA_CHART,
    payload: { data },
  });
};

export const addNewChart = (chart) => async (dispatch) => {
  dispatch({
    type: ADD_NEW_CHART,
    payload: { chart },
  });
};

export const setFilterDashboard = (filter) => async (dispatch) => {
  dispatch({
    type: SET_FILTER_DASHBOARD,
    payload: { filter },
  });
};

export const setEditorItem = (editorItem) => async (dispatch) => {
  dispatch({
    type: SET_EDITOR_ITEM,
    payload: { editorItem },
  });
};

export const setDragEnabled = (dragEnabled) => async (dispatch) => {
  dispatch({
    type: SET_DRAG_ENABLED,
    payload: { dragEnabled },
  });
};

export const setListGroup = (listGroup) => async (dispatch) => {
  dispatch({
    type: SET_LIST_GROUP,
    payload: { listGroup },
  });
};

export const addGroup = (group) => async (dispatch) => {
  dispatch({
    type: ADD_GROUP,
    payload: { group },
  });
};
