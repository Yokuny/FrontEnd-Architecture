import React from "react";
import ReactApexCharts from "react-apexcharts";
import { ContainerChart } from "../../Utils";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import { Checkbox, Col, List, ListItem, Row } from "@paljs/ui";
import TextSpan from "../../../Text/TextSpan";

const HistoryListDemo = (props) => {
  const { height = 200, width = 200 } = props;

  const theme = useTheme();
  const intl = useIntl();

  const series = [
    {
      name: "Máq. 1",
      data: [42, 40, 50],
    },
    {
      name: "Máq. 2",
      data: [10, 20, 30],
    },
  ];

  const options = {
    chart: {
      id: "HistoryListDemo",
      type: "line",
      animations: {
        enabled: true,
        easing: "linear",
        dynamicAnimation: {
          speed: 1000,
        },
      },
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    colors: [theme.colorInfo600, theme.colorDanger600],
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: ["22/10", "23/10", "24/10"],
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    tooltip: {
      enabled: false,
      intersect: true,
      shared: false,
    },
    yaxis: {
      tickAmount: 3,
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
    },
    legend: {
      show: false,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary
    },
    title: {
      text: '',
      align: "center",
      style: {
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
      },
    },
  };

  return (
    <>
      <ContainerChart height={height} width={width} className="card-shadow pt-4">
        <TextSpan apparence="s2" style={{ marginTop: 0 }}>Sel. sensors</TextSpan>
        <Row className="m-0">
          <Col breakPoint={{ md: 4 }} style={{ padding: 0 }}>
            <List style={{ padding: 0, marginTop: 40 }}>
              <ListItem className="p-2">
                <Checkbox />
                <TextSpan apparence="s2" className="ml-1">S1</TextSpan>
              </ListItem>
              <ListItem className="p-2">
                <Checkbox checked />
                <TextSpan apparence="s2" className="ml-1">S2</TextSpan>
              </ListItem>
              <ListItem className="p-2">
                <Checkbox checked />
                <TextSpan apparence="s2" className="ml-1">S3</TextSpan>
              </ListItem>
            </List>
          </Col>
          <Col breakPoint={{ md: 8 }} className="p-2">
            <ReactApexCharts
              key="HistoryListDemo"
              options={options}
              series={series}
              height={height - 10}
              width={width - 95}
              type="line"
            />
          </Col>
        </Row>
      </ContainerChart>
    </>
  );
};

export default HistoryListDemo;
