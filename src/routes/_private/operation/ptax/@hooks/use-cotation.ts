import { format, subDays } from 'date-fns';
import { useCallback, useEffect, useState } from 'react';

interface CotationProps {
  date: string;
  value?: number;
}

export function useCotation({ date, value }: CotationProps) {
  const [cotation, setCotation] = useState<{ value: number | '' }>({ value: '' });
  const [cotationDate, setCotationDate] = useState<Date | null>(null);

  const getCotation = useCallback(async (targetDate: string) => {
    try {
      const dateObj = new Date(targetDate);
      const min = format(subDays(dateObj, 5), 'MM-dd-yyyy');
      const max = format(dateObj, 'MM-dd-yyyy');

      const url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoDolarPeriodo(dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@dataInicial='${min}'&@dataFinalCotacao='${max}'&$top=5&$orderby=dataHoraCotacao%20desc&$format=json&$select=cotacaoCompra,cotacaoVenda,dataHoraCotacao`;

      const response = await fetch(url);
      const data = await response.json();

      if (data?.value && data.value.length > 0) {
        setCotation({
          value: data.value[0].cotacaoVenda,
        });
        setCotationDate(new Date(data.value[0].dataHoraCotacao));
      }
    } catch (error) {
      // biome-ignore lint/suspicious/noConsole: Logging external error
      console.error('Error fetching PTAX cotation:', error);
    }
  }, []);

  useEffect(() => {
    if (!value && date) {
      getCotation(date);
    }
  }, [date, value, getCotation]);

  return { cotationDate, cotation };
}
