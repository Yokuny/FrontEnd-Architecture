import ReactApexCharts from "react-apexcharts";
import { TextSpan } from "../../../components";

export default function MostConsumption(props) {

  const { data } = props

  const itensOrdered = data?.sort((a, b) => (b.consumption || 0) - (a.consumption || 0))

  const optionsTimes = {
    chart: {
      type: 'pie',
    },
    legend: {
      show: true,
      position: 'right',
    },
    labels: itensOrdered.map((item) => item.code || "-"),
  }

  return (
    <>
      <TextSpan apparence="s2" hint>
        Consumo
      </TextSpan>
      <ReactApexCharts
        options={optionsTimes}
        series={itensOrdered?.map((item) => parseFloat((item.consumption || 0)?.toFixed(2)))}
        type='pie'
        height={250}
      />
    </>
  )
}
