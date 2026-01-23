import {
  SET_THEME_SETTINGS,
  SET_LANGUAGE,
  SET_TOGGLE_MENU,
} from "../actions/actionsTypes";

const localTheme = localStorage.getItem("theme");
const localLocale = localStorage.getItem("locale");
export const settings = (
  state = {
    theme: localTheme || "default",
    locale: localLocale || "pt",
    toggleMenu: false,
  },
  action
) => {
  switch (action.type) {
    case SET_THEME_SETTINGS:
      return {
        ...state,
        theme: action.payload.theme,
      };
    case SET_LANGUAGE:
      return {
        ...state,
        locale: action.payload.locale,
      };
    case SET_TOGGLE_MENU:
      return {
        ...state,
        toggleMenu: action.payload.toggleMenu,
      };
    default:
      return state;
  }
};
