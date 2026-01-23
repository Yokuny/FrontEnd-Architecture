import {
  SET_THEME_SETTINGS,
  SET_LANGUAGE,
  SET_TOGGLE_MENU,
} from "./actionsTypes";

export const setTheme = (params) => async (dispatch) => {
  localStorage.setItem("theme", params);
  dispatch({
    type: SET_THEME_SETTINGS,
    payload: { theme: params },
  });
};

export const setLanguage = (params) => async (dispatch) => {
  localStorage.setItem("locale", params);
  dispatch({
    type: SET_LANGUAGE,
    payload: { locale: params },
  });
  document.documentElement.lang = params == "pt" ? "pt-BR" : params;
};

export const setToggleMenu = (params) => async (dispatch) => {
  dispatch({
    type: SET_TOGGLE_MENU,
    payload: { toggleMenu: params },
  });
};
