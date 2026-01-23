import { useState } from 'react';
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import { getOptionsConfiability } from "./Options";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { findedGroupConfiabilityIndex, getGroupConfiabilityIndex } from "../Utils";
import ModalChartDetails from '../ModalChartDetails';

export default function ChartIndexConfiability(props) {

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();
  const [selectedData, setSelectedData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data } = props;

  if (!data?.length) return null;

  const vesselsDistincts = [...new Set(data?.map((item) => item.embarcacao))];


  const dataByVessel = vesselsDistincts?.map((vessel) => {
    const vesselList = data
      ?.filter((item) => item.embarcacao === vessel && !!findedGroupConfiabilityIndex(item.grupoFuncional)) || []
    const totalList = vesselList
      ?.reduce((acc, item) => acc + getGroupConfiabilityIndex(item.grupoFuncional),0);
    return {
      vessel,
      confiability: vesselList?.length ? Number((totalList / vesselList.length).toFixed(1)) : 0,
      orders: vesselList
    };
  })?.sort((a, b) => a.confiability - b.confiability);

  const handleBarClick = (event, chartContext, config) => {
    const vesselIndex = config.dataPointIndex;
    const selectedVessel = dataByVessel[vesselIndex];
    setSelectedData(selectedVessel.orders);
    setShowModal(true);
  };

  const series =
    [{
      name: 'Confiabilidade',
      data: dataByVessel.map((item) => item.confiability)
    }]

  const optionsTimes = getOptionsConfiability({
    theme,
    intl,
    series,
    themeSelected,
    vessels: dataByVessel
      ?.map((item) => data?.find((x) => x.embarcacao === item.vessel)?.assetName || item.vessel),
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
      />

      <ModalChartDetails
        show={showModal}
        onClose={() => setShowModal(false)}
        data={selectedData}
      />
    </>
  )
}
