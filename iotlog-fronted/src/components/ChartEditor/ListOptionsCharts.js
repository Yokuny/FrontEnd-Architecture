import BooleanChartDemo from "./Charts/Boolean/BooleanDemo";
import FailureChartDemo from "./Charts/Failure/FailureDemo";
import SensorOptions from "./OptionsBase/SensorOptions";
import BooleanChart from "./Charts/Boolean/BooleanChart";
import BasicShowWrapper from "./Wrapper/BasicShowWrapper";
import FailureChart from "./Charts/Failure/FailureChart";
import RealtimeChart from "./Charts/Realtime/RealtimeChart";
import RealtimeChartDemo from "./Charts/Realtime/RealtimeChartDemo";
import RealTimeOptions from "./Charts/Realtime/RealtimeOptions";
// import BatteryChartDemo from "./Charts/Battery/BatteryChartDemo";
// import BatteryChart from "./Charts/Battery/BatteryChart";
// import BatteryOptions from "./Charts/Battery/BatteryOptions";
// import BatteryWrapper from "./Charts/Battery/BatteryWrapper";
import GroupChart from "./Charts/Group/GroupChart";
import GroupDemo from "./Charts/Group/GroupDemo";
import GroupOptions from "./Charts/Group/GroupOptions";
import GroupWrapper from "./Charts/Group/GroupWrapper";
// import GoalDailyDemo from "./Charts/GoalDaily/GoalDailyDemo";
// import GoalDailyChart from "./Charts/GoalDaily/GoalDailyChart";
// import GoalDailyOptions from "./Charts/GoalDaily/GoalDailyOptions";
// import GoalDailyWrapper from "./Charts/GoalDaily/GoalDailyWrapper";
// import LossDailyDemo from "./Charts/LossDaily/LossDailyDemo";
// import LossDailyChart from "./Charts/LossDaily/LossDailyChart";
// import LossDailyOptions from "./Charts/LossDaily/LossDailyOptions";
// import LossDailyWrapper from "./Charts/LossDaily/LossDailyWrapper";
// import GoalOperatorOptions from "./Charts/GoalOperator/GoalOperatorOptions";
// import GoalOperatorChart from "./Charts/GoalOperator/GoalOperatorChart";
// import GoalOperatorWrapper from "./Charts/GoalOperator/GoalOperatorWrapper";
// import GoalOperatorDemo from "./Charts/GoalOperator/GoalOperatorDemo";
import TemperatureChart from "./Charts/Temperature/TemperatureChart";
import TemperatureOptions from "./Charts/Temperature/TemperatureOptions";
import TemperatureDemo from "./Charts/Temperature/TemperatureDemo";
// import GoalWorkShiftChart from "./Charts/GoalWorkShift/GoalWorkShiftChart";
// import GoalWorkShiftDemo from "./Charts/GoalWorkShift/GoalWorkShiftDemo";
// import GoalWorkShiftOptions from "./Charts/GoalWorkShift/GoalWorkShiftOptions";
// import GoalWorkShiftWrapper from "./Charts/GoalWorkShift/GoalWorkShiftWrapper";
// import LossWorkShiftDemo from "./Charts/LossWorkShift/LossWorkShiftDemo";
// import LossWorkShiftOptions from "./Charts/LossWorkShift/LossWorkShiftOptions";
// import LossWorkShiftChart from "./Charts/LossWorkShift/LossWorkShiftChart";
// import LossWorkShiftWrapper from "./Charts/LossWorkShift/LossWorkShiftWrapper";
// import LossOperatorDemo from "./Charts/LossOperator/LossOperatorDemo";
// import LossOperatorOptions from "./Charts/LossOperator/LossOperatorOptions";
// import LossOperatorWrapper from "./Charts/LossOperator/LossOperatorWrapper";
// import LossOperatorChart from "./Charts/LossOperator/LossOperatorChart";
import HistoryDemo from "./Charts/History/HistoryDemo";
import HistoryChart from "./Charts/History/HistoryChart";
import HistoryOptions from "./Charts/History/HistoryOptions";
import HistoryWrapper from "./Charts/History/HistoryWrapper";
import OnOffChart from "./Charts/OnOff/OnOffChart";
import OnOffDemo from "./Charts/OnOff/OnOffDemo";

