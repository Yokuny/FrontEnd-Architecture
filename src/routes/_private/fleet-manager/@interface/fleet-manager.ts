export interface FleetManagerState {
  activeTab: 'assets' | 'voyages';
  selectedMachineId: string | null;
  selectedVoyageId: string | null;
  selectedPanel: 'details' | 'crew' | 'consume' | 'info' | 'measure' | null;
  searchText: string;
  showNames: boolean;
  showCodes: boolean;
  showGeofences: boolean;
  mapTheme: 'default' | 'smoothdark' | 'earth' | 'rivers' | 'simple' | 'premium';
  mapTech: 'standard' | 'windy';
  showPlatforms: boolean;
  showBouys: boolean;
  showVesselsNearBouys: boolean;
  showMeasureLine: boolean;
  unitMeasureLine: 'nm' | 'm';
  pointsMeasureLine: any[];
  isShowPredicateRoute: boolean;
  isSidebarOpen: boolean;

  // Playback Context
  playback: {
    isPlaying: boolean;
    speed: number;
    currentTime: number; // timestamp in ms
    startTime: number | null;
    endTime: number | null;
    historyData: any[]; // [timestamp, lat, lng][]
    isActive: boolean;
    type: 'route' | 'region' | null;
  };

  // Actions
  setActiveTab: (tab: 'assets' | 'voyages') => void;
  setSelectedMachineId: (id: string | null) => void;
  setSelectedVoyageId: (id: string | null) => void;
  setSelectedPanel: (panel: FleetManagerState['selectedPanel']) => void;
  setSearchText: (text: string) => void;
  toggleShowNames: () => void;
  toggleShowCodes: () => void;
  toggleShowGeofences: () => void;
  setMapTheme: (theme: FleetManagerState['mapTheme']) => void;
  setMapTech: (tech: FleetManagerState['mapTech']) => void;
  setShowPlatforms: (show: boolean) => void;
  setShowBouys: (show: boolean) => void;
  setShowVesselsNearBouys: (show: boolean) => void;
  setShowMeasureLine: (show: boolean) => void;
  setUnitMeasureLine: (unit: FleetManagerState['unitMeasureLine']) => void;
  setPointsMeasureLine: (points: any[]) => void;
  setIsShowPredicateRoute: (show: boolean) => void;
  toggleSidebar: () => void;

  // Playback Actions
  setPlaybackActive: (active: boolean, type: 'route' | 'region' | null) => void;
  togglePlaybackPlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setPlaybackTime: (time: number) => void;
  setPlaybackData: (data: any[], startTime: number, endTime: number) => void;

  reset: () => void;
}
