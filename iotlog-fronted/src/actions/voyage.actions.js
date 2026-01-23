import { SET_DATA_VOYAGE, ADD_DATA_VOYAGE , ADD_DATA_CONSUME_VOYAGE, SET_INTEGRATION_VOYAGE_SELECTED, SET_VOYAGE_KICK_FILTER, SET_INTEGRATION_ASSETS_SELECTED} from "./actionsTypes";

export const setDataVoyage = (data) => async (dispatch) => {
  dispatch({
    type: SET_DATA_VOYAGE,
    payload: { data },
  });
};

export const addDataVoyage = (data) => async (dispatch) => {
  dispatch({
    type: ADD_DATA_VOYAGE,
    payload: { data },
  });
};

export const addDataConsumeVoyage = (consume) => async (dispatch) => {
  dispatch({
    type: ADD_DATA_CONSUME_VOYAGE,
    payload: { consume },
  });
};


export const setIntegrationVoyage = (integrationVoyageSelect) => async (dispatch) => {
  dispatch({
    type: SET_INTEGRATION_VOYAGE_SELECTED,
    payload: { integrationVoyageSelect },
  });
};

export const setKickVoyageFilter = (kickVoyageFilter) => async (dispatch) => {
  dispatch({
    type: SET_VOYAGE_KICK_FILTER,
    payload: { kickVoyageFilter },
  });
};

export const setAssetIntegrationVoyageSelect = (assetSelect) => async (dispatch) => {
  dispatch({
    type: SET_INTEGRATION_ASSETS_SELECTED,
    payload: { assetSelect },
  });
};
