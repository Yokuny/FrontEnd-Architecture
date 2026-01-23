import { CardBody, Col, Radio, Row } from "@paljs/ui";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import { nanoid } from "nanoid";
import React from "react";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { floatToStringBrazilian, floatToStringExtendDot } from "../../../../components/Utils";
import { getIconStatusOperation } from "../../../fleet/Status/Utils";
import { CardNoShadow, LabelIcon } from "../../../../components";

const STATUS_IN_OPERATION = ['operacao', 'downtime-parcial', 'dockage', 'parada-programada'];
const STATUS_NOT_IN_OPERATION = ['downtime','downtime-parcial', 'dockage', 'parada-programada'];

export default function ChartMonthly(props) {

  const [typeView, setTypeView] = React.useState('competence');

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();

  const { data, view } = props;

  const monthsDistinct = [...new Set(data?.map(x => x[typeView]))];

  const hasDockage = data?.some(x => x.status === 'dockage');
  const hasParadaProgramada = data?.some(x => x.status === 'parada-programada');

  const series = view === 'financial'
    ? [
      {
        name: intl.formatMessage({ id: "full.tax" }),
        s: 'operacao',
        data: monthsDistinct.map(m => {
          const dataFiltered = data?.filter(y => y.status === 'operacao' && y[typeView] === m);
          return dataFiltered?.reduce((acc, curr) => acc + curr.totalGrossHours, 0);
        })
      },
      {
        name: intl.formatMessage({ id: "reduction.tax" }),
        s: 'downtime-parcial',
        data: monthsDistinct.map(m => {
          const dataFiltered = data?.filter(y => y.status === 'downtime-parcial' && y[typeView] === m);
          return dataFiltered?.reduce((acc, curr) => acc + curr.totalGrossHours, 0);
        })
      },
      {
        name: intl.formatMessage({ id: "inoperability" }),
        s: 'downtime',
        data: monthsDistinct.map(m => {
          const dataFiltered = data?.filter(y =>
            y.status === 'downtime' && y[typeView] === m);
          return dataFiltered?.reduce((acc, curr) => acc + curr.totalGrossHours, 0);
        })
      },
      ...(hasDockage ? [{
        name: intl.formatMessage({ id: "dockage" }),
        s: 'dockage',
        data: monthsDistinct.map(m => {
          const dataFiltered = data?.filter(y =>
            y.status === 'dockage' && y[typeView] === m);
          return dataFiltered?.reduce((acc, curr) => acc + curr.totalGrossHours, 0);
        })
      }] : []),
      ...(hasParadaProgramada ? [{
        name: intl.formatMessage({ id: "programmed.stoppage" }),
        s: 'parada-programada',
        data: monthsDistinct.map(m => {
          const dataFiltered = data?.filter(y =>
            y.status === 'parada-programada' && y[typeView] === m);
          return dataFiltered?.reduce((acc, curr) => acc + curr.totalGrossHours, 0);
        })
      }] : []),
    ]
    : [
      {
        name: intl.formatMessage({ id: "operational" }),
        s: 'operacao',
        data: monthsDistinct.map(m => {
          const dataFiltered = data?.filter(y =>
            STATUS_IN_OPERATION.includes(y.status) && y[typeView] === m);
          return dataFiltered?.reduce((acc, curr) => acc + curr.totalHours, 0);
        })
      },
      {
        name: intl.formatMessage({ id: "inoperability" }),
        s: 'downtime',
        data: monthsDistinct.map(m => {
          const dataFiltered = data?.filter(y =>
            y.status === 'downtime' && y[typeView] === m);
          return dataFiltered?.reduce((acc, curr) => acc + curr.totalHours, 0);
        })
      }
    ];

  const totalOperation = data?.filter(x =>
    view === 'financial'
      ? x.status === 'operacao'
      : STATUS_IN_OPERATION.includes(x.status))?.reduce((acc, curr) => acc + curr.totalHours, 0);
  const totalDiff = data?.filter(x =>
    view === 'financial'
      ? STATUS_NOT_IN_OPERATION.includes(x.status)
      : x.status === 'downtime')?.reduce((acc, curr) => acc + curr.totalHours, 0);

  const average = totalOperation === 0 ? 0 : (totalOperation * 100) / (totalOperation + totalDiff);


  const optionsRadio = [
    {
      value: 'competence',
      label: intl.formatMessage({ id: 'competence' }),
      checked: typeView === 'competence',
      status: 'Info'
    },
    {
      value: 'month',
      label: intl.formatMessage({ id: 'monthly' }),
      checked: typeView === 'month',
      status: 'Basic'
    },
  ]

  const options = {
    chart: {
      background: theme.backgroundBasicColor1,
      id: `hT_CCo_${props.id}`,
      type: "bar",
      stacked: true,
      stackType: '100%',
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    plotOptions: {
      bar: {
        columnWidth: '30%',
        horizontal: false
      },
    },
    xaxis: {
      categories: monthsDistinct,
    },
    annotations: {
      yaxis: [{
        y: average > 87 ? 88 : average,
        borderColor: view === 'financial'
          ? average < 99 && average >= 50
            ? theme.colorWarning600
            : average < 50
              ? theme.colorDanger600
              : theme.colorSuccess500
          : average < 85 ? theme.colorDanger600 : theme.colorSuccess500,
        strokeDashArray: 2,
        label: {
          borderColor: view === 'financial'
            ? average < 99 && average >= 50
              ? theme.colorWarning600
              : average < 50
                ? theme.colorDanger600
                : theme.colorSuccess500
            : average < 85 ? theme.colorDanger600 : theme.colorSuccess500,
          show: true,
          text: `${intl.formatMessage({ id: 'average' })} ${view === 'financial' ? intl.formatMessage({ id: 'tax' }) : intl.formatMessage({ id: 'operation' })}: ${floatToStringExtendDot(average, 1)}%`,
          style: {
            color: view === 'financial'
              ? average < 99 && average >= 50
                ? theme.colorWarning600
                : average < 50
                  ? theme.colorDanger600
                  : theme.colorSuccess500
              : average < 85 ? theme.colorDanger600 : theme.colorSuccess500,
            fontWeight: '600',
            fontSize: '12px',
            background: theme.backgroundBasicColor1,
          },
        },
      }]
    },
    colors: series.map(x => {
      const propsSeries = getIconStatusOperation(x.s)
      return propsSeries?.colorTheme
        ? theme[propsSeries?.colorTheme]
        : propsSeries?.color
    }),
    dataLabels: {
      enabled: true,
      formatter: function (val) {
        return `${floatToStringExtendDot(val, 1)}%`
      }
    },
    yaxis: {
      tickAmount: 0,
      show: false,
    },
    tooltip: {
      enabled: true,
      // y: {
      //   formatter: function (val) {
      //     return `${floatToStringExtendDot(val, 1)}`
      //   }
      // }
      style: {
        fontSize: '12px',
        fontFamily: theme.fontFamilyPrimary
      },
      y: {
        formatter: (value, { seriesIndex }) => {
          const seriesName = series[seriesIndex].name;
          return `${seriesName}
          <br/>${intl.formatMessage({ id: "day.unity" })}: ${floatToStringBrazilian(value ? value / 24 : 0, 3) || 0}
          <br/>HR: ${floatToStringBrazilian(value || 0, 2)}
          <br/>`;
        },
        title: {
          formatter: (seriesName) => "",
        },
      }
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,

    },
    title: {
      text: `${intl.formatMessage({ id: 'operational.average' })} (${optionsRadio.find(x => x.value === typeView)?.label})`,
      align: "center",
      style: {
        color: theme.colorBasic600,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: '500',
        fontSize: '13px'
      },
    },
    theme: {
      palette: 'palette1',
      mode: themeSelected?.isDark ? 'dark' : 'light'
    }
  };


  return (
    <Row center="xs" middle="xs">
      <Col breakPoint={{ xs: 12, md: 12 }}>
        <CardNoShadow>
          <CardBody>
            <LabelIcon
              iconName="eye-outline"
              title={intl.formatMessage({
                id: 'type'
              })}
            />
            <Row className="m-0 pl-2">
              <Radio
                className="ml-2"
                key={nanoid(3)}
                onChange={v => setTypeView(v)}
                name="radio"
                options={optionsRadio}
              />
            </Row>
            <ReactApexCharts
              key={nanoid(5)}
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
