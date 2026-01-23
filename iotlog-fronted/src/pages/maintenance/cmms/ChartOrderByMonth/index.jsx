import React, { useState } from 'react';
import Chart from 'react-apexcharts';
import { useIntl } from 'react-intl';
import { nanoid } from 'nanoid';
import { useTheme } from 'styled-components';
import { useThemeSelected } from '../../../../components/Hooks/Theme';
import ModalChartDetails from '../ModalChartDetails';
import { getChartOptions, processChartData } from './Options';

const ChartOrderByMonth = ({ data }) => {
  const theme = useTheme();
  const { isDark } = useThemeSelected();
  const [selectedData, setSelectedData] = useState(null);
  const intl = useIntl();

  const chartData = processChartData(data, intl);

  const handleBarClick = (event, chartContext, config) => {
    const monthIndex = config.dataPointIndex;
    const seriesIndex = config.seriesIndex;
    const selectedMonth = chartData.categories[monthIndex];

    const [monthAbbr, year] = selectedMonth.split('-');

    const monthMap = {
      'Jan': 0, 'Fev': 1, 'Mar': 2, 'Abr': 3, 'Mai': 4, 'Jun': 5,
      'Jul': 6, 'Ago': 7, 'Set': 8, 'Out': 9, 'Nov': 10, 'Dez': 11
    };

    const monthNumber = monthMap[monthAbbr];

    const filteredData = data.filter(item => {
      if (!item.dataAbertura) return false;

      const date = new Date(item.dataAbertura);
      const itemMonth = date.getMonth();
      const itemYear = date.getFullYear().toString();
      const isCompleted = !!item.dataConclusao;

      return itemMonth === monthNumber &&
             itemYear === year &&
             isCompleted === (seriesIndex === 0);
    });

    setSelectedData(filteredData);
  };

  const options = getChartOptions({
    theme,
    isDark,
    chartData,
    events: {
      dataPointSelection: handleBarClick
    },
    intl
  });

  return (
    <>
      <Chart
        options={options}
        series={chartData.series}
        type="line"
        height={350}
        key={nanoid(5)}
      />

      {!!selectedData && <ModalChartDetails
        show={!!selectedData}
        onClose={() => setSelectedData(null)}
        data={selectedData}
      />}
    </>
  );
};

export default ChartOrderByMonth;
