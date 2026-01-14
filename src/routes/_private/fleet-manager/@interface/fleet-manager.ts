export interface FleetManagerState {
  selectedMachineId: string | null;
  selectedVoyageId: string | null;
  selectedPanel: 'details' | 'voyage' | 'crew' | 'consume' | 'info' | 'measure' | 'search' | 'options' | 'summary' | 'cameras' | 'contacts' | 'last-voyage' | null;
  previousPanel: FleetManagerState['selectedPanel'];
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

  // Sync States
  statusMachine: any[];
  operationMachines: any[];

  // Actions
  setSelectedMachineId: (id: string | null) => void;
  setSelectedVoyageId: (id: string | null) => void;
  setSelectedPanel: (panel: FleetManagerState['selectedPanel']) => void;
  revertPanel: () => void;
  resetSelection: () => void;
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

  // Sync Actions
  setStatusMachine: (status: any[]) => void;
  setOperationMachines: (operations: any[]) => void;

  reset: () => void;
}
