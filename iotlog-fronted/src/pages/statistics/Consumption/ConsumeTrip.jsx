import { nanoid } from "nanoid";
import React from "react";
import moment from "moment";
import ReactApexCharts from "react-apexcharts";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { Fetch, SpinnerFull } from "../../../components";
import { getArrayAVG, getArrayMax } from "../../../components/Utils";
import { getParamsUrlFilter, normalizedUnitValue } from "./Utils";

export default function ConsumeProfitTrip(props) {
  const theme = useTheme();
  const intl = useIntl();

  const { unitDefault } = props;

  const [data, setData] = React.useState();

  const [isLoading, setIsLoading] = React.useState(false);

  React.useLayoutEffect(() => {
    getData(props.filter);
  }, [props.filter]);

  const COLORS = {
    IFO: theme.colorPrimary700,
    MDO: theme.colorInfo500,
  };

  const getData = (filterData) => {
    setIsLoading(true);
    Fetch.get(`/travel/statistics/consume?${getParamsUrlFilter(filterData)}`)
      .then((response) => {
        setData(response.data?.length ? response.data : []);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const series = [
    {
      name: "IFO",
      type: "column",
      data: data?.map((x) =>
        normalizedUnitValue({
          value: x.consumeIFO,
          unitValue: x.unitIFO,
          unitToDefault: unitDefault,
          densityReference: x.densityIFO,
        })
      ),
    },
    {
      name: "MDO",
      type: "column",
      data: data?.map((x) =>
        normalizedUnitValue({
          value: x.consumeMDO,
          unitValue: x.unitMDO,
          unitToDefault: unitDefault,
          densityReference: x.densityMDO,
        })
      ),
    },
  ];

  const itensIfo = series.find((x) => x.name === "IFO")?.data;
  const itensMdo = series.find((x) => x.name === "MDO")?.data;

  const maxIfo = getArrayMax(itensIfo);
  const maxMdo = getArrayMax(itensMdo);

  const avgIfo = getArrayAVG(itensIfo);
  const avgMdo = getArrayAVG(itensMdo);

  const id = 'consume';

  const getFormatPerid = () => {
    let format = '';
    if (props.filter?.dateMin && props.filter?.dateMax) {
      const init = moment(props.filter.dateMin)
      const end = moment(props.filter.dateMax)
      format = `${init.format('DD MMM YYYY')} - ${end.format('DD MMM YYYY')}`
    } else if (props.filter?.dateMin) {
      const init = moment(props.filter.dateMin)
      format = `${init.format('MMM YYYY')} - ${intl.formatMessage({ id: 'today' })}`
    } else {
      format = intl.formatMessage({ id: 'all' });
    }

    return format
  }

  const options = {
    chart: {
      id: id,
      type: "line",
      stacked: false,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    plotOptions: {
      bar: {
        columnWidth: "50%",
      },
    },
    colors: [COLORS.IFO, COLORS.MDO],
    stroke: {
      width: [1, 1, 4],
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: data?.map((x) => x.code),
      labels: {
        style: {
          foreColor: theme.textBasicColor,
          fontFamily: theme.fontFamilyPrimary,
          fontWeight: "600",
        },
      },
      tooltip: {
        enabled: false,
      },
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      fixed: {
        enabled: true,
        position: "topLeft", // topRight, topLeft, bottomRight, bottomLeft
        offsetY: 30,
        offsetX: 60,
      },
      style: {
        fontSize: "12px",
        fontFamily: theme.fontFamilyPrimary,
      },
    },
    yaxis: {
      opposite: false,
      labels: {
        style: {
          colors: COLORS.MDO,
        },
        formatter: (value) => `${value} ${unitDefault}`,
      },
      forceNiceScale: true,
      max: maxIfo > maxMdo ? maxIfo : maxMdo,
      tickAmount: 5,
      decimalsInFloat: 1,
    },
    legend: {
      show: true,
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    title: {
      text: `${intl.formatMessage({ id: "travel" })} (${getFormatPerid()})`,
      align: "center",
      style: {
        foreColor: theme.textBasicColor,
        fontFamily: theme.fontFamilyPrimary,
        fontWeight: "600",
        fontSize: "13px",
      },
    },
    annotations: {
      position: "front",
      yaxis: data?.length ? [
        {
          y: avgIfo,
          borderColor: theme.colorWarning500,
          label: {
            show: true,
            text: `IFO ${intl.formatMessage({
              id: "average",
            })}: ${avgIfo} ${unitDefault}`,
            style: {
              color: "#fff",
              background: theme.colorWarning500,
              fontFamily: theme.fontFamilyPrimary,
            },
          },
        },
        {
          y: avgMdo,
          borderColor: theme.colorDanger500,
          label: {
            show: true,
            text: `MDO ${intl.formatMessage({
              id: "average",
            })}: ${avgMdo} ${unitDefault}`,
            style: {
              color: "#fff",
              background: theme.colorDanger500,
              fontFamily: theme.fontFamilyPrimary,
            },
          },
        },
      ] : [],
    },
  };

  return (
    <>
      <ReactApexCharts
        key={id}
        options={options}
        series={series}
        height={350}
        width="100%"
        type="line"
      />
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
