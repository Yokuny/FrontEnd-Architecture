import { toast } from "react-toastify";
import { Fetch } from "../components";
import { ADD_EMPTY_GENERATOR, ADD_EMPTY_THRUSTER, SET_FILTER_IHM, SET_FIRST_FETCH_FLAG, SET_IHM_DATA, SET_IHM_SENSOR_LIST, SET_IS_EDITING_IHM, SET_IS_LOADING_IHM } from "./actionsTypes";
import { translate } from "../components/language";
import { IHM_SENSOR_TYPE, TYPE_DIAGRAM } from "../constants";

const uuid = require("uuid").v4;

const emptyEngineV16 = {
  typeIHM: TYPE_DIAGRAM.ENGINEV16,
  sensors: [
    ...new Array(16).fill().map((_, i) => ({
      typeSensor: IHM_SENSOR_TYPE.TEMPERATURE,
      index: i + 1,
      idSensor: "0",
    })),
    ...new Array(2).fill().map((_, i) => ({
      typeSensor: IHM_SENSOR_TYPE.TURBO_CHARGER_SPEED,
      index: i + 1,
      label: `TurboCharger ${i + 1} Speed`,
      idSensor: "0",
    })),
    {
      typeSensor: IHM_SENSOR_TYPE.STATUS,
      idSensor: "0",
    },
    {
      typeSensor: IHM_SENSOR_TYPE.SPEED,
      idSensor: "0",
    },
  ],
}

const emptyGenerator = {
  typeIHM: TYPE_DIAGRAM.PMS,
  sensors: [
    ...new Array(12).fill().map((_, i) => ({
      typeSensor: IHM_SENSOR_TYPE.TEMPERATURE,
      index: i + 1,
      idSensor: "0",
    })),
    {
      typeSensor: IHM_SENSOR_TYPE.STATUS,
      idSensor: "0",
    },
    {
      typeSensor: IHM_SENSOR_TYPE.LOAD,
      idSensor: "0",
    },
  ],
}

const emptyThruster = {
  typeIHM: TYPE_DIAGRAM.AZIMUTAL,
  sensors: [
    ...new Array(2).fill().map((_, i) => ({
      typeSensor: IHM_SENSOR_TYPE.AZIMUTH_INFO,
      index: i + 1,
      label: "vazio",
      idSensor: "0",
      unit: "vazio",
    })),
    {
      typeSensor: IHM_SENSOR_TYPE.STATUS,
      idSensor: "0",
    },
  ],
}

export const setFilterIHM = (filter) => async (dispatch) => {
  dispatch({
    type: SET_FILTER_IHM,
    payload: {
      ...filter,
    },
  });
};

export const setIsEditingIHM = (isEditing) => async (dispatch) => {
  dispatch({
    type: SET_IS_EDITING_IHM,
    payload: isEditing,
  });
};

export const setRemoteIHMData = (ihmData) => async (dispatch) => {
  dispatch({
    type: SET_IHM_DATA,
    payload: ihmData,
  });
};

export const addEmptyGenerator = () => async (dispatch, getState) => {
  const { dataIHM } = getState().remoteIHMState;
  let lastIndex = 0
  if (dataIHM && dataIHM.length > 0)
    lastIndex = dataIHM?.reduce((prev, current) => (prev && prev.index > current.index) ? prev : current).index
  dispatch({
    type: ADD_EMPTY_GENERATOR,
    payload: [
      ...dataIHM,
      {
        ...emptyGenerator,
        key: uuid(),
        index: lastIndex + 1,
        label: `G${lastIndex + 1}`
      },
    ]
  });
};

export const addEmptyEngineV16 = () => async (dispatch, getState) => {
  const { dataIHM } = getState().remoteIHMState;
  let lastIndex = 0
  if (dataIHM && dataIHM.length > 0)
    lastIndex = dataIHM?.reduce((prev, current) => (prev && prev.index > current.index) ? prev : current).index
  dispatch({
    type: ADD_EMPTY_GENERATOR,
    payload: [
      ...dataIHM,
      {
        ...emptyEngineV16,
        key: uuid(),
        index: lastIndex + 1,
        label: `G${lastIndex + 1}`
      },
    ]
  });
};

