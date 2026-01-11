import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FleetManagerState } from '../@interface/fleet-manager';

export const useFleetManagerStore = create<FleetManagerState>()(
  persist(
    (set) => ({
      selectedMachineId: null,
      selectedVoyageId: null,
      selectedPanel: null,
      showNames: true,
      showCodes: false,
      showGeofences: true,
      mapTheme: 'default',
      showPlatforms: false,
      showBouys: false,
      showVesselsNearBouys: false,
      unitMeasureLine: 'nm',
      pointsMeasureLine: [],
      isShowPredicateRoute: false,
      isFleetbarOpen: false,

      nauticalChart: 'none',

      isNavigationIndicator: false,
      isOperationIndicator: false,
      showNameFence: false,

      // Legacy Redux states
      statusMachine: [],
      operationMachines: [],
      lastMarker: null,
      vesselsInFence: [],
      travelDetailsSelected: null,
      machineConsumptionSelected: null,
      machineCrewSelected: null,
      machineInfoSelected: null,
      machineContactSelected: null,
      machineCamerasSelected: null,
      assetVoyageSelected: null,
      routeHistory: [],
      eventsStatusHistory: [],
      routeConsumption: [],
      routeConsumptionSensors: null,
      routeIntegration: [],
      vesselIntegration: null,
      isLoadingRouteIntegration: false,

      playback: {
        isPlaying: false,
        speed: 1,
        currentTime: 0,
        startTime: null,
        endTime: null,
        historyData: [],
        isActive: false,
        type: null,
      },

      setSelectedMachineId: (id) => set({ selectedMachineId: id, selectedPanel: id ? 'details' : null }),
      setSelectedVoyageId: (id) => set({ selectedVoyageId: id, selectedPanel: id ? 'details' : null }),
      setSelectedPanel: (panel) => set({ selectedPanel: panel }),
      toggleShowNames: () => set((state) => ({ showNames: !state.showNames })),
      toggleShowCodes: () => set((state) => ({ showCodes: !state.showCodes })),
      toggleShowGeofences: () => set((state) => ({ showGeofences: !state.showGeofences })),
      setMapTheme: (theme) => set({ mapTheme: theme }),

      setShowPlatforms: (show) => set({ showPlatforms: show }),
      setShowBouys: (show) => set({ showBouys: show }),
      setShowVesselsNearBouys: (show) => set({ showVesselsNearBouys: show }),
      setUnitMeasureLine: (unit) => set({ unitMeasureLine: unit }),
      setPointsMeasureLine: (points) => set({ pointsMeasureLine: points }),
      setIsShowPredicateRoute: (show) => set({ isShowPredicateRoute: show }),
      toggleFleetbar: () => set((state) => ({ isFleetbarOpen: !state.isFleetbarOpen })),

      setNauticalChart: (chart: 'none' | 'navtor' | 'cmap' | 'cmap_relief' | 'cmap_dark' | 'nav') => set({ nauticalChart: chart }),

      setIsNavigationIndicator: (show) => set({ isNavigationIndicator: show }),
      setIsOperationIndicator: (show) => set({ isOperationIndicator: show }),
      setShowNameFence: (show) => set({ showNameFence: show }),

      // Legacy Actions
      setStatusMachine: (status) => set({ statusMachine: status }),
      setOperationMachines: (operations) => set({ operationMachines: operations }),
      setLastMarker: (marker) => set({ lastMarker: marker }),
      setVesselsInFence: (vessels) => set({ vesselsInFence: vessels }),
      setTravelDetailsSelected: (travel) => set({ travelDetailsSelected: travel }),
      setMachineConsumptionSelected: (consumption) => set({ machineConsumptionSelected: consumption }),
      setMachineCrewSelected: (crew) => set({ machineCrewSelected: crew }),
      setMachineInfoSelected: (info) => set({ machineInfoSelected: info }),
      setMachineContactSelected: (contact) => set({ machineContactSelected: contact }),
      setMachineCamerasSelected: (cameras) => set({ machineCamerasSelected: cameras }),
      setAssetVoyageSelected: (voyage) => set({ assetVoyageSelected: voyage }),
      setRouteHistory: (history) => set({ routeHistory: history }),
      setEventsStatusConsume: (events) => set({ eventsStatusHistory: events }),
      setRouteConsumption: (route) => set({ routeConsumption: route }),
      setRouteConsumptionSensors: (sensors) => set({ routeConsumptionSensors: sensors }),
      setRouteIntegration: (data) =>
        set({
          routeIntegration: data.routeIntegration,
          vesselIntegration: data.vesselIntegration,
        }),
      setIsLoadingRouteIntegration: (loading) => set({ isLoadingRouteIntegration: loading }),

      setPlaybackActive: (active, type) =>
        set((state) => ({
          playback: {
            ...state.playback,
            isActive: active,
            type: active ? type : null,
            isPlaying: active ? state.playback.isPlaying : false,
          },
        })),
      togglePlaybackPlay: () =>
        set((state) => ({
          playback: {
            ...state.playback,
            isPlaying: !state.playback.isPlaying,
          },
        })),
      setPlaybackSpeed: (speed) =>
        set((state) => ({
          playback: {
            ...state.playback,
            speed,
          },
        })),
      setPlaybackTime: (time) =>
        set((state) => ({
          playback: {
            ...state.playback,
            currentTime: time,
          },
        })),
      setPlaybackData: (data, startTime, endTime) =>
        set((state) => ({
          playback: {
            ...state.playback,
            historyData: data,
            startTime,
            endTime,
            currentTime: startTime,
          },
        })),

      reset: () =>
        set({
          selectedMachineId: null,
          selectedVoyageId: null,
          selectedPanel: null,
          showNames: true,
          showCodes: false,
          showGeofences: true,
          mapTheme: 'default',
          showPlatforms: false,
          showBouys: false,
          showVesselsNearBouys: false,
          unitMeasureLine: 'nm',
          pointsMeasureLine: [],
          isShowPredicateRoute: false,
          isFleetbarOpen: false,
          nauticalChart: 'none',
          isNavigationIndicator: false,
          isOperationIndicator: false,
          showNameFence: false,
          statusMachine: [],
          operationMachines: [],
        }),
    }),
    {
      name: 'fleet-manager-store',
      partialize: (state) => ({
        showNames: state.showNames,
        showCodes: state.showCodes,
        showGeofences: state.showGeofences,
        mapTheme: state.mapTheme,

        showPlatforms: state.showPlatforms,
        showBouys: state.showBouys,
        showVesselsNearBouys: state.showVesselsNearBouys,
        unitMeasureLine: state.unitMeasureLine,
        isShowPredicateRoute: state.isShowPredicateRoute,
        nauticalChart: state.nauticalChart,
        isNavigationIndicator: state.isNavigationIndicator,
        isOperationIndicator: state.isOperationIndicator,
        showNameFence: state.showNameFence,
      }),
    },
  ),
);
