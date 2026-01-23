import { Spinner } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { TextSpan } from "../../../../components";
import { floatToStringExtendDot } from "../../../../components/Utils";

const InfoCardContainer = styled.div`
  border-width: 1px;
  border-radius: 4px;
  padding: 48px;
  border-color: ${props => props.theme.borderBasicColor3};
  border-style: solid;
  max-width: 50%;
  min-width: 280px;
  flex-grow: 1;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

const NotProvided = styled.span`
  color: ${props => props.theme.textDisabledColor};
  font-size: 12px;
`;

const SubtitleSpacer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 24px;
`;

const Title = styled.span`
  font-weight: 700;
  font-size: 16px;
  text-transform: uppercase;
`;

const ConsumptionInfoCard = ({ isLoading, supplyConsumption, title }) => {

  function notProvided() {
    return (
      <NotProvided>
        {/* <FormattedMessage id="not.provided" /> */}
        -
      </NotProvided>
    )
  }

  if (isLoading) return <Spinner />

  return (
    <InfoCardContainer>

      <Title>
        <FormattedMessage id={title} />
      </Title>

      <Column>
        <SubtitleSpacer>
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="machine.supplies.consumption.received" />
          </TextSpan>
        </SubtitleSpacer>

        <TextSpan apparence="s2" className="pl-1">
          {floatToStringExtendDot(supplyConsumption.received.quantity , 3)} {supplyConsumption.received.unit}
        </TextSpan>

        <SubtitleSpacer>
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="machine.supplies.consumption.supplied" />
          </TextSpan>
        </SubtitleSpacer>

        <TextSpan apparence="s2" className="pl-1">
          {floatToStringExtendDot(supplyConsumption.supply.quantity, 3) || notProvided()} {supplyConsumption.supply.unit}
        </TextSpan>

        <SubtitleSpacer className="mb-1">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="machine.supplies.consumption.consumed" />
          </TextSpan>
        </SubtitleSpacer>

        <TextSpan apparence="s2" className="pl-1">
          {floatToStringExtendDot(supplyConsumption.consumed.quantity,3)} {supplyConsumption.consumed.unit}
          </TextSpan>

        <SubtitleSpacer className="mb-1">
          <TextSpan apparence="p2" hint>
            <FormattedMessage id="machine.supplies.consumption.stock" />
          </TextSpan>
        </SubtitleSpacer>

        <TextSpan apparence="s2" className="pl-1">
          {floatToStringExtendDot(supplyConsumption.stock.quantity,3)} {supplyConsumption.stock.unit}
        </TextSpan>

      </Column>
    </InfoCardContainer>
  )
}

export default ConsumptionInfoCard;
