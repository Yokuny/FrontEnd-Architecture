import React from "react";
import ReactEChartsCore from "echarts-for-react/lib/core";
import Row from "@paljs/ui/Row";
import { PieChart } from "echarts/charts";
import { LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { useTheme } from "styled-components";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { TextSpan } from "../../../../components";
import ModalChartDetails from "../ModalChartDetails";

export default function ChartPie(props) {
  const { themeColors, descriptionValues, series, title, unitLabel = "total", dataByType } = props;
  const [showModal, setShowModal] = React.useState(false);
  const [selectedData, setSelectedData] = React.useState([]);

  const theme = useTheme();

  const handleChartClick = (params) => {
    if (!dataByType) return;
    
    const clickedName = params.name;
    setSelectedData(dataByType[clickedName] || []);
    setShowModal(true);
  };

  const getOption = () => {
    return {
      darkMode: theme?.isDark,
      textStyle: {
        fontFamily: theme.fontFamilyPrimary,
      },
      color: themeColors?.map(x => theme[`color${x}500`]) || [],
      tooltip: {
        trigger: "item",
        formatter: (item) => `
          <strong>${item.marker} ${item.name}</strong>  <i>${floatToStringExtendDot(item.percent, 2)}%</i><br />
           ${parseInt(item.value)} <i>${unitLabel}</i><br />`,
        fontSize: 12,
        backgroundColor: theme.backgroundBasicColor1,
        textStyle: {
          color: theme.textBasicColor,
        },
      },
      label: {
        show: true,
        formatter: (value) => `${floatToStringExtendDot(value.percent, 1)} %`,
        position: "inside",
        fontSize: 13,
        fontWeight: "bold",
        color: theme.textBasicColor,
      },
      legend: {
        show: true,
        textStyle: {
          color: theme.textBasicColor,
          fontSize: 12,
        },
        z: 4,
        top: "77%",
      },
      series: [
        {
          type: "pie",
          radius: ['40%', '60%'],
          center: ["50%", "40%"],
          data: series?.map((item, index) => ({
            value: item,
            name: descriptionValues[index],
          })) || [],

        },
      ],
    };
  };

  echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

  return (
    <>
      <Row center="xs">
        {!!title && <TextSpan apparence="c2" hint>
          {title}
        </TextSpan>}
      </Row>
      <ReactEChartsCore
        echarts={echarts}
        option={getOption()}
        onEvents={{
          click: handleChartClick
        }}
      />
      <ModalChartDetails
        show={showModal}
        onClose={() => setShowModal(false)}
        data={selectedData}
      />
    </>
  )
}
