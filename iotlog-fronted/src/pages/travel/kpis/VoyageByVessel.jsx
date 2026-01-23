import ReactApexChart from "react-apexcharts";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { nanoid } from "nanoid";
import { CardNoShadow, LabelIcon } from "../../../components";
import { CardBody,  Row } from "@paljs/ui";

export default function VoyageByVessel(props) {

  const { data } = props;

  const theme = useTheme()
  const intl = useIntl()

  const unknown = intl.formatMessage({ id: 'unknown' })

  const machines = [...new Set(data.map(x => x.machine?.name || unknown))].sort((a, b) => a.localeCompare(b))

  const series = machines.map(x => ({
    machine: x,
    count: data.filter(y => y.machine?.name === x || (x === unknown && !y.machine.name)).length
  })).sort((a, b) => b.count - a.count)

  const options = {
    chart: {
      type: 'donut',
      foreColor: theme.textBasicColor,
    },
    //colors: statusProps.map(x => x.color),
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
    labels: series?.map(x => x.machine),
    stroke: {
      show: false
    }
  }


  return (<>
    <CardNoShadow className="mb-0">
      <CardBody>
        <Row middle="xs" center="xs" className="pb-2">
          <LabelIcon
            title={intl.formatMessage({ id: 'voyage.by.vessel' })}
          />
        </Row>
        <ReactApexChart
          key={nanoid(5)}
          options={options}
          series={series?.map(x => x.count)}
          type='donut'
          height={350}
        />
      </CardBody>
    </CardNoShadow>
  </>)
}
