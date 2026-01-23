import ReactApexChart from "react-apexcharts";
import { useIntl } from "react-intl";
import { useTheme } from "styled-components";
import { getStatusVoyageProps } from "../add/StatusVoyage";
import { nanoid } from "nanoid";
import { CardNoShadow, LabelIcon } from "../../../components";
import { CardBody, Row } from "@paljs/ui";
import { floatToStringExtendDot } from "../../../components/Utils";

export default function HoursVoyage(props) {

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
    colors: [theme.colorBasic500, theme.colorPrimary500],
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
      enabled: true,
      y: {
        formatter: function (val) {
          return floatToStringExtendDot(val, 2) + ' h'
        }
      }
    },
    labels: [intl.formatMessage({ id: 'in.port' }),intl.formatMessage({ id: 'in.travel' })],
    stroke: {
      show: false
    }
  }


  const inVoyage = (data) => {
    let total = 0;
    for (const item of data) {
      let indexItinerary = 0
      for (const itinerary of item.itinerary) {
        if (!!item.itinerary[indexItinerary + 1]) {
          const nextItinerary = item.itinerary[indexItinerary + 1]
          if (itinerary.ats && nextItinerary.ata) {
            total += (new Date(nextItinerary.ata).getTime() - new Date(itinerary.ats).getTime()) / (1000 * 60 * 60)
          }
        }
        indexItinerary++;
      }
    }
    return total
  }

  const series = [
    data
      .map(x => x.itinerary
        .filter(y => y.ata && y.ats)
        .reduce((acc, cur) => acc + (
          (new Date(cur.ats).getTime() - new Date(cur.ata).getTime()) / (1000 * 60 * 60)
        ), 0))
      .reduce((acc, cur) => acc + cur, 0),
    inVoyage(data)
  ]

  return (<>
    <CardNoShadow className="mb-0">
      <CardBody>
        <Row middle="xs" center="xs" className="pb-2">
          <LabelIcon
            title={intl.formatMessage({ id: 'hour.unity' })}
          />
        </Row>
        <ReactApexChart
          key={nanoid(5)}
          options={options}
          series={series}
          type='donut'
          height={350}
        />
      </CardBody>
    </CardNoShadow>
  </>)
}
