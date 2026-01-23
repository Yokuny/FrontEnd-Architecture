import React from "react";
import { Col, Row } from "@paljs/ui";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { PieChart } from "echarts/charts";
import { LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { optionsOperation } from "./../../../forms/Downtime/Options";

const OPERATIONAL_STATUS = ['operacao', 'downtime-parcial', 'dockage', 'parada-programada'];

export default function ChartPie(props) {

  const theme = useTheme();
  const intl = useIntl();

  const { view } = props;

  const hasDockage = props.data?.some(x => x.status === 'dockage');
  const hasParadaProgramada = props.data?.some(x => x.status === 'parada-programada');

  const seriesToApply = view === "financial"
    ? [
      {
        status: "operacao",
        name: intl.formatMessage({ id: "full.tax" }),
        value: props.data.filter(x => x.status === "operacao").reduce((acc, cur) => acc + cur.totalGrossHours, 0)
      },
      {
        status: "downtime-parcial",
        name: intl.formatMessage({ id: "reduction.tax" }),
        value: props.data.filter(x => x.status === "downtime-parcial").reduce((acc, cur) => acc + cur.totalGrossHours, 0)
      },
      {
        status: "downtime",
        name: intl.formatMessage({ id: "inoperability" }),
        value: props.data.filter(x => x.status === "downtime").reduce((acc, cur) => acc + cur.totalGrossHours, 0)
      },
      ...hasDockage ? [{
        status: "dockage",
        name: intl.formatMessage({ id: "dockage" }),
        value: props.data.filter(x => x.status === "dockage").reduce((acc, cur) => acc + cur.totalGrossHours, 0)
      }] : [],
      ...hasParadaProgramada ? [{
        status: "parada-programada",
        name: intl.formatMessage({ id: "programmed.stoppage" }),
        value: props.data.filter(x => x.status === "parada-programada").reduce((acc, cur) => acc + cur.totalGrossHours, 0)
      }] : [],
    ]
    : [
      {
        status: "operacao",
        name: intl.formatMessage({ id: "operational" }),
        value: props.data.filter(x => OPERATIONAL_STATUS.includes(x.status)).reduce((acc, cur) => acc + cur.totalHours, 0)
      },
      {
        status: "downtime",
        name: intl.formatMessage({ id: "inoperability" }),
        value: props.data.filter(x => x.status === "downtime").reduce((acc, cur) => acc + cur.totalHours, 0)
      },
    ]

  const statusValid = seriesToApply
    .filter((item) => item.value)
    .map((item) => item.status);

  const getOption = () => {
    return {
      darkMode: theme?.isDark,
      textStyle: {
        fontFamily: theme.fontFamilyPrimary,
      },
      color: statusValid.map(
        (status) => optionsOperation.find((z) => z.value === status)?.color
      ),
      tooltip: {
        trigger: "item",
        formatter: (item) => `
          <strong>${item.marker} ${item.name}</strong>  <i>${floatToStringExtendDot(item.percent, 2)}%</i><br />
          ${floatToStringExtendDot(item.value, 1)} <i>HR</i><br />
          ${floatToStringExtendDot(item.value / 24, 1)} <i>Dias</i>
            `,
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
          data: seriesToApply.filter((item) => item.value),
        },
      ],
    };
  };

  echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);


  return (
    <>
      <Col breakPoint={{ xs: 12, md: 4 }}>
        <ReactEChartsCore
          echarts={echarts}
          option={getOption()} />
      </Col>
    </>
  )
}
