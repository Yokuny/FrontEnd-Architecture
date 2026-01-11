export interface FleetManagerState {
  selectedMachineId: string | null;
  selectedVoyageId: string | null;
  selectedPanel: 'details' | 'crew' | 'consume' | 'info' | 'measure' | 'search' | 'options' | null;
  showNames: boolean;
  showCodes: boolean;
  showGeofences: boolean;
  mapTheme: 'default' | 'smoothdark' | 'earth' | 'rivers' | 'simple' | 'premium';

  showPlatforms: boolean;
  showBouys: boolean;
  showVesselsNearBouys: boolean;
  unitMeasureLine: 'nm' | 'm';
  pointsMeasureLine: any[];
  isShowPredicateRoute: boolean;
  isFleetbarOpen: boolean;

  // Nautical Charts
  nauticalChart: 'none' | 'navtor' | 'cmap' | 'cmap_relief' | 'cmap_dark' | 'nav';

  // Fleet Indicators
  isNavigationIndicator: boolean;
  isOperationIndicator: boolean;
  showNameFence: boolean;

  // Legacy Redux states
  statusMachine: any[];
  operationMachines: any[];
  lastMarker: any;
  vesselsInFence: any[];
  travelDetailsSelected: any;
  machineConsumptionSelected: any;
  machineCrewSelected: any;
  machineInfoSelected: any;
  machineContactSelected: any;
  machineCamerasSelected: any;
  assetVoyageSelected: any;
  routeHistory: any[];
  eventsStatusHistory: any[];
  routeConsumption: any[];
  routeConsumptionSensors: any;
  routeIntegration: any[];
  vesselIntegration: any;
  isLoadingRouteIntegration: boolean;

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
  setSelectedMachineId: (id: string | null) => void;
  setSelectedVoyageId: (id: string | null) => void;
  setSelectedPanel: (panel: FleetManagerState['selectedPanel']) => void;
  toggleShowNames: () => void;
  toggleShowCodes: () => void;
  toggleShowGeofences: () => void;
  setMapTheme: (theme: FleetManagerState['mapTheme']) => void;

  setShowPlatforms: (show: boolean) => void;
  setShowBouys: (show: boolean) => void;
  setShowVesselsNearBouys: (show: boolean) => void;
  setUnitMeasureLine: (unit: FleetManagerState['unitMeasureLine']) => void;
  setPointsMeasureLine: (points: any[]) => void;
  setIsShowPredicateRoute: (show: boolean) => void;
  toggleFleetbar: () => void;

  // Nautical Actions
  setNauticalChart: (chart: FleetManagerState['nauticalChart']) => void;

  // Fleet Indicator Actions
  setIsNavigationIndicator: (show: boolean) => void;
  setIsOperationIndicator: (show: boolean) => void;
  setShowNameFence: (show: boolean) => void;

  // Legacy Actions
  setStatusMachine: (status: any[]) => void;
  setOperationMachines: (operations: any[]) => void;
  setLastMarker: (marker: any) => void;
  setVesselsInFence: (vessels: any[]) => void;
  setTravelDetailsSelected: (travel: any) => void;
  setMachineConsumptionSelected: (consumption: any) => void;
  setMachineCrewSelected: (crew: any) => void;
  setMachineInfoSelected: (info: any) => void;
  setMachineContactSelected: (contact: any) => void;
  setMachineCamerasSelected: (cameras: any) => void;
  setAssetVoyageSelected: (voyage: any) => void;
  setRouteHistory: (history: any[]) => void;
  setEventsStatusConsume: (events: any[]) => void;
  setRouteConsumption: (route: any[]) => void;
  setRouteConsumptionSensors: (sensors: any) => void;
  setRouteIntegration: (data: { routeIntegration: any[]; vesselIntegration: any }) => void;
  setIsLoadingRouteIntegration: (loading: boolean) => void;

  // Playback Actions
  setPlaybackActive: (active: boolean, type: 'route' | 'region' | null) => void;
  togglePlaybackPlay: () => void;
  setPlaybackSpeed: (speed: number) => void;
  setPlaybackTime: (time: number) => void;
  setPlaybackData: (data: any[], startTime: number, endTime: number) => void;

  reset: () => void;
}
