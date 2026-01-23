import ReactApexChart from "react-apexcharts";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { floatToStringExtendDot } from "../../../components/Utils";
import { getStatusVoyageProps } from "../add/StatusVoyage";
import { nanoid } from "nanoid";
import { CardNoShadow, LabelIcon } from "../../../components";
import { CardBody, Row } from "@paljs/ui";

export default function StatusVoyage(props) {

  const { data } = props;

  const theme = useTheme()
  const intl = useIntl()

  const status = [...new Set(data.map(x => x.status))]

  const statusProps = status.map(x => {
    const propsItem = getStatusVoyageProps({ status: x })
    return {
      status: x,
      label: intl.formatMessage({ id: propsItem?.text }),
      color: theme[`color${propsItem.color}${propsItem.intensity}`],
      total: data.filter(y => y.status === x).length
    }
  })?.sort((a, b) => b.total - a.total)

  const options = {
    chart: {
      type: 'donut',
      foreColor: theme.textBasicColor,
    },
    colors: statusProps.map(x => x.color),
    plotOptions: {
      pie: {
        donut: {
          size: '65%',
        }
      }
    },
    legend: {
      show: true,
      position: 'bottom',
      foreColor: theme.textBasicColor,
      fontFamily: theme.fontFamilyPrimary,
    },
    dataLabels: {
      enabled: true,
      style: {
        fontFamily: theme.fontFamilyPrimary,
      }
    },
    tooltip: {
      enabled: true
    },
    labels: statusProps.map(x => x.label),
    stroke: {
      show: false
    }
  }


  return (<>
    <CardNoShadow className="mb-0">
      <CardBody>
        <Row middle="xs" center="xs" className="pb-2">
          <LabelIcon
            title={intl.formatMessage({ id: 'voyage.by.status' })}
          />
        </Row>
        <ReactApexChart
          key={nanoid(5)}
          options={options}
          series={statusProps?.map(x => x.total) || []}
          type='donut'
          height={350}
        />
      </CardBody>
    </CardNoShadow>
  </>)
}
