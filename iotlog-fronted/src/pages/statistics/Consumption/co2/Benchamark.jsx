import styled, { css, useTheme } from "styled-components";
import { TD, TR } from "../../../../components/Table";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { TextSpan } from "../../../../components";

const TRStyled = styled(TR)`
  ${({ theme }) => css`
    td {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  z-index: 10;

  @media screen and (min-width: 40em) {
    position: sticky;
    bottom: 0px;
  }
`

export default function Benchamark(props) {
  const { itens, unit } = props;

  const totalAll = itens?.reduce(
    (a, b) => a + b.consumption,
    0
  );

  const totalCo2 = itens?.reduce(
    (a, b) => a + (b.oilDetails?.length > 1 ? b.oilDetails.reduce((acc, item) => acc + item.co2, 0) : b.co2),
    0
  );


  const someDifferentOils = itens?.some((item) => item.oilDetails?.length > 1);

  const typeFuels = [...new Set(itens?.map((item) => item.oilDetails?.map((oil) => oil.type)).flat())];

  return (
    <>
      <TRStyled>
        <TD className="p-4">
          <TextSpan apparence="p2" hint className="pt-2 pb-2">Total</TextSpan>
        </TD>
        <TD textAlign="end" className="pr-4">
          {someDifferentOils
            ? <>
              {typeFuels.map((type, index) => (
                <div key={index}>
                  <TextSpan apparence="s3" hint>
                    {type}
                  </TextSpan>
                  <TextSpan apparence="s2" className="ml-1">
                    {floatToStringExtendDot(
                      itens?.filter((item) => item.oilDetails?.some((oil) => oil.type === type))
                        .reduce((acc, curr) => acc + curr.oilDetails.find((oil) => oil.type === type).consumption, 0)
                    )}
                    <TextSpan apparence="p3" hint className="ml-1">
                      {unit?.value}
                    </TextSpan>
                  </TextSpan>
                </div>
              ))}
            </>
            : <TextSpan apparence="s2">
              {floatToStringExtendDot(totalAll, 2)}
              <TextSpan apparence="p3" hint className="ml-1">
                {unit?.value}
              </TextSpan>
            </TextSpan>}
        </TD>
        <TD textAlign="end" className="pr-4">
          <TextSpan className="ml-1" apparence="s2">
            {floatToStringExtendDot(
              totalCo2 || 0
            )}
            <TextSpan
              apparence="p3"
              className="ml-1"
              hint
            >KG</TextSpan>
          </TextSpan>
        </TD>
        <TD textAlign="end" className="pr-4">
          <TextSpan className="ml-1" apparence="s2">
            {floatToStringExtendDot(
              Number((totalCo2 || 0) / 1000)
            )}
            <TextSpan
              apparence="p3"
              className="ml-1"
              hint
            >Ton</TextSpan>
          </TextSpan>
        </TD>
      </TRStyled>
    </>
  )
}
