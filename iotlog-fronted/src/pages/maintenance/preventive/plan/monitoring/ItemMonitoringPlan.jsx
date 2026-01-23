import { Badge } from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import { TextSpan } from "../../../../../components";

const ContainerChart = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  max-width: 150px;
  cursor: pointer;
`;

const ItemMonitoringPlan = (props) => {
  const { monitorItem, onClick } = props;

  const theme = useTheme();
  const intl = useIntl();
  const getOptions = (data) => {
    let color = monitorItem.daysLeft ? theme.colorSuccess500 :  theme.colorWarningDefault;
    if (data.expired) {
      color = theme.colorDanger700;
    } else if (data.next) {
      color = theme.colorDanger500;
    } else if (data.warning) {
      color = theme.colorWarning500;
    }

    return {
      chart: {
        type: "radialBar",
      },
      colors: [color],
      plotOptions: {
        radialBar: {
          hollow: {
            size: "55%",
          },
          track: {
            background: monitorItem.daysLeft ? theme.backgroundBasicColor4 : theme.colorWarningDefault,
          },
          dataLabels: {
            show: true,
            name: {
              show: true,
              offsetY: 6,
              fontFamily: theme.fontFamilyPrimary,
              color: color,
              fontWeight: 700,
            },
            value: {
              show: false,
              offsetY: 6,
              fontFamily: theme.fontFamilyPrimary,
              color: color,
              fontWeight: 700,
            },
          },
        },
      },
      labels: [monitorItem.daysLeft ? `${monitorItem.daysLeft} Dias` : '?'],
      legend: {
        show: false,
      },
    };
  };

  const series = [monitorItem.percentual];
  return (
    <div onClick={onClick}>
      <ContainerChart>
        <ReactApexChart
          options={getOptions(monitorItem)}
          series={series}
          type="radialBar"
          height={140}
        />
        <TextSpan
          style={{ marginTop: -10 }}
          apparence="c2"
          className="text-center"
        >
          {monitorItem.description}
        </TextSpan>
        {monitorItem.dateWindowEnd ? (
          <TextSpan apparence="p3" className="text-center">
            {`${intl.formatMessage({ id: "date.window.end" })}: ${moment(
              monitorItem.dateWindowEnd
            ).format(intl.formatMessage({ id: "format.date" }))}`}
          </TextSpan>
        ) : (
          <TextSpan apparence="p3" className="text-center">
            {monitorItem?.typeMaintenance?.toUpperCase()?.includes("WEAR") ? (
              ""
            ) : (
              <FormattedMessage id="history.maintenance.empty" />
            )}
          </TextSpan>
        )}
        {monitorItem.next && !monitorItem.expired && (
          <Badge status="Danger" style={{ position: 'relative' }}>
            <FormattedMessage id="next" />
          </Badge>
        )}
        {monitorItem.expired && (
          <Badge status="Danger" style={{ position: 'relative', backgroundColor: theme.colorDanger700 }}>
            <FormattedMessage id="expired" />
          </Badge>
        )}
        {monitorItem.warning && (
          <Badge status="Warning" style={{ position: 'relative' }}>
            <FormattedMessage id="next" />
          </Badge>
        )}
      </ContainerChart>
    </div>
  );
};

export default ItemMonitoringPlan;
