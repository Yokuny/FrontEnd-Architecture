import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { LabelIcon, TextSpan } from "../../../../components";
import { TH, THEAD, TRH } from "../../../../components/Table";

const TheadStyle = styled(THEAD)`
  .position-col-dynamic {
    justify-content: center;
  }
  ${({ theme }) => css`
    th {
      background-color: ${theme.backgroundBasicColor1};
    }
  `}

  position: sticky;
  top: 0;

  @media screen and (max-width: 640px) {
    .position-col-dynamic {
      justify-content: flex-start;
    }
  }
`;

const RowEnd = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  flex-direction: row;
  `;

export default function TableHeaderCO2(props) {

  return (
    <>
      <TheadStyle>
        <TRH>
          <TH className="p-4">
            <TextSpan apparence="p2" hint>
              <FormattedMessage id="name" />
            </TextSpan>
          </TH>
          <TH className="p-2 pr-4" textAlign="end">
            <RowEnd>
              <LabelIcon
                iconName="droplet"
                renderTitle={() => (
                  <TextSpan hint apparence="p2" className="ml-1">
                    <FormattedMessage id="consumption" />
                  </TextSpan>
                )}
              /></RowEnd>
          </TH>
          <TH className="p-2 pr-4" textAlign="end">
            <RowEnd>
              <LabelIcon
                iconName="cloud-upload"
                renderTitle={() => (
                  <TextSpan hint apparence="p2" className="ml-1">
                    CO₂ (KG)
                  </TextSpan>
                )}
              /></RowEnd>
          </TH>
          <TH className="p-2 pr-4" textAlign="end">
            <RowEnd>
              <LabelIcon
                iconName="cloud-upload"
                renderTitle={() => (
                  <TextSpan hint apparence="p2" className="ml-1">
                    CO₂ (Ton)
                  </TextSpan>
                )}
              /></RowEnd>
          </TH>
        </TRH>
      </TheadStyle>
    </>
  );
}