export const addEmptyThruster = () => async (dispatch, getState) => {
  const { dataIHM } = getState().remoteIHMState;

  const emptyThruster = {
    typeIHM: TYPE_DIAGRAM.AZIMUTAL,
    sensors: [
      ...new Array(2).fill().map((_, i) => ({
        typeSensor: IHM_SENSOR_TYPE.AZIMUTH_INFO,
        index: i + 1,
        label: "vazio",
        idSensor: "0",
        unit: "vazio",
      })),
      {
        typeSensor: IHM_SENSOR_TYPE.STATUS,
        idSensor: "0",
      },
    ],
  };

  let lastIndex = 0
  if (dataIHM && dataIHM.length > 0) {
    lastIndex = dataIHM?.reduce((prev, current) => (prev && prev.index > current.index) ? prev : current).index
  }

  dispatch({
    type: ADD_EMPTY_THRUSTER,
    payload: [
      ...dataIHM,
      {
        ...emptyThruster,
        key: uuid(),
        index: lastIndex + 1,
        label: `AT${lastIndex + 1}`
      },
    ]
  });
};

export const addEmptyBowThruster = () => async (dispatch, getState) => {
  const { dataIHM } = getState().remoteIHMState;

  let lastIndex = 0
  if (dataIHM && dataIHM.length > 0) {
    lastIndex = dataIHM?.reduce((prev, current) => (prev && prev.index > current.index) ? prev : current).index
  }

  const emptyThruster = {
    typeIHM: TYPE_DIAGRAM.BOW_THRUSTER,
    sensors: [
      ...new Array(2).fill().map((_, i) => ({
        typeSensor: IHM_SENSOR_TYPE.BOW_THRUSTER_INFO,
        index: i + 1,
        label: "vazio",
        idSensor: "0",
        unit: "vazio",
      })),
      {
        typeSensor: IHM_SENSOR_TYPE.STATUS,
        idSensor: "0",
      },
    ]
  };

  dispatch({
    type: ADD_EMPTY_THRUSTER,
    payload: [
      ...dataIHM,
      {
        ...emptyThruster,
        key: uuid(),
        index: lastIndex + 1,
        label: `BT${lastIndex + 1}`
      },
    ]
  });
};

export const setIsLoading = (isLoading) => async (dispatch) => {
  dispatch({
    type: SET_IS_LOADING_IHM,
    payload: isLoading,
  });
};

export const resetFirstFetch = () => async (dispatch) => {
  dispatch({
    type: SET_FIRST_FETCH_FLAG,
    payload: true,
  });
};

export const fetchRemoteIHMData = () => async (dispatch, getState) => {
  const { filterIHM, isFirstFetch } = getState().remoteIHMState;
  const { enterprises } = getState().enterpriseFilter;

  if (!filterIHM.machine) {
    dispatch(setRemoteIHMData(undefined))
    return
  }

  if (isFirstFetch) {
    dispatch(setIsLoading(true));
    dispatch({ type: SET_FIRST_FETCH_FLAG, payload: false });
  }

  let url = `/remote-ihm/machine`

  const idEnterpriseFilter = enterprises?.length
    ? enterprises[0].id
    : "";
  if (idEnterpriseFilter) {
    url += `?idEnterprise=${idEnterpriseFilter}`;
  }
  url += `&idMachine=${filterIHM.machine?.value}`;
  url += `&typeIHM=${filterIHM.diagram?.value}`;

  Fetch.get(url)
    .then((response) => {
      dispatch(setRemoteIHMData(response.data));
      dispatch(setIsLoading(false));
    })
    .catch((e) => {
      dispatch(setIsLoading(false));
    });
};