import GroupedTemperatureChart from "./Charts/Grouped/Temperature/GroupedTemperatureChart";
import GroupedTemperatureOptions from "./Charts/Grouped/Temperature/GroupedTemperatureOptions";
import GroupedTemperatureDemo from "./Charts/Grouped/Temperature/GroupedTemperatureDemo";

import GroupedRadialGaugeChart from "./Charts/Grouped/Radial/GroupedRadialGaugeChart";
import GroupedRadialOptions from "./Charts/Grouped/Radial/GroupedRadialOptions";
import GroupedRadialGaugeDemo from "./Charts/Grouped/Radial/GroupedRadialGaugeDemo";

import GroupedRadialGaugeHalfDemo from "./Charts/Grouped/RadialHalf/GroupedRadialGaugeHalfDemo";
import GroupedRadialGaugeHalfChart from "./Charts/Grouped/RadialHalf/GroupedRadialGaugeHalfChart";

import GroupedOnOffDemo from "./Charts/Grouped/OnOff/GroupedOnOffDemo";
import GroupedOnOffChart from "./Charts/Grouped/OnOff/GroupedOnOffChart";
import GroupedOnOffOptions from "./Charts/Grouped/OnOff/GroupedOnOffOptions";

import GroupedBatteryDemo from "./Charts/Grouped/Battery/GroupedBatteryDemo";
import GroupedBatteryChart from "./Charts/Grouped/Battery/GroupedBatteryChart";
import GroupedBatteryOptions from "./Charts/Grouped/Battery/GroupedBatteryOptions";
import TankLiquidDemo from "./Charts/Grouped/TankLiquid/TankLiquidDemo";
import TankLiquidOptions from "./Charts/Grouped/TankLiquid/TankLiquidOptions";
import TankLiquidChart from "./Charts/Grouped/TankLiquid/TankLiquidChart";
import { ImageDemo } from "./Charts/Image/ImageDemo";
import { ImageChart } from "./Charts/Image/ImageChart";
import ImageOptions from "./Charts/Image/ImageOptions";
import ImageWrapper from "./Charts/Image/ImageWrapper";
// import GroupBooleanChart from "./Charts/GroupBoolean/GroupBooleanChart";
// import GroupBooleanDemo from "./Charts/GroupBoolean/GroupBooleanDemo";
// import GroupBooleanOptions from "./Charts/GroupBoolean/GroupBooleanOptions";
// import GroupBooleanWrapper from "./Charts/GroupBoolean/GroupBooleanWrapper";

import GroupedFailuresCountDemo from "./Charts/Grouped/FailuresCount/GroupedFailuresCountDemo";
import GroupedFailuresCountOptions from "./Charts/Grouped/FailuresCount/GroupedFailuresCountOptions";
import GroupedFailuresCountWrapper from "./Charts/Grouped/FailuresCount/GroupedFailuresCountWrapper";
import GroupedFailuresCountChart from "./Charts/Grouped/FailuresCount/GroupedFailuresCountChart";
// import RouteDemo from "./Charts/Route/RouteDemo";
// import RouteOptions from "./Charts/Route/RouteOptions";
// import RouteChart from "./Charts/Route/RouteChart";
// import RouteWrapper from "./Charts/Route/RouteWrapper";

import {
  ListInfoChart,
  ListInfoDemo,
  ListInfoWrapper,
  NumericChart,
  NumericDemo,
  NumericOptions,
  NumericWrapper
} from "./Charts/Simple"

import {
  RadialGaugeHalfChart,
  RadialGaugeHalfDemo,
  RadialGaugeChart,
  RadialGaugeDemo,
  RadialGaugeOptions,
  GaugeCompassChart,
  GaugeCompassDemo,
  GaugeCompassOptions,
} from "./Charts/Gauges";

import {
  // AreaSafetyDemo,
  // AreaSafetyOptions,
  // AreaSafetyChart,
  // AreaSafetyWrapper,
  // ModeCombineChart,
  // ModeCombineDemo,
  // ModeCombineOptions,
  // ModeCombineWrapper,
  ModeStatusImageChart,
  ModeStatusImageOptions,
  ModeStatusImageDemo,
} from "./Charts/Animated";

