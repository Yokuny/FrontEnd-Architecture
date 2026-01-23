import {
  SET_ITEMS_MENU,
  SET_STATE_VIEWER_DRAG_MENU,
  SET_STATE_VISIBLE_MENU,
  SET_MENU_STATE,
} from "../actions/actionsTypes";

export const menu = (
  state = {
    items: [],
    itemsByEnterprise: [],
    stateViewer: "",
    menuState: "expanded", // 'hidden' | 'visible' | 'compacted' | 'expanded'
    isFixed: false,
    visible: true,
  },
  action
) => {
  switch (action.type) {
    case SET_ITEMS_MENU:
      return {
        ...state,
        items: action.payload.items,
        itemsByEnterprise: action.payload.itemsByEnterprise,
      };
    case SET_STATE_VISIBLE_MENU:
      return {
        ...state,
        visible: action.payload.visible,
      };
    case SET_STATE_VIEWER_DRAG_MENU:
      return {
        ...state,
        stateViewer: action.payload.state,
      };
    case SET_MENU_STATE:
      return {
        ...state,
        menuState: action.payload.state,
      };
    default:
      return state;
  }
};
