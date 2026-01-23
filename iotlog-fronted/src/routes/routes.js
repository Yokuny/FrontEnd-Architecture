import { LayoutBasic, LayoutSmall, LayoutFullScreen } from "../layouts/LayoutWrappers";
import Home from "../pages/Home";
import AddDashboard from "../pages/dashboard/AddDashboard";
import ListDashboard from "../pages/dashboard/ListDashboard";
import MyDashboard from "../pages/dashboard/MyDashboard";
import DocIntegration from "../pages/integration/DocIntegration";
import AddMaintenance from "../pages/maintenance/preventive/plan/AddMaintenance";
import CalendarEvent from "../pages/maintenance/preventive/plan/CalendarEvent";
import MonitoringPlans from "../pages/maintenance/preventive/plan/monitoring/MonitoringPlans";
import AddMachineWear from "../pages/maintenance/preventive/wear/AddMachineWear";
import ListMachineWear from "../pages/maintenance/preventive/wear/ListMachineWear";
import FieldWear from "../pages/maintenance/preventive/wear/field/FieldWear";
import ListMyNotifications from "../pages/notifications/ListMyNotifications";
import AddRole from "../pages/permissions/roles/AddRole";
import ListRoleUsers from "../pages/permissions/roles/ListRoleUsers";
import ListRoles from "../pages/permissions/roles/ListRoles";
import AddPermissionUser from "../pages/permissions/users/AddPermissionUser";
import AddUser from "../pages/permissions/users/AddUser";
import EditUser from "../pages/permissions/users/EditUser";
import ListUsersPermissions from "../pages/permissions/users/ListUserPermissions";
import UpdatePasswordUser from "../pages/permissions/users/UpdatePasswordUser";
import UserProfile from "../pages/profile/UserProfile";
import EnterpriseAdd from "../pages/register/enterprises/EnterpriseAdd";
import EnterpriseList from "../pages/register/enterprises/EnterpriseList";
import LimitEnterprise from "../pages/register/enterprises/LimitEnterprise";
import MachineAdd from "../pages/register/machines/MachineAdd";
import MachineAlarm from "../pages/register/machines/MachineAlarm";
import MachineList from "../pages/register/machines/MachineList";
import FleetList from "../pages/register/fleet/FleetList";
import FleetAdd from "../pages/register/fleet/FleetAdd";
import ModelMachineAdd from "../pages/register/model-machines/ModelMachineAdd";
import ModelMachineList from "../pages/register/model-machines/ModelMachineList";
import PartAdd from "../pages/register/parts/PartAdd";
import PartList from "../pages/register/parts/PartList";
import PlanMaintenanceAdd from "../pages/register/plan/PlanMaintenanceAdd";
import PlanMaintenanceList from "../pages/register/plan/PlanMaintenanceList";
import SensorAdd from "../pages/register/sensors/SensorAdd";
import SensorList from "../pages/register/sensors/SensorList";
import AddConfigGlobal from "../pages/support/config/AddConfigGlobal";
import ListConfigGlobal from "../pages/support/config/ListConfigGlobal";
import OrderListManagement from "../pages/support/management/OrderListManagement";
import DetailsOrderManagement from "../pages/support/management/details/DetailsOrderManagement";
import DetailsOrders from "../pages/support/management/details/DetailsOrders";
import ListOrders from "../pages/support/request-order/ListOrders";
import NewRequestOrder from "../pages/support/request-order/NewRequestOrder";
import AddUserTeam from "../pages/support/team/AddUser";
import ListUsersTeamSupport from "../pages/support/team/ListUsers";
import AddTypeProblem from "../pages/support/type-problems/AddTypeProblem";
import ListTypeProblems from "../pages/support/type-problems/ListTypeProblems";

