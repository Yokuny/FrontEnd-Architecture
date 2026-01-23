import React from "react";
import { useTheme} from "styled-components";
import ReactApexCharts from "react-apexcharts";
import {  useIntl } from "react-intl";
import { STATUS_DISPOSITIVE } from "../../../../constants";
import {  ContentChartWrapped, urlRedirect } from "../../Utils";

const GroupStatusChart = (props) => {
  const { machinesStates, title } = props;
  const theme = useTheme();
  const intl = useIntl();
  const machines = props.data?.machines?.map((x) => x.machine?.label);
  const idMachines = props.data?.machines?.map((x) => x.machine?.value);

  let active = [];
  let lost = [];
  let failure = [];

  if (props.data?.machines?.length)
    props.data.machines.forEach((x) => {
      const machineFinded = machinesStates?.length
        ? machinesStates.find((y) => y.idMachine == x.machine?.value)
        : undefined;
      if (machineFinded && machineFinded.status)
        switch (machineFinded.status) {
          case STATUS_DISPOSITIVE.ACTIVE:
            active.push(1);
            lost.push(0);
            failure.push(0);
            break;
          case STATUS_DISPOSITIVE.PROBLEM:
            failure.push(1);
            active.push(0);
            lost.push(0);
            break;
          case STATUS_DISPOSITIVE.LOST_CONNECTION:
            lost.push(1);
            active.push(0);
            failure.push(0);
            break;
          default:
            lost.push(0);
            active.push(0);
            failure.push(0);
            break;
        }
      else {
        lost.push(0);
        active.push(0);
        failure.push(0);
      }
    });

  const series = [
    {
      name: intl.formatMessage({ id: "active" }),
      data: active,
    },
    {
      name: intl.formatMessage({ id: "lostconnection" }),
      data: lost,
    },
    {
      name: intl.formatMessage({ id: "failure" }),
      data: failure,
    },
  ];

  const typeChart = props.data?.typeChart?.value || "bar";

  const options = {
    chart: {
      id: `groupstatus_${props.id}`,
      type: typeChart,
      stacked: true,
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: !props.activeEdit && !props.isMobile,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const idMachine = idMachines[config.dataPointIndex];
          const machine = props.data?.machines?.find(
            (x) => x.machine?.value == idMachine
          );
          urlRedirect(machine?.link);
        },
      },
    },
    colors: [
      theme.colorSuccess500,
      theme.colorWarning500,
      theme.colorDanger500,
    ],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
    },
    xaxis: {
      categories: machines || [],
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
        },
      },
    },
    tooltip: {
      enabled: false,
      intersect: true,
      shared: false,
    },
    yaxis: {
      tickAmount: 1,
      labels: {
        show: false,
      },
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    title: {
      text: title,
      align: "center",
      style: {
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
        fontSize: "13px",
      },
    },
  };

  return (
    <ContentChartWrapped>
      <ReactApexCharts
        key={`groupstatus_${props.id}`}
        options={options}
        series={series}
        height="100%"
        width="100%"
        type={typeChart}
      />
    </ContentChartWrapped>
  );
};
export default GroupStatusChart;
