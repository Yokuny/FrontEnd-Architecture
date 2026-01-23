import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";

export function useCotation(props) {
  const { date, value } = props;

  const [cotation, setCotation] = useState({
    value: "",
  });
  const [cotationDate, setCotationDate] = useState();

  function formatDates(date) {
    return {
      min: moment(date).subtract(5, "days").format("MM-DD-YYYY"),
      max: moment(date).format("MM-DD-YYYY"),
    };
  }

  useEffect(() => {
    if (!value) {
      getCotation(date);
    }
  }, [date]);

  async function getCotation(date) {
    const { min, max } = formatDates(date);

    const response = await axios.get(
      `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${min}'&@dataFinalCotacao='${max}'&$top=5&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`
    );

    if (!response) {
      return;
    }

    setCotation({
      value: response.data.value[0].cotacaoVenda,
    });
    setCotationDate(new Date(response.data.value[0].dataHoraCotacao));
  }

  return { cotationDate, cotation };
}
