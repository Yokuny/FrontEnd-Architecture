import { CardBody, Col, Row } from "@paljs/ui";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import React from "react";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { floatToStringExtendDot } from "../../../../components/Utils";
import ChartSubgroup from "./ChartSubgroup";
import { getColorByIndex } from "../services/UtilsService";
import { CardNoShadow } from "../../../../components";


export default function ChartTypes(props) {

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();

  const [selectedGroup, setSelectedGroup] = React.useState(null);

  const { data } = props;

  const groupsDistinct = [...new Set(data?.map(x => x.group || "N/A") || [])];

  const totalOperation = data?.length;

  const series = [
    {
      name: intl.formatMessage({ id: 'total' }),
      data: groupsDistinct?.map(m => {
        return data?.filter(y => y.group === m || (m === "N/A" && !y.subgroup))?.length;
      }) || []
    }
  ]

  const colors = series[0]?.data?.map((x, i) => getColorByIndex(i, totalOperation));
  const options = {
    chart: {
      background: theme.backgroundBasicColor1,
      id: `httt_${props.id}`,
      type: "bar",
      stacked: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
      events: {
        dataPointSelection: function (e, chart, opts) {
          if (opts?.selectedDataPoints?.length) {
            if (opts?.selectedDataPoints[0] !== undefined) {
              setSelectedGroup(groupsDistinct[opts.selectedDataPoints[0]]);
              return;
            }
          }
          setSelectedGroup(null);
        }
      }
    },
    colors,
    plotOptions: {
      bar: {
        barHeight: 25,
        borderRadius: 2,
        horizontal: true,
        distributed: true,
        dataLabels: {
          position: 'bottom'
        },
      },
    },
    xaxis: {
      categories: groupsDistinct,
      labels: {
        style: {
          colors: theme.colorBasic600,
          fontFamily: theme.fontFamilyPrimary,
        }
      },
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      formatter: function (val, opt) {
        return val + " - " + opt.w.globals.labels[opt.dataPointIndex] + " (" + floatToStringExtendDot((val * 100) / totalOperation, 1) + "%)";
      },
      offsetX: 0,
    },
    yaxis: {
      labels: {
        show: false,
      },
      tickAmount: 3,
    },
    grid: {
      show: true,
      strokeDashArray: 2,
    },
    tooltip: {
      enabled: true,
      y: {
        formatter: function (val) {
          return parseInt(val)
        }
      }
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    title: {
      text: `${intl.formatMessage({ id: 'group' })}`,
      align: "center",
      style: {
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: '500',
        fontSize: '13px'
      },
    },
    theme: {
      mode: themeSelected?.isDark ? 'dark' : 'light'
    }
  };

  return (
    <Row center="xs" middle="xs">
      <Col breakPoint={{ xs: 12, md: 12 }}>
        <CardNoShadow>
          <CardBody>
            <ReactApexCharts
              options={options}
              series={series}
              type='bar'
              height={300}
            />
            {selectedGroup !== null && (
              <Col breakPoint={{ xs: 12, md: 12 }}>
                <ChartSubgroup
                  data={data?.filter(x => x.group === selectedGroup)} />
              </Col>
            )}
          </CardBody>
        </CardNoShadow>
      </Col>
    </Row>
  )
}
