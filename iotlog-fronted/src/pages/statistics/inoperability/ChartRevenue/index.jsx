import { CardBody, Col, Row } from "@paljs/ui";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { CardNoShadow } from "../../../../components";

export default function ChartRevenue(props) {

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();

  const getValue = (data) => {
    if (data.status === "operacao") {
      return parseFloat(((data.totalHours * 100) / 24).toFixed(2));
    }
    if (data.status === "downtime") {
      return parseFloat(((data.totalHours * 100) / 24).toFixed(2)) * -1;
    }
    if (data.status === "downtime-parcial") {
      return parseFloat(((data.totalHours * 100) / 24).toFixed(2)) * -1;
    }
    return 0;
  }

  const series = [{
    name: intl.formatMessage({ id: 'revenue' }),
    data: props.data?.map(x => getValue(x)) || [],
  }]

  const options = {
    chart: {
      type: 'bar',
      height: 350
    },
    plotOptions: {
      bar: {
        colors: {
          ranges: [
            {
              from: 0,
              to: 100,
              color: theme.colorSuccess500
            },
            {
              from: -100,
              to: -1,
              color: theme.colorDanger500
            }]
        },
        columnWidth: '80%',
      }
    },
    dataLabels: {
      enabled: false,
    },
    yaxis: {
      title: {
        text: intl.formatMessage({ id: "revenue" }),
        style: {
          color: theme.colorBasic600,
          fontFamily: theme.fontFamilyPrimary,
        },
      },
      min: -100,
      max: 100,
      labels: {
        style: {
          colors: theme.colorBasic600,
          fontFamily: theme.fontFamilyPrimary,
        },
        formatter: function (y) {
          return y.toFixed(0) + "%";
        }
      }
    },
    grid: {
      show: true,
      strokeDashArray: 2,
    },
    xaxis: {
      type: 'datetime',
      categories: props.data.map(x => x.date),
      labels: {
        rotate: -90
      }
    },
    title: {
      text: `${intl.formatMessage({ id: "revenue" })} x ${intl.formatMessage({ id: "loss" })}`,
      align: "center",
      style: {
        fontSize: "12px",
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
      },
    },
    theme: {
      palette: 'palette1',
      mode: themeSelected?.isDark ? 'dark' : 'light'
    },
  }

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
          </CardBody>
        </CardNoShadow>
      </Col>
    </Row>
  )
}