// import {
//   GroupBooleanDateDemo,
//   GroupBooleanDateOptions,
//   GroupBooleanDateChart,
//   GroupBooleanDateWrapper,
// } from "./Charts/GroupBooleanDate";
import { MapChart, MapDemo, MapOptions, MapWrapper } from "./Charts/Map";
import {
  DataTableChart,
  DataTableDemo,
  DataTableOptions,
  DataTableWrapper,
} from "./Charts/DataTable";
import ListInfoOptions from "./Charts/Simple/ListInfo/ListInfoOptions";
import { TravelChart, TravelDemo, TravelOptions, TravelWrapper } from "./Charts/Travel";
import { HistoryStatusConsumptionChart, HistoryStatusConsumptionDemo, HistoryStatusConsumptionOptions, HistoryStatusConsumptionWrapper, StatusConsumptionChart, StatusConsumptionDemo, StatusConsumptionOptions, StatusConsumptionWrapper } from "./Charts/StatusConsume";
import { ConsumeStatusDetailOptions, ConsumeStatusDetailsChart, ConsumeStatusDetailsDemo, ConsumeStatusDetailWrapper } from "./Charts/StatusConsume/Details";
import { EngineConsumeDetailOptions, EngineConsumeDetailWrapper, EngineConsumeDetailsChart, EngineConsumeDetailsDemo} from "./Charts/EnginesConsume/Details";
import { DraftVesselChart, DraftVesselDemo, DraftVesselOptions, DraftVesselWrapper } from "./Charts/DraftVessel";
import OnOffOptions from "./Charts/OnOff/OnOffOptions";
import { HistoryListChart, HistoryListOptions, HistoryListWrapper, HistoryListDemo } from './Charts/HistoryList'
import { FuelConsumptionChart, FuelConsumptionDemo, FuelConsumptionOptions, FuelConsumptionWrapper } from "./Charts/FuelConsumption";
import { BatteryChargeChart, BatteryChargeChartDemo, BatteryChargeOptions, BatteryChargeWrapper } from "./Charts/BatteryCharge";

