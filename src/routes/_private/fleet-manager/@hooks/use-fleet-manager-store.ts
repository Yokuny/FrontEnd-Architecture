import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { FleetManagerState } from '../@interface/fleet-manager';

export const useFleetManagerStore = create<FleetManagerState>()(
  persist(
    (set) => ({
      activeTab: 'assets',
      selectedMachineId: null,
      selectedVoyageId: null,
      selectedPanel: null,
      searchText: '',
      showNames: true,
      showCodes: false,
      showGeofences: true,
      mapTheme: 'default',
      mapTech: 'standard',
      showPlatforms: false,
      showBouys: false,
      showVesselsNearBouys: false,
      showMeasureLine: false,
      unitMeasureLine: 'nm',
      pointsMeasureLine: [],
      isShowPredicateRoute: false,
      isSidebarOpen: false,

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

      setActiveTab: (tab) => set({ activeTab: tab }),
      setSelectedMachineId: (id) => set({ selectedMachineId: id, selectedPanel: id ? 'details' : null }),
      setSelectedVoyageId: (id) => set({ selectedVoyageId: id, selectedPanel: id ? 'details' : null }),
      setSelectedPanel: (panel) => set({ selectedPanel: panel }),
      setSearchText: (text) => set({ searchText: text }),
      toggleShowNames: () => set((state) => ({ showNames: !state.showNames })),
      toggleShowCodes: () => set((state) => ({ showCodes: !state.showCodes })),
      toggleShowGeofences: () => set((state) => ({ showGeofences: !state.showGeofences })),
      setMapTheme: (theme) => set({ mapTheme: theme }),
      setMapTech: (tech) => set({ mapTech: tech }),
      setShowPlatforms: (show) => set({ showPlatforms: show }),
      setShowBouys: (show) => set({ showBouys: show }),
      setShowVesselsNearBouys: (show) => set({ showVesselsNearBouys: show }),
      setShowMeasureLine: (show) => set({ showMeasureLine: show }),
      setUnitMeasureLine: (unit) => set({ unitMeasureLine: unit }),
      setPointsMeasureLine: (points) => set({ pointsMeasureLine: points }),
      setIsShowPredicateRoute: (show) => set({ isShowPredicateRoute: show }),
      toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),

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
          activeTab: 'assets',
          selectedMachineId: null,
          selectedVoyageId: null,
          selectedPanel: null,
          searchText: '',
          showNames: true,
          showCodes: false,
          showGeofences: true,
          mapTheme: 'default',
          mapTech: 'standard',
          showPlatforms: false,
          showBouys: false,
          showVesselsNearBouys: false,
          showMeasureLine: false,
          unitMeasureLine: 'nm',
          pointsMeasureLine: [],
          isShowPredicateRoute: false,
          isSidebarOpen: false,
        }),
    }),
    {
      name: 'fleet-manager-store',
      partialize: (state) => ({
        showNames: state.showNames,
        showCodes: state.showCodes,
        showGeofences: state.showGeofences,
        mapTheme: state.mapTheme,
        mapTech: state.mapTech,
        showPlatforms: state.showPlatforms,
        showBouys: state.showBouys,
        showVesselsNearBouys: state.showVesselsNearBouys,
        showMeasureLine: state.showMeasureLine,
        unitMeasureLine: state.unitMeasureLine,
        isShowPredicateRoute: state.isShowPredicateRoute,
      }),
    },
  ),
);