import DetailsOrderService from "../pages/maintenance/preventive/order-service/DetailsOrderService";
import ListOrderService from "../pages/maintenance/preventive/order-service/ListOrderService";
import MachinePartWearConfig from "../pages/maintenance/preventive/wear/config/MachinePartWearConfig";
import MonitoringWear from "../pages/maintenance/preventive/wear/monitoring/MonitoringWear";
import ListUserEnterprises from "../pages/permissions/users/ListUserEnterprise";
import EnterpriseUserIntegration from "../pages/register/enterprises/EnterpriseUserIntegration";
import ExpedientsAdd from "../pages/register/expedients/ExpedientsAdd";
import ExpedientsList from "../pages/register/expedients/ExpedientsList";
import HolidaysYearAdd from "../pages/register/holidays/HolidaysYearAdd";
import HolidaysYearList from "../pages/register/holidays/HolidaysYearList";
import MachineControlIntegration from "../pages/register/machines/MachineControlIntegration";
import ParamsAdd from "../pages/register/params/ParamsAdd";
import ParamsList from "../pages/register/params/ParamsList";
import AddPlatform from "../pages/register/platform/AddPlatform";
import ListPlatform from "../pages/register/platform/ListPlatform";
import ScaleAdd from "../pages/register/scale/ScaleAdd";
import ScaleList from "../pages/register/scale/ScaleList";
import {
  AddInPortMetadata,
  AddTravelMetadata,
  FormTravelFilledList,
  ListTravel,
} from "../pages/travel";

