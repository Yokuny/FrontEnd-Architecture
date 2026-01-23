import { CardBody, Col, Row } from "@paljs/ui";
import ReactApexCharts from "react-apexcharts";
import { useTheme } from "styled-components";
import { useIntl } from "react-intl";
import { getOptionsDaily } from "./Options";
import { useThemeSelected } from "../../../../components/Hooks/Theme";
import { CardNoShadow } from "../../../../components";

export default function ChartDaily(props) {

  const theme = useTheme();
  const intl = useIntl();
  const themeSelected = useThemeSelected();


  const series = [{
    name: 'Operando',
    data: props.data,
  }]

  const optionsTimes = getOptionsDaily({
    theme,
    intl,
    series,
    themeSelected
  })

  return (
    <Row center="xs" middle="xs">
      <Col breakPoint={{ xs: 12, md: 12 }}>
        <CardNoShadow>
          <CardBody>
            <ReactApexCharts
              options={optionsTimes}
              series={series}
              type='line'
              height={300}
            />
          </CardBody>
        </CardNoShadow>
      </Col>
    </Row>
  )
}
