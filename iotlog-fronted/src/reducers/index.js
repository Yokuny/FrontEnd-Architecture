import { combineReducers } from 'redux';
import { settings } from './settings.reducer';
import { enterpriseFilter } from './enterpriseFilter.reducer';
import { menu } from './menu.reducer';
import { dashboard } from './dashboard.reducer';
import { notification } from './notification.reducer';
import { sensorState } from './sensorState.reducer';
import { fleet } from './fleet.reducer';
import { map } from './map.reducer';
import { voyage } from './voyage.reducer';
import { statistics } from './statistics.reducer';
import { form } from './form.reducer';
import { chartData } from './chartData.reducer'
import { formBoard } from './formBoard.reducer';
import { remoteIHMState } from './remoteIHM.reducer';

export const Reducers = combineReducers({
    settings,
    enterpriseFilter,
    menu,
    dashboard,
    notification,
    sensorState,
    fleet,
    map,
    voyage,
    statistics,
    form,
    chartData,
    formBoard,
    remoteIHMState
});
