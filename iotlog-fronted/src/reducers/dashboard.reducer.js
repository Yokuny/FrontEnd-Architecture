import {
  SET_DISABLED_BTN_SAVE,
  SET_DATA_CHART,
  ADD_NEW_CHART,
  SET_FILTER_DASHBOARD,
  SET_EDITOR_ITEM,
  SET_DRAG_ENABLED,
  SET_LIST_GROUP,
  ADD_GROUP
} from "../actions/actionsTypes";

export const dashboard = (
  state = {
    disabledButtonSave: true,
    data: {},
    newChart: undefined,
    filter: undefined,
    editorItem: undefined,
    dragEnabled: false,
    listGroup: []
  },
  action
) => {
  switch (action.type) {
    case SET_DISABLED_BTN_SAVE:
      return {
        ...state,
        disabledButtonSave: action.payload.disabled,
      };
    case SET_DRAG_ENABLED: {
      return {
        ...state,
        dragEnabled: action.payload.dragEnabled
      }
    }
    case SET_DATA_CHART:
      return {
        ...state,
        data: action.payload.data,
      };
    case ADD_NEW_CHART:
      return {
        ...state,
        newChart: action.payload.chart,
      };
    case SET_FILTER_DASHBOARD:
      return {
        ...state,
        filter: action.payload?.filter,
        isFiltered: !action.payload?.filter?.isClean
      };
    case SET_EDITOR_ITEM:
      return {
        ...state,
        editorItem: action.payload.editorItem,
      }
    case SET_LIST_GROUP:
      return {
        ...state,
        listGroup: action.payload.listGroup,
      }
    case ADD_GROUP:
      return {
        ...state,
        listGroup: [
          ...(state.listGroup || []),
          action.payload.group
        ]
      }
    default:
      return state;
  }
};
