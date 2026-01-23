import { TextSpan } from "../../../../components";
import { TD, TR } from "../../../../components/Table";
import { floatToStringExtendDot } from "../../../../components/Utils";
import styled, { css } from "styled-components";

const TRStyled = styled(TR)`
  ${({ theme }) => css`
    td {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  @media screen and (min-width: 40em) {
    position: sticky;
  bottom: 0;
  }
`

export default function TableBenchmark(props) {
  const { itens, typeFuels } = props;


  return (
    <>
      <TRStyled>
        <TD className="pl-2">

        </TD>
        <TD textAlign="center">
        </TD>
        <TD textAlign="center">

        </TD>
        <TD textAlign="center" className="pr-2">

        </TD>
        <TD textAlign="end" className="pr-2">
        </TD>
        <TD textAlign="end" className="pr-2">
          <TextSpan className="ml-1" apparence="s2" hint>
            {floatToStringExtendDot(itens?.reduce((a, b) => a + b.distance, 0), 2)}
          </TextSpan>
        </TD>
        {typeFuels?.map((x, i) => <TD key={`${i}-c-T`} textAlign="end" className="pr-2">
          <TextSpan apparence="s2" hint>
            {floatToStringExtendDot(itens?.reduce((a, b) => a + b.consumption[x.code], 0), 2)}
          </TextSpan>
        </TD>)}
      </TRStyled>
    </>
  );
}
