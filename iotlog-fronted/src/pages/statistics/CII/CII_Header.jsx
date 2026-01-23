import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { TH, THEAD, TRH } from "../../../components/Table";
import { TextSpan } from "../../../components";

const Col = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`

const TheadStyle = styled(THEAD)`
${({ theme }) => css`
    th {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  .position-col-dynamic {
    justify-content: center;
  }

  position: sticky;
  top: 0;

  @media screen and (max-width: 640px) {
    .position-col-dynamic {
      justify-content: flex-start;
    }
  }
`;

export default function CII_Header(props) {

  const years = [
    2023,
    2024,
    2025,
    2026,
    2027,
  ]

  let reduceYear = 5;

  return (
    <>
      <TheadStyle>
        <TRH>
          <TH style={{ width: 80 }} className="p-2"></TH>
          <TH className="p-2">
            <TextSpan apparence="p2">
              <FormattedMessage id="name" />
            </TextSpan>
          </TH>
          <TH className="p-2" textAlign="end">
            <TextSpan apparence="p2">
              DWT
            </TextSpan>
          </TH>
          <TH className="p-2" textAlign="end" style={{ maxWidth: 60 }}>
            <TextSpan apparence="p2">
              Gross Tonnage
            </TextSpan>
          </TH>
          <TH className="p-2" textAlign="end">
            <TextSpan apparence="p2">
              CII Ref
            </TextSpan>
          </TH>
          {years.map((year, index) => (
            <TH key={index} className="p-2" textAlign="center">
              <Col>
                <TextSpan apparence={new Date().getFullYear() === year ? "s1" : "p2"}>
                  {year} ({reduceYear + (index * 2)}%)
                </TextSpan>
                <TextSpan hint apparence=
                {new Date().getFullYear() === year ? "label" : "p2"}>
                  <FormattedMessage id={
                    new Date().getFullYear() === year
                    ? "actual"
                    : new Date().getFullYear() < year
                      ? "projected"
                      : "past"} />
                </TextSpan>
              </Col>
            </TH>))}
        </TRH>
      </TheadStyle>
    </>
  );
}
