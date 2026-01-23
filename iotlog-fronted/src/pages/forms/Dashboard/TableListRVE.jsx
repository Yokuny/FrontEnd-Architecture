import { useTheme } from "styled-components";
import { TextSpan } from "../../../components";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from "../../../components/Table";
import { floatToStringExtendDot } from "../../../components/Utils";

export default function TableListRVE(props) {
  const { data } = props;

  const theme = useTheme()

  const calcDiffPercentualComsuption = (deal, daily, font = "s2") => {
    if (daily <= deal) {
      return <TextSpan apparence={font}>
        {floatToStringExtendDot(!daily ? 0 : ((daily * 100) / deal), 1)}%
      </TextSpan>
    }
    if (daily > deal) {
      return <TextSpan apparence={font} style={{ color: theme.colorDanger500 }}>
        {floatToStringExtendDot(!daily ? 0 : ((daily * 100) / deal), 1)}%
      </TextSpan>
    }
  }

  const calcDiffComsuption = (deal, daily, hours, font = "s2") => {
    if (daily <= deal) {
      return <TextSpan apparence={font} style={{ color: theme.colorSuccess500 }}>
        {`${floatToStringExtendDot(((deal - daily) * hours) * -1, 3)}`}
      </TextSpan>
    }
    if (daily > deal) {
      return <TextSpan apparence={font} style={{ color: theme.colorDanger500 }}>
        +{floatToStringExtendDot(((deal - daily) * hours) * -1, 3)}
      </TextSpan>
    }
  }

  const totalBenchamark = data?.length
    ? data.reduce((acc, b) => acc + (((b.consumption / b.hours) - (b.compareContract / 24)) * b.hours), 0)
    : 0

  return <TABLE>
    <THEAD>
      <TRH>
        <TH>
          <TextSpan apparence="s2" hint>
            Embarcação
          </TextSpan>
        </TH>
        <TH textAlign="center">
          <TextSpan apparence="s2" hint>
            Operação
          </TextSpan>
        </TH>
        <TH textAlign="end">
          <TextSpan apparence="s2" hint>
            Horas
          </TextSpan>
        </TH>
        <TH textAlign="end">
          <TextSpan apparence="s2" hint>
            Consumo total (m³)
          </TextSpan>
        </TH>
        <TH textAlign="end">
          <TextSpan apparence="s2" hint>
            Contrato (m³)
          </TextSpan>
        </TH>
        <TH textAlign="end">
          <TextSpan apparence="s2" hint>
            Utilizado (%)
          </TextSpan>
        </TH>
        <TH textAlign="end">
          <TextSpan apparence="s2" hint>
            Diferença (m³)
          </TextSpan>
        </TH>
      </TRH>
    </THEAD>
    <TBODY>
      {data?.sort((a, b) => b.hours - a.hours)?.map((item, index) => {
        return (<TR key={index} isEvenColor={index % 2 === 0}>
          <TD>
            <TextSpan apparence="s2">
              {item.vessel?.name}
            </TextSpan>
          </TD>
          <TD textAlign="center">
            <TextSpan apparence="s2">
              {item.code}
            </TextSpan>
          </TD>
          <TD textAlign="end">
            <TextSpan apparence="s2">
              {floatToStringExtendDot(item.hours, 2)}
            </TextSpan>
          </TD>
          <TD textAlign="end">
            <TextSpan apparence="s2">
              {floatToStringExtendDot(item.consumption, 3)}
            </TextSpan>
          </TD>
          <TD textAlign="end">
            <TextSpan apparence="s2">
              {floatToStringExtendDot(item.compareContract, 1)}
              <TextSpan apparence="p3" className="ml-1">dia</TextSpan>
            </TextSpan>
            <br />
            <TextSpan apparence="s3" hint>
              {floatToStringExtendDot(item.compareContract / 24, 2)}
              <TextSpan apparence="p3" className="ml-1" hint>hr</TextSpan>
            </TextSpan>
          </TD>
          <TD textAlign="end">
            {calcDiffPercentualComsuption(item?.compareContract ? item.compareContract / 24 : 0, item.consumption / item.hours)}
          </TD>
          <TD textAlign="end">
            {calcDiffComsuption(item?.compareContract ? item.compareContract / 24 : 0, item.consumption / item.hours, item.hours)}
          </TD>
        </TR>)
      })}
      {!!data?.length && <TR>
        <TD colSpan="2"></TD>
        <TD textAlign="end">
          <TextSpan apparence="s1">
            {floatToStringExtendDot(data.reduce((acc, b) => acc + b.hours, 0), 2)}
          </TextSpan>
        </TD>
        <TD textAlign="end">
          <TextSpan apparence="s1">
            {floatToStringExtendDot(data.reduce((acc, b) => acc + b.consumption, 0), 3)}
          </TextSpan>
        </TD>
        <TD textAlign="end">
          <TextSpan apparence="s1">
            {/* {floatToStringExtendDot(data.reduce((acc, b) => acc + b.compareContract, 0), 1)} */}
          </TextSpan>
        </TD>
        <TD textAlign="end">
          {/* {calcDiffPercentualComsuption(data.reduce((acc, b) => acc + b.compareMax, 0), data.reduce((acc, b) => acc + b.consumption, 0), "s1")} */}
        </TD>
        <TD textAlign="end">
          <TextSpan apparence="s1" style={{
            color: totalBenchamark < 0
              ? theme.colorSuccess500
              : totalBenchamark > 0 ? theme.colorDanger500
                : theme.textBasicColor
          }}>
            {floatToStringExtendDot(totalBenchamark, 2)}
          </TextSpan>
        </TD>
      </TR>}
    </TBODY>
  </TABLE>

}
