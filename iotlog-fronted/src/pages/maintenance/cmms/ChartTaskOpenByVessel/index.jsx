import { useState } from 'react';
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import { nanoid } from 'nanoid';
import { getOptionsTasksOpen } from "./Options";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import ModalChartDetails from '../ModalChartDetails';

export default function ChartTaskOpenByVessel(props) {

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();
  const [selectedData, setSelectedData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data } = props;

  if (!data?.length) return null;

  const vesselsDistincts = [...new Set(data?.map((item) => item.embarcacao))];
  const maintenanceTypeDistincts = [...new Set(data?.map((item) => item.tipoManutencao))];

  const series = maintenanceTypeDistincts.map((tipo) => {
    const vesselData = data?.filter((item) => item.tipoManutencao === tipo);
    return {
      name: vesselData[0]?.tipoManutencao,
      data: vesselsDistincts.map((vessel) => vesselData?.filter((item) => item.embarcacao === vessel)?.length || 0)
    };
  })?.sort((a,b) => a.name?.localeCompare(b.name));

  const handleBarClick = (event, chartContext, config) => {
    const vesselIndex = config.dataPointIndex;
    const typeIndex = config.seriesIndex;
    const selectedVessel = vesselsDistincts[vesselIndex];
    const selectedType = maintenanceTypeDistincts[typeIndex];

    const filteredData = data?.filter(
      item => item.embarcacao === selectedVessel &&
              item.tipoManutencao === selectedType
    );

    setSelectedData(filteredData);
    setShowModal(true);
  };

  const optionsTimes = getOptionsTasksOpen({
    theme,
    intl,
    series,
    themeSelected,
    vessels: vesselsDistincts
      ?.map((item) => data?.find((x) => x.embarcacao === item)?.assetName || item),
    events: {
      dataPointSelection: handleBarClick
    }
  })

  return (
    <>
      <ReactApexCharts
        options={optionsTimes}
        series={series}
        type='bar'
        height={350}
        key={nanoid(4)}
      />

      <ModalChartDetails
        show={showModal}
        onClose={() => setShowModal(false)}
        data={selectedData}
      />
    </>
  )
}
