import {
  SET_ITEMS_MENU,
  SET_STATE_VIEWER_DRAG_MENU,
  SET_STATE_VISIBLE_MENU,
  SET_MENU_STATE
} from "./actionsTypes";
import Fetch from "../components/Fetch/Fetch";

export const getItemsMenu = (params) => async (dispatch, getState) => {
  const thereMenuItens = getState()?.menu?.items;

  if (thereMenuItens?.length) {
    return;
  }

  Fetch.get("/user/menu")
    .then((response) => {
      dispatch({
        type: SET_ITEMS_MENU,
        payload: {
          items: response.data?.paths,
          itemsByEnterprise: response.data?.pathsByEnterprise,
        },
      });
    })
    .catch((e) => {});
};

export const resetItensMenu = () => async (dispatch) => {
  dispatch({
    type: SET_ITEMS_MENU,
    payload: {
      items: [],
      itemsByEnterprise: [],
    },
  });
}

export const setVisible = (visible) => async (dispatch) => {
  dispatch({
    type: SET_STATE_VISIBLE_MENU,
    payload: { visible },
  });
};

export const setStateViewer = (state) => async (dispatch) => {
  dispatch({
    type: SET_STATE_VIEWER_DRAG_MENU,
    payload: { state },
  });
};

export const setMenuState = (state) => ({
  type: SET_MENU_STATE,
  payload: { state },
});
