import ReactApexCharts from "react-apexcharts";
import { TextSpan } from "../../../components";

export default function MostHours(props) {

  const { data } = props

  const itensOrdered = data?.sort((a, b) => (b.hours || 0) - (a.hours || 0))

  const optionsTimes = {
    chart: {
      type: 'pie',
    },
    legend: {
      show: true,
      position: 'left',
    },
    labels: itensOrdered.map((item) => item.code || '-'),
  }

  return (
    <>
      <TextSpan apparence="s2" hint>
        Horas em operação
      </TextSpan>
      <ReactApexCharts
        options={optionsTimes}
        series={itensOrdered?.map((item) => parseFloat((item.hours || 0)?.toFixed(2)))}
        type='pie'
        height={250}
      />
    </>
  )
}