export const setIHMSensorList = (sensorList) => async (dispatch) => {
  dispatch({
    type: SET_IHM_SENSOR_LIST,
    payload: sensorList,
  });
}

export const getSensorsRemoteIHM = () => async (dispatch, getState) => {
  const { filterIHM } = getState().remoteIHMState;
  Fetch.get(`/machine/sensors?id=${filterIHM.machine?.value}`)
    .then((response) => {
      dispatch(setIHMSensorList((response.data || [])?.map((x) => ({
        value: x.sensorId,
        sensorKey: x.id,
        label: `${x.sensor} (${x.sensorId})`,
        title: x.sensor,
        id: x.id,
        type: x.type
      }))?.sort((a, b) => a?.label?.localeCompare(b?.label))));
    })
    .catch((e) => {
      dispatch(setIHMSensorList([]));
    });
};

export const saveRemoteIHM = () => async (dispatch, getState) => {
  const { dataIHM, isEditing, filterIHM } = getState().remoteIHMState;
  const { enterprises } = getState().enterpriseFilter;
  let url = `/remote-ihm/`;
  let remoteIHMDataToSave;
  dispatch(setIsLoading(true));

  const idEnterpriseFilter = enterprises?.length
    ? enterprises[0].id
    : "";
  if (idEnterpriseFilter) {
    url += `?idEnterprise=${idEnterpriseFilter}`;
  }
  url += `&idMachine=${filterIHM.machine?.value}`;
  url += `&typeIHM=${filterIHM.diagram?.value}`;

  if (filterIHM.diagram.value === TYPE_DIAGRAM.UNIFILAR || filterIHM.diagram.value === TYPE_DIAGRAM.UNIFILAR_4DG) {
    const gen = dataIHM.generators.map((generator) => {
      return {
        index: generator.index,
        label: generator.label,
        idSensor: generator.sensor?.sensorId,
        idSensorSwitch: generator.sensorSwitch?.sensorId,
        info: generator.info,
      }
    })
    remoteIHMDataToSave = {
      idMachine: dataIHM.idMachine,
      idEnterprise: dataIHM.idEnterprise,
      typeIHM: dataIHM.typeIHM,
      generators: gen.filter((g) => !!g),
      thrusters: dataIHM.thrusters.map((thruster) => ({
        index: thruster.index,
        label: thruster.label,
        idSensor: thruster.sensor.sensorId,
        idSensorSwitch: thruster.sensorSwitch.sensorId,
        info: thruster.info
      })),
      bus: dataIHM.bus,
      info: dataIHM.info,
      info2: dataIHM.info2
    }
  } else {
    remoteIHMDataToSave = dataIHM;
  }

  Fetch.post(url, remoteIHMDataToSave)
    .then(() => {
      dispatch(setIsEditingIHM(!isEditing))
      toast.success(translate("save.successfull"));
      dispatch(fetchRemoteIHMData())
    })
    .catch((e) => {
      dispatch(setIsLoading(false));
    });
};

export const fetchRemoteIHMPMSData = () => async (dispatch, getState) => {
  const { filterIHM } = getState().remoteIHMState;
  const { enterprises } = getState().enterpriseFilter;

  if (!filterIHM.machine) {
    dispatch(setRemoteIHMData(undefined))
    return
  }

  dispatch(setIsLoading(true));

  let url = `/remote-ihm/machine`

  const idEnterpriseFilter = enterprises?.length
    ? enterprises[0].id
    : "";
  if (idEnterpriseFilter) {
    url += `?idEnterprise=${idEnterpriseFilter}`;
  }
  url += `&idMachine=${filterIHM.machine?.value}`;

  Fetch.get(url)
    .then((response) => {
      dispatch(setRemoteIHMData(response.data));
      dispatch(setIsLoading(false));
    })
    .catch((e) => {
      dispatch(setIsLoading(false));
    });
};
