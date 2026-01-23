import { useTheme } from "styled-components";
import { Col, Row, Tooltip } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { PieChart } from "echarts/charts";
import { LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers"
import { nanoid } from "nanoid";
import { floatToStringExtendDot } from "../../../components/Utils";
import { optionsOperation } from "./Options";
import { CardNoShadow, LabelIcon, TextSpan } from "../../../components";
import { FINANCIAL, OPERATIONAL } from "../../../components/Select/SelectView";

export default function IndicatorsChartPerVessel({
  data,
  machine,
  view
}) {
  const theme = useTheme();
  const intl = useIntl();

  const statusDistincts = [...new Set(data?.map(item => item.status))]

  const getStatusSeries = (statusDistincts) => {
    const statusListToReturn = statusDistincts
      .map((status) => {
        return {
          status,
          name: optionsOperation.find((z) => z.value === status)?.label,
          value: data
            ?.filter((item) => item.status === status && !!item.startedAtOriginal)
            .reduce(
              (acc, item) => {
                const diffTime = ((new Date(item.endedAt || new Date()).getTime() -
                  new Date(item.startedAt || new Date()).getTime()) /
                  3600000);
                let timeToApply = diffTime;
                acc = acc + timeToApply;
                return acc;
              },
              0
            ),
          valuepaid: view === FINANCIAL && status === "downtime-parcial"
            ? data
              ?.filter((item) => item.status === status && !!item.startedAtOriginal)
              .reduce(
                (acc, item) => {
                  const diffTime = ((new Date(item.endedAt || new Date()).getTime() -
                    new Date(item.startedAt || new Date()).getTime()) /
                    3600000);
                  let timeToApply = diffTime * (100 - (item.factor || 0)) / 100;
                  acc = acc + timeToApply;
                  return acc;
                },
                0
              )
            : null,
        };
      })
      .sort((a, b) => a.name?.localeCompare(b.name))
    return statusListToReturn
  }

  let seriesToApply = getStatusSeries(statusDistincts);
  if (view === OPERATIONAL) {
    seriesToApply.filter(item => (item.status === "downtime-parcial") || (item.status === "parada-programada") || (item.status === "dockage"))
      .forEach(item => {
        item.status = "operacao";
        item.name = optionsOperation.find((z) => z.value === "operacao")?.label;
      });
  } else if (seriesToApply?.length) {
    seriesToApply.forEach(item => {
      switch (item.status) {
        case "operacao":
          item.name = intl.formatMessage({ id: "full.tax" });
          break;
        case "downtime":
          item.name = intl.formatMessage({ id: "inoperability" });
          break;
        case "downtime-parcial":
          item.name = intl.formatMessage({ id: "reduction.tax" });
          break;
        case "parada-programada":
          item.name = intl.formatMessage({ id: "programmed.stoppage" });
          break;
        case "dockage":
          item.name = intl.formatMessage({ id: "dockage" });
          break;
        default:
          item.name = item.name;
      }
    });
    seriesToApply = seriesToApply.sort((a, b) => a.name?.localeCompare(b.name));
  }
  seriesToApply = Object.values(
    seriesToApply.reduce((acc, curr) => {
      const key = `${curr.status}-${curr.name}`;
      if (!acc[key]) {
        acc[key] = { ...curr };
      } else {
        acc[key].value = (acc[key].value || 0) + (curr.value || 0);
      }
      return acc;
    }, {})
  );


  const statusValid = seriesToApply.filter(item => item.value).map(item => item.status)

  const series = seriesToApply.filter(item => item.value).map(item => item.value)

  if (series?.length === 0 || series?.every(item => item === 0)) {
    return <></>
  }

  const getOption = () => {
    return {
      darkMode: theme?.isDark,
      colorBy: "series",
      textStyle: {
        fontFamily: theme.fontFamilyPrimary,
      },
      color: statusValid.map(
        (status) => optionsOperation.find((z) => z.value === status)?.color
      ),
      tooltip: {
        trigger: "item",
        formatter: (item) => `
          <strong>${item.marker} ${item.name}</strong>  <i>${floatToStringExtendDot(item.percent, 1)}%</i><br />
          ${floatToStringExtendDot(item.value, 1)} <i>HR</i><br />
          ${floatToStringExtendDot(item.value / 24, 1)} <i>dias</i>
            `,
        fontSize: 12,
        backgroundColor: theme.backgroundBasicColor1,
        textStyle: {
          color: theme.textBasicColor,
        },
      },
      animation: "auto",
      animationDuration: 1000,
      animationDurationUpdate: 500,
      series: [
        {
          label: {
            show: true,
            position: "outer",
            overflow: "none",
            alignTo: "edge",
            edgeDistance: `10%`,
            color: theme.textBasicColor,
            distanceToLabelLine: 1,
            backgroundColor: "transparent",
            formatter: (value) => `${floatToStringExtendDot(value.percent, 1)} %`
          },
          labelLine: {
            show: true,
            smooth: true,
          },
          type: "pie",
          radius: ['35%', '50%'],
          center: ["50%", "50%"],
          data: seriesToApply
            .filter((item) => item.value)
            .map((item) => ({ value: item.value, name: optionsOperation.find(x => x.value === item.status)?.label })),
        },
      ],
    };
  };

  echarts.use([TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);

  return (
    <>
      <Col breakPoint={{ xs: 12, md: 4 }} >
        <CardNoShadow
          className="p-3">
          <Tooltip
            content={machine?.name}
            trigger="hover"
            placement="top"
          >
            <LabelIcon
              title={machine?.name}
              styleText={{
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                overflow: "hidden",
                width: "80%"
              }}
            />
          </Tooltip>
          <div className="mt-1"></div>
          <ReactEChartsCore
            key={nanoid(5)}
            style={{ height: '150px' }}
            echarts={echarts} option={getOption()} />

          <Row start="xs" className="ml-0 pt-2">
            <LabelIcon
              iconName={"calendar-outline"}
              title={<FormattedMessage id="day.unity" />}
            />
            {statusValid
              .map(x => ({
                status: x,
                label: x === "downtime"
                  ? intl.formatMessage({ id: "inoperability" })
                  : x === "operacao" && view === FINANCIAL
                    ? intl.formatMessage({ id: "full.tax" })
                    : optionsOperation.find((z) => z.value === x)?.label,
              }))
              // .sort((a, b) => a.label?.localeCompare(b.label))
              .map((status, index) => (
                <Col key={`l-${nanoid(4)}`}>
                  <TextSpan
                    apparence="p3" hint className="ml-1">
                    {status?.label}:
                    <TextSpan apparence="s3" className="ml-1">{floatToStringExtendDot(series[index] / 24, 3)}</TextSpan>
                    {status?.status === "downtime-parcial" && view === FINANCIAL && (
                      <>
                        {" "}
                        (<FormattedMessage id="days.paid" />:
                        <TextSpan apparence="s3" className="ml-1">
                          {floatToStringExtendDot(
                            (seriesToApply.find(item => item.status === "downtime-parcial")?.valuepaid || 0) / 24,
                            3
                          )}
                        </TextSpan>)
                      </>
                    )}
                  </TextSpan>
                </Col>
              ))}
          </Row>
        </CardNoShadow>
      </Col>
    </>
  )
}
