import { Col, Row } from "@paljs/ui";
import ReactEChartsCore from "echarts-for-react/lib/core";
import { PieChart } from "echarts/charts";
import { LegendComponent, TooltipComponent } from "echarts/components";
import * as echarts from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { FormattedMessage, useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { LabelIcon, TextSpan } from "../../../components";
import { floatToStringExtendDot } from "../../../components/Utils";
import { optionsOperation } from "./Options";
import { ListIndicatorsMachines } from "./ListIndicatorsMachines";
import { FINANCIAL, OPERATIONAL } from "../../../components/Select/SelectView";

export default function IndicatorsChart({ data, view }) {
  const theme = useTheme();
  const intl = useIntl();
  const statusDistincts = [...new Set(data?.map((item) => item.status))];
  const idMachines = [...new Set(data?.map((item) => item.machine.id))]?.filter(
    (item) => item
  );

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
    const indexDowntime = seriesToApply.findIndex(item => item.status === "downtime");
    if (indexDowntime !== -1) {
      seriesToApply[indexDowntime].name = intl.formatMessage({ id: "inoperability" });
    }
  } else if (seriesToApply?.length) {

    seriesToApply.forEach((item) => {
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
    <Row middle="xs" className="mb-4">
      <Col breakPoint={{ xs: 12, md: 4 }}>
        <ReactEChartsCore
          echarts={echarts} option={getOption()} />
        <Col
          breakPoint={{ xs: 12, md: 12 }}
          style={{ display: "flex", flexDirection: "column" }}
        >
          <LabelIcon
            iconName={"calendar-outline"}
            title={<FormattedMessage id="day.unity" />}
          />
          {statusValid
            .map((x) => ({
              status: x,
              label: x === "downtime"
                ? intl.formatMessage({ id: "inoperability" })
                : x === "operacao" && view === FINANCIAL
                  ? intl.formatMessage({ id: "full.tax" })
                  : optionsOperation.find((z) => z.value === x)?.label,
            }))
            .map((status, index) => (
              <>
              <TextSpan key={`l-${index}`} hint apparence="p3" className="ml-1">
                {status?.label}:
                <TextSpan apparence="s3" className="ml-1">
                  {floatToStringExtendDot(seriesToApply?.find(item => item.status === status.status)?.value / 24, 3)}
                </TextSpan>
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
              </>
            ))}
        </Col>
      </Col>
      <ListIndicatorsMachines
        data={data}
        idMachines={idMachines}
        view={view}
      />
    </Row>
  );
}
