import { Fetch } from "../components/Fetch";
import { SET_ISLOADING_LAST_SENSOR_STATE, SET_LAST_SENSOR_STATE } from "./actionsTypes";

export const getLastStatesSensorByMachines = (machines) => async (dispatch) => {
  if (!machines?.filter(x => x)?.length) {
    return;
  }

  dispatch({
    type: SET_ISLOADING_LAST_SENSOR_STATE,
    payload: { isLoading: true },
  });

  Fetch
    .get(`/sensorstate/last/machines?${machines?.filter(x => x)?.map((x,i) => `idMachines[]=${x}`)?.join('&')}`)
    .then(response => {
      dispatch({
        type: SET_LAST_SENSOR_STATE,
        payload: { isLoading: false, list: response.data },
      });
    })
    .catch(e => {
      dispatch({
        type: SET_LAST_SENSOR_STATE,
        payload: { isLoading: false, list: [] },
      });
    })
};