import { AnomalyDetectorAI, PromptAI } from "../pages/ai";
import BuoysDwellTime from "../pages/buoys-dwell-time";
import AddProcessUnit from "../pages/construtech/AddProcessUnit";
import AddUnit from "../pages/construtech/AddUnit";
import ListProcessUnit from "../pages/construtech/ListProcessUnit";
import ListUnit from "../pages/construtech/ListUnit";
import MapUnits from "../pages/construtech/MapUnits";
import {
  ConsumptionDaily,
  ConsumptionInterval,
  ConsumptionTimeOperation,
  ConsumptionComparative,
  ConsumptionCurve,
} from "../pages/consumption";
import InfoTimeOperation from "../pages/consumption/TimeOperation/Info/InfoTimeOperation";
import MyFrame from "../pages/dashboard/MyFrame";
import MyGroupDashboard from "../pages/dashboard/group/MyGroupDashboard";
import PanelDefaultView from "../pages/dashboard/panel-default";
import DownloadRequest from "../pages/download/asset";
import SimulatorCII from "../pages/esg/cii/SimulatorCII";
import FrameExternalMaintenance from "../pages/external/maintenance/FrameExternalMaintenance";
import Fleet from "../pages/fleet";
import { FleetPanel } from "../pages/fleet-panel";
import FleetStatusList from "../pages/fleet/StatusList/FleetStatusList";
import FormDashboard from "../pages/forms/Dashboard/FormDashboard";
import RVEDashboard from "../pages/forms/Dashboard/RVE";
import RVERDODashboard from "../pages/forms/Dashboard/RVERDODashboard";
import RVESoundingDashboard from "../pages/forms/Dashboard/RVESoundingDashboard";
import DowntimeList from "../pages/forms/Downtime/List";
import FillOnBoard from "../pages/forms/FillOnBoard";
import FilledListForms from "../pages/forms/Filled/FilledListForms";
import TypesForms from "../pages/forms/Filled/index";
import FasAnalytics from "../pages/forms/fas/FasAnalytics";
import FasAddRating from "../pages/forms/fas/FasRating";
import FilledListFas from "../pages/forms/fas/FilledListFas";
import FilledOs from "../pages/forms/fas/FilledOs";
import NewFAS from "../pages/forms/fas/NewFas";
import Suppliers from "../pages/forms/fas/Suppliers";
import TableListFas from "../pages/forms/fas/TableListFas";
import Goal from "../pages/goal";
import AddGoal from "../pages/goal/AddGoal";
import Group from "../pages/group";
import AddGroup from "../pages/group/AddGroup";
import { HeatmapAdd, HeatmapPanel, HeatmapView } from "../pages/heatmap";
import HeatmapAlerts from "../pages/heatmap/alerts/HeatmapAlerts";
import MachineIntegrationListAll from "../pages/integration/ListAll";
import MachineIntegration from "../pages/integration/MachineIntegration";
import MessageHistoryBuilder from "../pages/message-history-builder";
import DiagramDetails from "../pages/diagram-details";
import { PortsVesselsComing } from "../pages/ports";
import { AddAlertRegister, ListAlertRegister } from "../pages/register/alerts";
import ListArchiveFolders from "../pages/register/archive/listFolders";
import FolderView from "../pages/register/archive/viewFolder";
import BuoyList from "../pages/register/buoy";
import BuoyForm from "../pages/register/buoy/form";
import { ContractAdd, ListContract } from "../pages/register/contract";
import ListContractAssets from "../pages/register/contract/view/ListContractAssets";
import ContractView from "../pages/register/contract/view/ContractView";
import { AddCustomer, ListCustomers } from "../pages/register/customers";
import SetupApiExternal from "../pages/register/enterprises/SetupApiExternal";
import SetupChatbot from "../pages/register/enterprises/SetupChatbot";
import SetupEmailEnterprise from "../pages/register/enterprises/SetupEmailEnterprise";
import SetupFleet from "../pages/register/enterprises/SetupFleet";
import SetupSSO from "../pages/register/enterprises/SetupSSO";
import { FormAdd, FormList } from "../pages/register/forms";
import { AddGeofence, ListGeofence } from "../pages/register/geofence";
import MachineSensors from "../pages/register/machines/MachineSensors";
import MachineTreeSensors from "../pages/register/machines/MachineTreeSensors";
import Crew from "../pages/register/machines/crew";
import MachineDocs from "../pages/register/machines/docs";
import Ptax from "../pages/register/ptax";
import SensorFunctionsList from "../pages/register/sensor-functions/SensorFunctionsList";
import SensorFunctionForm from "../pages/register/sensor-functions/form";
import { AddTypeFuel, ListTypeFuel } from "../pages/register/type-fuel";
import { AddTypeUser, ListTypeUser } from "../pages/register/type-user";
import RemoteIHMView from "../pages/remote-ihm/RemoteIHMView";
import CIIFleet from "../pages/statistics/CII";
import {
  ConsumeByMachine,
  ConsumeByTravel,
  ConsumeESG,
  SetupGoalConsume,
  TotalConsume,
} from "../pages/statistics/Consumption";
import IndicatorsEEOICII from "../pages/statistics/EeoiCii";
import StatisticsTimeOperation from "../pages/statistics/TimeOperation";
import FenceReport from "../pages/statistics/FenceReport";
import Inoperability from "../pages/statistics/inoperability";
import { DashboardTrackingActivity } from "../pages/tracking-activity";
import EditConsume from "../pages/travel/EditConsume";
import AddTravelForm from "../pages/travel/add/AddTravel";
import MachineFleetConfig from "../pages/travel/config/MachineFleetConfig";
import MachineTravelConfig from "../pages/travel/config/MachineTravelConfig";
import KpisVoyage from "../pages/travel/kpis/dashboard/KpisVoyage";
import VoyageIntegration from "../pages/voyage-integration";
import { PerformancePanel } from "../pages/performance";
import KPISCMMS from "../pages/maintenance/cmms/KPISCMMS";
import SensorMinMax from "../pages/sensors/SensorMinMax";
import OperationalDashboard from "../pages/forms/Dashboard/Operational";
import DataLogger from "../pages/datalogger";
import Routering from "../pages/fleet/Routering";
import DiagramList from './../pages/diagram-list/index';
import NotificationsDashboard from "../pages/notifications/NotificationsDashboard";
import OEE from "../pages/oee";
import { FleetCardsPanel } from "../pages/fleet-cards-panel";
import Operations from "../pages/operations";