const optionsCharts = [
  {
    groupTitle: "basic",
    items: [
      {
        chart: "numeric",
        componentDemo: NumericDemo,
        component: NumericChart,
        optionsComponent: NumericOptions,
        componentWrapper: NumericWrapper,
      },
      {
        chart: "boolean",
        componentDemo: BooleanChartDemo,
        component: BooleanChart,
        optionsComponent: SensorOptions,
        componentWrapper: BasicShowWrapper,
      },
      {
        chart: "radialgauge",
        componentDemo: RadialGaugeDemo,
        component: RadialGaugeChart,
        optionsComponent: RadialGaugeOptions,
        componentWrapper: BasicShowWrapper,
      },
      {
        chart: "radialgaugehalf",
        componentDemo: RadialGaugeHalfDemo,
        component: RadialGaugeHalfChart,
        optionsComponent: RadialGaugeOptions,
        componentWrapper: BasicShowWrapper,
      },
      {
        chart: "gaugecompass",
        componentDemo: GaugeCompassDemo,
        component: GaugeCompassChart,
        optionsComponent: GaugeCompassOptions,
        componentWrapper: BasicShowWrapper,
      },
      {
        chart: "temperaturegauge",
        componentDemo: TemperatureDemo,
        component: TemperatureChart,
        optionsComponent: TemperatureOptions,
        componentWrapper: BasicShowWrapper,
      },
      {
        chart: "mode_status_image",
        componentDemo: ModeStatusImageDemo,
        component: ModeStatusImageChart,
        optionsComponent: ModeStatusImageOptions,
        componentWrapper: BasicShowWrapper,
      },
      {
        chart: "list_info",
        componentDemo: ListInfoDemo,
        component: ListInfoChart,
        optionsComponent: ListInfoOptions,
        componentWrapper: ListInfoWrapper,
      },
      {
        chart: "image",
        componentDemo: ImageDemo,
        component: ImageChart,
        optionsComponent: ImageOptions,
        componentWrapper: ImageWrapper,
      }
    ],
  },
  {
    groupTitle: "marine",
    items: [
      {
        chart: "map",
        componentDemo: MapDemo,
        component: MapChart,
        optionsComponent: MapOptions,
        componentWrapper: MapWrapper,
        preserveSize: true,
      },
      {
        chart: "status_consume",
        componentDemo: StatusConsumptionDemo,
        component: StatusConsumptionChart,
        optionsComponent: StatusConsumptionOptions,
        componentWrapper: StatusConsumptionWrapper,
      },
      {
        chart: "status_consume_details",
        componentDemo: ConsumeStatusDetailsDemo,
        component: ConsumeStatusDetailsChart,
        optionsComponent: ConsumeStatusDetailOptions,
        componentWrapper: ConsumeStatusDetailWrapper,
      },
      {
        chart: "engines_consume_details",
        componentDemo: EngineConsumeDetailsDemo,
        component: EngineConsumeDetailsChart,
        optionsComponent: EngineConsumeDetailOptions,
        componentWrapper: EngineConsumeDetailWrapper,
      },
      {
        chart: "battery_charge",
        componentDemo: BatteryChargeChartDemo,
        component: BatteryChargeChart,
        optionsComponent: BatteryChargeOptions,
        componentWrapper: BatteryChargeWrapper,
      },
      {
        chart: "travel",
        componentDemo: TravelDemo,
        component: TravelChart,
        optionsComponent: TravelOptions,
        componentWrapper: TravelWrapper,
        preserveSize: true,
      },
      {
        chart: "vessel_draft",
        componentDemo: DraftVesselDemo,
        component: DraftVesselChart,
        optionsComponent: DraftVesselOptions,
        componentWrapper: DraftVesselWrapper,
      },
      {
        chart: "fuel_consumption",
        componentDemo: FuelConsumptionDemo,
        component: FuelConsumptionChart,
        optionsComponent: FuelConsumptionOptions,
        componentWrapper: FuelConsumptionWrapper,
      },
    ]
  },
  {
    groupTitle: "animated",
    items: [
      {
        chart: "failure",
        componentDemo: FailureChartDemo,
        component: FailureChart,
        optionsComponent: SensorOptions,
        componentWrapper: BasicShowWrapper,
      },
      {
        chart: "onoff",
        componentDemo: OnOffDemo,
        component: OnOffChart,
        optionsComponent: OnOffOptions,
        componentWrapper: BasicShowWrapper,
      },
      // {
      //   chart: "route",
      //   componentDemo: RouteDemo,
      //   component: RouteChart,
      //   optionsComponent: RouteOptions,
      //   componentWrapper: RouteWrapper,
      // },
      // {
      //   chart: "safety",
      //   componentDemo: AreaSafetyDemo,
      //   component: AreaSafetyChart,
      //   optionsComponent: AreaSafetyOptions,
      //   componentWrapper: AreaSafetyWrapper,
      // },
      // {
      //   chart: "mode_combine",
      //   componentDemo: ModeCombineDemo,
      //   component: ModeCombineChart,
      //   optionsComponent: ModeCombineOptions,
      //   componentWrapper: ModeCombineWrapper,
      // },
    ],
  },
  {
    groupTitle: "grouped",
    items: [
      {
        chart: "groupedtemperature",
        componentDemo: GroupedTemperatureDemo,
        component: GroupedTemperatureChart,
        optionsComponent: GroupedTemperatureOptions,
        componentWrapper: GroupWrapper,
      },
      {
        chart: "groupedradial",
        componentDemo: GroupedRadialGaugeDemo,
        component: GroupedRadialGaugeChart,
        optionsComponent: GroupedRadialOptions,
        componentWrapper: GroupWrapper,
      },
      {
        chart: "groupedradialhalf",
        componentDemo: GroupedRadialGaugeHalfDemo,
        component: GroupedRadialGaugeHalfChart,
        optionsComponent: GroupedRadialOptions,
        componentWrapper: GroupWrapper,
      },
      {
        chart: "groupedtankliquid",
        componentDemo: TankLiquidDemo,
        component: TankLiquidChart,
        optionsComponent: TankLiquidOptions,
        componentWrapper: GroupWrapper,
      },
      {
        chart: "groupedbattery",
        componentDemo: GroupedBatteryDemo,
        component: GroupedBatteryChart,
        optionsComponent: GroupedBatteryOptions,
        componentWrapper: GroupWrapper,
      },
      {
        chart: "groupedonoff",
        componentDemo: GroupedOnOffDemo,
        component: GroupedOnOffChart,
        optionsComponent: GroupedOnOffOptions,
        componentWrapper: GroupWrapper,
      },
      {
        chart: "groupedfailurecount",
        componentDemo: GroupedFailuresCountDemo,
        component: GroupedFailuresCountChart,
        optionsComponent: GroupedFailuresCountOptions,
        componentWrapper: GroupedFailuresCountWrapper,
      },
    ],
  },
  // {
  //   groupTitle: "production",
  //   items: [
  //     {
  //       chart: "goalworkshift",
  //       componentDemo: GoalWorkShiftDemo,
  //       component: GoalWorkShiftChart,
  //       optionsComponent: GoalWorkShiftOptions,
  //       componentWrapper: GoalWorkShiftWrapper,
  //       preserveSize: true,
  //     },
  //     {
  //       chart: "lossworkshift",
  //       componentDemo: LossWorkShiftDemo,
  //       component: LossWorkShiftChart,
  //       optionsComponent: LossWorkShiftOptions,
  //       componentWrapper: LossWorkShiftWrapper,
  //       preserveSize: true,
  //     },
  //     {
  //       chart: "goaldailymachine",
  //       componentDemo: GoalDailyDemo,
  //       component: GoalDailyChart,
  //       optionsComponent: GoalDailyOptions,
  //       componentWrapper: GoalDailyWrapper,
  //       preserveSize: true,
  //     },
  //     {
  //       chart: "lossdailymachine",
  //       componentDemo: LossDailyDemo,
  //       component: LossDailyChart,
  //       optionsComponent: LossDailyOptions,
  //       componentWrapper: LossDailyWrapper,
  //       preserveSize: true,
  //     },
  //     {
  //       chart: "goaldailyoperator",
  //       componentDemo: GoalOperatorDemo,
  //       component: GoalOperatorChart,
  //       optionsComponent: GoalOperatorOptions,
  //       componentWrapper: GoalOperatorWrapper,
  //       preserveSize: true,
  //     },
  //     {
  //       chart: "lossoperator",
  //       componentDemo: LossOperatorDemo,
  //       component: LossOperatorChart,
  //       optionsComponent: LossOperatorOptions,
  //       componentWrapper: LossOperatorWrapper,
  //       preserveSize: true,
  //     },
  //   ],
  // },
  {
    groupTitle: "graphic",
    items: [
      {
        chart: "historymachine",
        componentDemo: HistoryDemo,
        component: HistoryChart,
        optionsComponent: HistoryOptions,
        componentWrapper: HistoryWrapper,
        preserveSize: true,
      },
      {
        chart: "realtime",
        componentDemo: RealtimeChartDemo,
        component: RealtimeChart,
        optionsComponent: RealTimeOptions,
        componentWrapper: BasicShowWrapper,
        preserveSize: true,
      },
      {
        chart: "groupmachine",
        componentDemo: GroupDemo,
        component: GroupChart,
        optionsComponent: GroupOptions,
        componentWrapper: GroupWrapper,
        preserveSize: true,
      },
      {
        chart: "historylist",
        componentDemo: HistoryListDemo,
        component: HistoryListChart,
        optionsComponent: HistoryListOptions,
        componentWrapper: HistoryListWrapper,
        preserveSize: true,
      },
      {
        chart: "history_status_consumption",
        componentDemo: HistoryStatusConsumptionDemo,
        component: HistoryStatusConsumptionChart,
        optionsComponent: HistoryStatusConsumptionOptions,
        componentWrapper: HistoryStatusConsumptionWrapper,
        preserveSize: true,
      },
      // {
      //   chart: "countbooleanchart",
      //   componentDemo: GroupBooleanDemo,
      //   component: GroupBooleanChart,
      //   optionsComponent: GroupBooleanOptions,
      //   componentWrapper: GroupBooleanWrapper,
      //   preserveSize: true,
      // },
      // {
      //   chart: "countbooleandatechart",
      //   componentDemo: GroupBooleanDateDemo,
      //   component: GroupBooleanDateChart,
      //   optionsComponent: GroupBooleanDateOptions,
      //   componentWrapper: GroupBooleanDateWrapper,
      //   preserveSize: true,
      // },
      // {
      //   chart: "xy",
      //   componentDemo: GroupBooleanDateDemo,
      //   component: XYChart,
      //   optionsComponent: XYOptions,
      //   componentWrapper: BasicShowWrapper,
      //   preserveSize: true,
      // },

    ],
  },
  {
    groupTitle: "other",
    items: [
      {
        chart: "datatable",
        componentDemo: DataTableDemo,
        component: DataTableChart,
        optionsComponent: DataTableOptions,
        componentWrapper: DataTableWrapper,
        preserveSize: true,
      },
    ],
  },
];

export default optionsCharts;
