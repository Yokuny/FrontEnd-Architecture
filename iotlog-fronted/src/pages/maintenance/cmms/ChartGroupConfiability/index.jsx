import { useState } from 'react';
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import { getOptionsGroupConfiability } from "./Options";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { findedGroupConfiabilityIndex, getGroupConfiabilityIndex } from "../Utils";
import ModalChartDetails from '../ModalChartDetails';

export default function ChartGroupConfiability(props) {

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();
  const [selectedData, setSelectedData] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const { data } = props;

  if (!data?.length) return null;

  const groupsDistincts = [...new Set(data?.map((item) => item.grupoFuncional))]
    ?.filter((group) => !!findedGroupConfiabilityIndex(group));

  const dataByGroup = groupsDistincts
    ?.map((group) => {
      const groupOrders = data?.filter((item) => item.grupoFuncional === group) || [];
      return {
        group,
        confiability: Number(getGroupConfiabilityIndex(group)),
        orders: groupOrders
      };
    })?.sort((a, b) => a.confiability - b.confiability).filter(item => item.confiability !== 0);

  const handleBarClick = (event, chartContext, config) => {
    const groupIndex = config.dataPointIndex;
    const selectedGroup = dataByGroup[groupIndex];
    setSelectedData(selectedGroup.orders);
    setShowModal(true);
  };

  const series = [{
    name: 'Confiabilidade',
    data: dataByGroup.map((item) => item.confiability)
  }];

  const optionsTimes = getOptionsGroupConfiability({
    theme,
    intl,
    series,
    themeSelected,
    groups: dataByGroup?.map((item) => item.group),
    events: {
      dataPointSelection: handleBarClick
    }
  });

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
