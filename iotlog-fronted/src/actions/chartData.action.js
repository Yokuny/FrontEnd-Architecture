import moment from "moment";

import {
  SET_DATA_STATUS_CONSUME,
  SET_FILTER_STATUS_CONSUME,
  SET_ISLOADING_STATUS_CONSUME,
  SET_UNIT_STATUS_CONSUME
} from "./actionsTypes";
import Fetch from "../components/Fetch/Fetch";
import { ListType } from "../pages/fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";

export const getStatusConsume = (filter) => async (dispatch) => {
  dispatch({
    type: SET_ISLOADING_STATUS_CONSUME,
    payload: {
      isLoading: true,
    },
  });

  const { dateInit, dateEnd, timeInit, timeEnd, idChart } = filter;

  const dateEndFormatted = new Date(`${moment(dateEnd).format("YYYY-MM-DD")}T${timeEnd || "23:59"
}:59${moment(dateEnd).format("Z")}`)

  const querys = [
    `idChart=${idChart}`,
    `min=${moment(dateInit).format("YYYY-MM-DD")}T${timeInit || "00:00"}:00${moment(dateInit).format("Z")}`,
    `max=${moment(dateEndFormatted.getTime() < new Date().getTime() ? dateEndFormatted : new Date()).format('YYYY-MM-DDTHH:mm:ssZ')}`
  ]

  if (filter.idMachine) {
    querys.push(`idMachine=${filter.idMachine}`)
  }

  Fetch.get(
    `/sensorstate/chart/statusconsume?${querys.join("&")}`
  )
    .then((response) => {
      let data = []
      if (response.data) {
        ListType.forEach((type) => {
          const dataFiltered = response.data.filter((item) => type.accept.includes(item.status.toLowerCase()))
          const consumption = dataFiltered.reduce((acc, item) => acc + item.consumption, 0)
          if (dataFiltered.length) {
            data.push({
              status: type.value,
              statusOriginal: dataFiltered[0].status,
              consumption: consumption,
              minutes: dataFiltered.reduce((acc, item) => acc + item.minutes, 0),
              distance: dataFiltered.reduce((acc, item) => acc + item.distance, 0),
            })
          }
        })
      }
      dispatch({
        type: SET_DATA_STATUS_CONSUME,
        payload: {
          isLoading: false,
          dataStatusConsume: data || [],
          statusResponse: 200
        },
      });
    })
    .catch((e) => {
      dispatch({
        type: SET_DATA_STATUS_CONSUME,
        payload: {
          isLoading: false,
          dataStatusConsume: [],
          statusResponse: e.response?.status
        },
      });
    });

};

export const setFilterStatusConsume = (filterStatusConsume) => async (dispatch) => {
  dispatch({
    type: SET_FILTER_STATUS_CONSUME,
    payload: {
      filterStatusConsume,
    },
  });
};

export const setUnitStatusConsume = (unit) => async (dispatch) => {
  dispatch({
    type: SET_UNIT_STATUS_CONSUME,
    payload: {
      unit,
    },
  });
};

export const setDataStatusConsume = (data) => async (dispatch) => {
  dispatch({
    type: SET_DATA_STATUS_CONSUME,
    payload: {
      isLoading: false,
      dataStatusConsume:data,
    },
  });
};
