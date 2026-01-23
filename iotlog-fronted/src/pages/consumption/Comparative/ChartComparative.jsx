import ReactApexChart from "react-apexcharts";
import { getChartOptions } from "./ChartOptions";
import { useTheme } from "styled-components";
import { useThemeSelected } from "../../../components/Hooks/Theme";
import { useIntl } from "react-intl";

export default function ChartComparative(props) {

  const { consumptionReadings, unit } = props;

  const theme = useTheme();
  const intl = useIntl();
  const { isDark } = useThemeSelected();

  const chartOptions = getChartOptions({
    theme,
    consumptionReadings,
    unit,
    isDark
  });

  const chartSeries = [
    {
      name: intl.formatMessage({ id: 'manual' }),
      data: consumptionReadings?.map(reading => reading.consumptionManual.value) || []
    },
    {
      name: intl.formatMessage({ id: 'telemetry' }),
      data: consumptionReadings?.map(reading => reading.consumptionTelemetry.value) || []
    },
  ];

  return (
    <>
      <div style={{ marginTop: '1rem' }}>
        <ReactApexChart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={350}
        />
      </div>
    </>
  )
}