const itens = [
  {
    path: "/",
    layout: LayoutBasic,
    component: Home,
  },
  {
    path: "/home",
    layout: LayoutBasic,
    component: Home,
  },
  {
    path: "/list-orders-support",
    layout: LayoutBasic,
    component: ListOrders,
  },
  {
    path: "/new-order-support",
    layout: LayoutBasic,
    component: NewRequestOrder,
  },
  {
    path: "/list-team",
    layout: LayoutBasic,
    component: ListUsersTeamSupport,
  },
  {
    path: "/add-user-team",
    layout: LayoutBasic,
    component: AddUserTeam,
  },
  {
    path: "/management-support",
    layout: LayoutBasic,
    component: OrderListManagement,
  },
  {
    path: "/details-order-management",
    layout: LayoutBasic,
    component: DetailsOrderManagement,
  },
  {
    path: "/details-order",
    layout: LayoutBasic,
    component: DetailsOrders,
  },
  {
    path: "/list-type-problems",
    layout: LayoutBasic,
    component: ListTypeProblems,
  },
  {
    path: "/add-type-problem",
    layout: LayoutBasic,
    component: AddTypeProblem,
  },
  {
    path: "/config-support",
    layout: LayoutBasic,
    component: AddConfigGlobal,
  },
  {
    path: "/list-config-support",
    layout: LayoutBasic,
    component: ListConfigGlobal,
  },
  {
    path: "/unit-add",
    layout: LayoutBasic,
    component: AddUnit,
  },
  {
    path: "/unit-list",
    layout: LayoutBasic,
    component: ListUnit,
  },
  {
    path: "/unit-map",
    layout: LayoutBasic,
    component: MapUnits,
  },
  {
    path: "/process-add",
    layout: LayoutBasic,
    component: AddProcessUnit,
  },
  {
    path: "/process-list",
    layout: LayoutBasic,
    component: ListProcessUnit,
  },
  {
    path: "/list-users-permission",
    layout: LayoutBasic,
    component: ListUsersPermissions,
  },
  {
    path: "/permission-user",
    layout: LayoutBasic,
    component: AddPermissionUser,
  },
  {
    path: "/add-user",
    layout: LayoutBasic,
    component: AddUser,
  },
  {
    path: "/edit-user",
    layout: LayoutBasic,
    component: EditUser,
  },
  {
    path: "/update-password-user",
    layout: LayoutBasic,
    component: UpdatePasswordUser,
  },
  {
    path: "/list-roles",
    layout: LayoutBasic,
    component: ListRoles,
  },
  {
    path: "/list-role-users",
    layout: LayoutBasic,
    component: ListRoleUsers,
  },
  {
    path: "/add-role",
    layout: LayoutBasic,
    component: AddRole,
  },
  {
    path: "/parts-list",
    layout: LayoutBasic,
    component: PartList,
  },
  {
    path: "/part-add",
    layout: LayoutBasic,
    component: PartAdd,
  },
  {
    path: "/sensors-list",
    layout: LayoutBasic,
    component: SensorList,
  },
  {
    path: "/sensor-add",
    layout: LayoutBasic,
    component: SensorAdd,
  },
  {
    path: "/sensor-functions",
    layout: LayoutBasic,
    component: SensorFunctionsList,
  },
  {
    path: "/sensor-function-form",
    layout: LayoutBasic,
    component: SensorFunctionForm,
  },
  {
    path: "/machines-list-register",
    layout: LayoutBasic,
    component: MachineList,
  },
  {
    path: "/machine-add",
    layout: LayoutBasic,
    component: MachineAdd,
  },
  {
    path: "/fleet-add",
    layout: LayoutBasic,
    component: FleetAdd,
  },
  {
    path: "/fleet-list",
    layout: LayoutBasic,
    component: FleetList,
  },
  {
    path: "/machine-alarms",
    layout: LayoutBasic,
    component: MachineAlarm,
  },
  {
    path: "/organizations-list",
    layout: LayoutBasic,
    component: EnterpriseList,
  },
  {
    path: "/organization-add",
    layout: LayoutBasic,
    component: EnterpriseAdd,
  },
  {
    path: "/my-dashboard",
    layout: LayoutSmall,
    component: MyDashboard,
  },
  {
    path: "/my-frame",
    layout: LayoutSmall,
    component: MyFrame,
  },
  {
    path: "/my-group-dashboard",
    layout: LayoutSmall,
    component: MyGroupDashboard,
  },
  {
    path: "/list-dashboard",
    layout: LayoutBasic,
    component: ListDashboard,
  },
  {
    path: "/add-dashboard",
    layout: LayoutBasic,
    component: AddDashboard,
  },
  {
    path: "/maintenance-plan-list",
    layout: LayoutBasic,
    component: PlanMaintenanceList,
  },
  {
    path: "/maintenance-plan-add",
    layout: LayoutBasic,
    component: PlanMaintenanceAdd,
  },
  {
    path: "/machine-wear-list",
    layout: LayoutBasic,
    component: ListMachineWear,
  },
  {
    path: "/machine-wear-add",
    layout: LayoutBasic,
    component: AddMachineWear,
  },
  {
    path: "/machine-wear-config",
    layout: LayoutBasic,
    component: MachinePartWearConfig,
  },
  {
    path: "/field-wear",
    layout: LayoutBasic,
    component: FieldWear,
  },
  {
    path: "/user-profile",
    layout: LayoutBasic,
    component: UserProfile,
  },
  {
    path: "/documentation-integration",
    layout: LayoutBasic,
    component: DocIntegration,
  },
  {
    path: "/monitoring-plans",
    layout: LayoutBasic,
    component: MonitoringPlans,
  },
  {
    path: "/add-maintenance",
    layout: LayoutBasic,
    component: AddMaintenance,
  },
  {
    path: "/my-notification-list",
    layout: LayoutBasic,
    component: ListMyNotifications,
  },
  {
    path: "/calendar-maintenance",
    layout: LayoutBasic,
    component: CalendarEvent,
  },
  {
    path: "/model-machine-list",
    layout: LayoutBasic,
    component: ModelMachineList,
  },
  {
    path: "/model-machine-add",
    layout: LayoutBasic,
    component: ModelMachineAdd,
  },
  {
    path: "/machine-control",
    layout: LayoutBasic,
    component: MachineControlIntegration,
  },
  {
    path: "/machine-sensors",
    layout: LayoutBasic,
    component: MachineSensors,
  },
  {
    path: "/params-list",
    layout: LayoutBasic,
    component: ParamsList,
  },
  {
    path: "/params-add",
    layout: LayoutBasic,
    component: ParamsAdd,
  },
  {
    path: "/scale-list",
    layout: LayoutBasic,
    component: ScaleList,
  },
  {
    path: "/scale-add",
    layout: LayoutBasic,
    component: ScaleAdd,
  },
  {
    path: "/enterprise-user-integration",
    layout: LayoutBasic,
    component: EnterpriseUserIntegration,
  },
  {
    path: "/monitoring-wear",
    layout: LayoutBasic,
    component: MonitoringWear,
  },
  {
    path: "/list-os-done",
    layout: LayoutBasic,
    component: ListOrderService,
  },
  {
    path: "/os-details",
    layout: LayoutBasic,
    component: DetailsOrderService,
  },
  {
    path: "/expedients-list",
    layout: LayoutBasic,
    component: ExpedientsList,
  },
  {
    path: "/expedients-add",
    layout: LayoutBasic,
    component: ExpedientsAdd,
  },
  {
    path: "/holidays-list",
    layout: LayoutBasic,
    component: HolidaysYearList,
  },
  {
    path: "/holidays-add",
    layout: LayoutBasic,
    component: HolidaysYearAdd,
  },
  {
    path: "/list-user-enterprises",
    layout: LayoutBasic,
    component: ListUserEnterprises,
  },
  {
    path: "/list-travel",
    layout: LayoutBasic,
    component: ListTravel,
  },
  {
    path: "/add-travel",
    layout: LayoutBasic,
    component: AddTravelForm,
  },
  {
    path: "/config-machine-travel",
    layout: LayoutBasic,
    component: MachineTravelConfig,
  },
  {
    path: "/setup-email",
    layout: LayoutBasic,
    component: SetupEmailEnterprise,
  },
  {
    path: "/add-travel-metadata",
    layout: LayoutBasic,
    component: AddTravelMetadata,
  },
  {
    path: "/add-maneuver-metadata",
    layout: LayoutBasic,
    component: AddInPortMetadata,
  },
  {
    path: "/add-geofence",
    layout: LayoutBasic,
    component: AddGeofence,
  },
  {
    path: "/list-geofence",
    layout: LayoutBasic,
    component: ListGeofence,
  },
  {
    path: "/add-platform",
    layout: LayoutBasic,
    component: AddPlatform,
  },
  {
    path: "/list-platform",
    layout: LayoutBasic,
    component: ListPlatform,
  },
  {
    path: "/form-add",
    layout: LayoutBasic,
    component: FormAdd,
  },
  {
    path: "/form-list",
    layout: LayoutBasic,
    component: FormList,
  },
  {
    path: "/fleet-manager",
    layout: LayoutFullScreen,
    component: Fleet,
  },
  {
    path: "/dashboard-tracking-activity",
    layout: LayoutBasic,
    component: DashboardTrackingActivity,
  },
  {
    path: "/organization-limits",
    layout: LayoutBasic,
    component: LimitEnterprise,
  },
  {
    path: "/view-list-alarms",
    layout: LayoutBasic,
    component: ListAlertRegister,
  },
  {
    path: "/add-alarm",
    layout: LayoutBasic,
    component: AddAlertRegister,
  },
  {
    path: "/fleet-status",
    layout: LayoutBasic,
    component: FleetStatusList,
  },
  {
    path: "/setup-chatbot",
    layout: LayoutBasic,
    component: SetupChatbot,
  },
  {
    path: "/statistics-time-operation",
    layout: LayoutBasic,
    component: StatisticsTimeOperation,
  },
  {
    path: "/fences-report",
    layout: LayoutBasic,
    component: FenceReport,
  },
  {
    path: "/setup-api-external",
    layout: LayoutBasic,
    component: SetupApiExternal,
  },
  {
    path: "/config-machine-fleet",
    layout: LayoutBasic,
    component: MachineFleetConfig,
  },
  {
    path: "/edit-consume",
    layout: LayoutBasic,
    component: EditConsume,
  },
  {
    path: "/statistics-total-consume",
    layout: LayoutBasic,
    component: TotalConsume,
  },
  {
    path: "/statistics-by-machine-consume",
    layout: LayoutBasic,
    component: ConsumeByMachine,
  },
  {
    path: "/consumption-assets",
    layout: LayoutBasic,
    component: ConsumptionInterval,
  },
  {
    path: "/statistics-by-travel-consume",
    layout: LayoutBasic,
    component: ConsumeByTravel,
  },
  {
    path: "/setup-fleet-enterprise",
    layout: LayoutBasic,
    component: SetupFleet,
  },
  {
    path: "/edit-goal-consume",
    layout: LayoutBasic,
    component: SetupGoalConsume,
  },
  {
    path: "/heat-forms-voyage",
    layout: LayoutBasic,
    component: FormTravelFilledList,
  },
  {
    path: "/add-type-user",
    layout: LayoutBasic,
    component: AddTypeUser,
  },
  {
    path: "/list-type-user",
    layout: LayoutBasic,
    component: ListTypeUser,
  },
  {
    path: "/add-type-fuel",
    layout: LayoutBasic,
    component: AddTypeFuel,
  },
  {
    path: "/list-type-fuel",
    layout: LayoutBasic,
    component: ListTypeFuel,
  },
  {
    path: "/consumption-co2",
    layout: LayoutBasic,
    component: ConsumeESG,
  },
  {
    path: "/cii-fleet",
    layout: LayoutBasic,
    component: CIIFleet,
  },
  {
    path: "/simulator-cii",
    layout: LayoutBasic,
    component: SimulatorCII,
  },
  {
    path: "/voyage-integration",
    layout: LayoutFullScreen,
    component: VoyageIntegration,
  },
  {
    path: "/customer-list",
    layout: LayoutBasic,
    component: ListCustomers,
  },
  {
    path: "/customer-add",
    layout: LayoutBasic,
    component: AddCustomer,
  },
  {
    path: "/indicators-eeoi-cii",
    layout: LayoutBasic,
    component: IndicatorsEEOICII,
  },
  {
    path: "/heatmap-fleet",
    layout: LayoutBasic,
    component: HeatmapView,
  },
  {
    path: "/heatmap-panel",
    layout: LayoutBasic,
    component: HeatmapPanel,
  },
  {
    path: "/heatmap-fleet-add",
    layout: LayoutBasic,
    component: HeatmapAdd,
  },
  {
    path: "/heatmap-fleet-alerts",
    layout: LayoutBasic,
    component: HeatmapAlerts,
  },
  {
    path: "/form-board",
    layout: LayoutBasic,
    component: TypesForms,
  },
  {
    path: "/fas",
    layout: LayoutBasic,
    component: TableListFas,
  },
  {
    path: "/new-fas",
    layout: LayoutBasic,
    component: NewFAS,
  },
  {
    path: "/filled-forms",
    layout: LayoutBasic,
    component: FilledListForms,
  },
  {
    path: "/filled-form-CMMS",
    layout: LayoutBasic,
    component: FilledListForms,
  },
  {
    path: "/filled-fas",
    layout: LayoutBasic,
    component: FilledListFas,
  },
  {
    path: "/filled-os",
    layout: LayoutBasic,
    component: FilledOs,
  },
  {
    path: "/fas-analytics",
    layout: LayoutBasic,
    component: FasAnalytics,
  },
  {
    path: "/fas-contacts",
    layout: LayoutBasic,
    component: Suppliers,
  },
  {
    path: "/fas-add-rating",
    layout: LayoutBasic,
    component: FasAddRating,
  },
  {
    path: "/contract-list",
    layout: LayoutBasic,
    component: ListContract,
  },
  {
    path: "/contract-add",
    layout: LayoutBasic,
    component: ContractAdd,
  },
  {
    path: "/contract-view",
    layout: LayoutBasic,
    component: ContractView,
  },
  {
    path: "/contract-assets-add",
    layout: LayoutBasic,
    component: ListContractAssets,
  },
  {
    path: "/fill-onboard",
    layout: LayoutBasic,
    component: FillOnBoard,
  },
  {
    path: "/dashboard-rve-rdo",
    layout: LayoutBasic,
    component: RVERDODashboard,
  },
  {
    path: "/dashboard-rve-sounding",
    layout: LayoutBasic,
    component: RVESoundingDashboard,
  },
  {
    path: "/form-dashboard-rve",
    layout: LayoutBasic,
    component: FormDashboard,
  },
  {
    path: "/frame-external-maintenance",
    layout: LayoutBasic,
    component: FrameExternalMaintenance,
  },
  {
    path: "/setup-sso",
    layout: LayoutBasic,
    component: SetupSSO,
  },
  {
    path: "/remote-ihm",
    layout: LayoutSmall,
    component: RemoteIHMView,
  },
  {
    path: "/consumption-daily",
    layout: LayoutBasic,
    component: ConsumptionDaily,
  },
  {
    path: "/consumption-curve",
    layout: LayoutBasic,
    component: ConsumptionCurve,
  },
  {
    path: "/integration-machine",
    layout: LayoutBasic,
    component: MachineIntegration,
  },
  {
    path: "/integration-list",
    layout: LayoutBasic,
    component: MachineIntegrationListAll,
  },
  {
    path: "/consumption-time-operation",
    layout: LayoutBasic,
    component: ConsumptionTimeOperation,
  },
  {
    path: "/buoys-dwell-time",
    layout: LayoutBasic,
    component: BuoysDwellTime,
  },
  {
    path: "/buoy-list",
    layout: LayoutBasic,
    component: BuoyList,
  },
  {
    path: "/buoy-form",
    layout: LayoutBasic,
    component: BuoyForm,
  },
  {
    path: "/info-time-operation",
    layout: LayoutBasic,
    component: InfoTimeOperation,
  },
  {
    path: "/info-time-operation",
    layout: LayoutBasic,
    component: InfoTimeOperation,
  },
  {
    path: "/downtime-list",
    layout: LayoutBasic,
    component: DowntimeList,
  },
  {
    path: "/prompt-ai",
    layout: LayoutBasic,
    component: PromptAI,
  },
  {
    path: "/anomaly-detector-ai",
    layout: LayoutBasic,
    component: AnomalyDetectorAI,
  },
  {
    path: "/port-vessels-coming",
    layout: LayoutBasic,
    component: PortsVesselsComing,
  },
  {
    path: "/download-data-asset-request",
    layout: LayoutBasic,
    component: DownloadRequest,
  },
  {
    path: "/goals-list",
    layout: LayoutBasic,
    component: Goal,
  },
  {
    path: "/goal",
    layout: LayoutBasic,
    component: AddGoal,
  },
  {
    path: "/ptax",
    layout: LayoutBasic,
    component: Ptax,
  },
  {
    path: "/group-list",
    layout: LayoutBasic,
    component: Group,
  },
  {
    path: "/group-add",
    layout: LayoutBasic,
    component: AddGroup,
  },
  {
    path: "/list-folders",
    layout: LayoutBasic,
    component: ListArchiveFolders,
  },
  {
    path: "/view-folder",
    layout: LayoutBasic,
    component: FolderView,
  },
  {
    path: "/fleet-panel",
    layout: LayoutSmall,
    component: FleetPanel,
  },
  {
    path: "/fleet-cards-panel",
    layout: LayoutSmall,
    component: FleetCardsPanel,
  },
  {
    path: "/panel-default-view",
    layout: LayoutSmall,
    component: PanelDefaultView,
  },
  {
    path: "/machine-tree-sensors",
    layout: LayoutBasic,
    component: MachineTreeSensors,
  },
  {
    path: "/crew-asset",
    layout: LayoutBasic,
    component: Crew,
  },
  {
    path: "/machine-docs",
    layout: LayoutBasic,
    component: MachineDocs,
  },
  {
    path: "/message-history-builder",
    layout: LayoutBasic,
    component: MessageHistoryBuilder,
  },
  {
    path: "/kpis-travel",
    layout: LayoutBasic,
    component: KpisVoyage,
  },
  {
    path: "/performance",
    layout: LayoutBasic,
    component: PerformancePanel,
  },
  {
    path: "/sensor-min-max",
    layout: LayoutBasic,
    component: SensorMinMax,
  },
  {
    path: "/diagram-details",
    layout: LayoutBasic,
    component: DiagramDetails,
  },
  {
    path: "/diagram-list",
    layout: LayoutBasic,
    component: DiagramList,
  },
  {
    path: "/kpis-cmms",
    layout: LayoutBasic,
    component: KPISCMMS,
  },
  {
    path: "/operational-dashboard-fleet",
    layout: LayoutSmall,
    component: OperationalDashboard,
  },
  {
    path: "/operational-dashboard-asset",
    layout: LayoutSmall,
    component: Inoperability,
  },
  {
    path: "/datalogger",
    layout: LayoutBasic,
    component: DataLogger,
  },
  {
    path: "/consumption-comparative",
    layout: LayoutBasic,
    component: ConsumptionComparative,
  },
  {
    path: "/route-planner",
    layout: LayoutFullScreen,
    component: Routering,
  },
  {
    path: "/notifications-dashboard",
    layout: LayoutBasic,
    component: NotificationsDashboard,
  },
  {
    path: "/oee",
    layout: LayoutBasic,
    component: OEE,
  },
  {
    path: "/dashboard-rve",
    layout: LayoutBasic,
    component: RVEDashboard,
  },
  {
    path: "/operations",
    layout: LayoutBasic,
    component: Operations,
  }
];

export default itens;
