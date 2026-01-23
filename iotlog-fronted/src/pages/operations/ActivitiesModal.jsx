import { Col, Container, Row } from "@paljs/ui";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import styled, { useTheme } from "styled-components";
import { Modal, TextSpan } from "../../components";
import { floatToStringExtendDot } from "../../components/Utils";
import { ActivitiesBar } from "./ActivitiesBar";

const KNOTS_IN_KILOMETER_PER_HOUR = 1.852;

const MetricContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.1rem;
  white-space: nowrap;
`;

const ActivityContainer = styled(Container)`
  margin: 1.5rem;

  @media (max-width: 768px) {
    margin: 1rem 0.5rem;
  }
`;

const ChartContainer = styled.div`
  width: 100%;
  margin: 1.5rem 0;
  padding: 0 1.5rem;
  overflow-x: auto;

  & > * {
    min-width: 100%;
    white-space: nowrap;
  }

  @media (max-width: 768px) {
    padding: 0 0.5rem;
    margin: 1rem 0;
  }
`;

const InfoRow = styled(Row)`
  margin-bottom: 1rem;
  row-gap: 0.75rem;

  @media (max-width: 768px) {
    margin-bottom: 0.75rem;
    row-gap: 0.75rem;
  }
`;

const InfoBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 0.5rem;
  border: 1px solid ${(props) => props.theme.borderBasicColor3};
  border-radius: 10px;
  min-height: 80px;
  width: 100%;

  @media (max-width: 768px) {
    min-height: 70px;
    padding: 0.5rem 0.25rem;
    gap: 0.25rem;
  }
`;

export function AcitivitiesModal({ data, onClose }) {
  const intl = useIntl();
  const diffDate = (startDate, endDate) => {
    return moment(endDate).diff(startDate, "minutes", true);
  };

  const avgSpeed = (diffDate, distance) => {
    if (diffDate <= 0) {
      return "-";
    }

    return `${floatToStringExtendDot(distance / diffDate / KNOTS_IN_KILOMETER_PER_HOUR)} ${intl.formatMessage({
      id: "kn",
    })}`;
  };

  return (
    <Modal
      onClose={onClose}
      hideOnBlur={true}
      title={data.resource.name}
      size="ExtraLarge"
      show={!!data}
      styleContent={{ overflowX: "hidden", overflowY: "scroll" }}
      styleModal={{ padding: "4rem" }}
      style={{ padding: window.innerWidth <= 768 ? "1rem" : "4rem" }}>
      {!!data.activities.length && (
        <ChartContainer>
          <ActivitiesBar data={data} />
        </ChartContainer>
      )}
      {data.activities.map((activity) => (
        <ActivityContainer key={activity.id}>
          <InfoRow>
            <Col>
              <TextSpan apparence="h5">{activity.name}</TextSpan>
            </Col>
          </InfoRow>
          <InfoRow>
            <Col breakPoint={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
              <InfoBox>
                <TextSpan apparence="c2" hint>
                  <FormattedMessage id="date.start" />
                </TextSpan>
                <TextSpan apparence="s1">{moment(activity.startDate).format("lll")}</TextSpan>
              </InfoBox>
            </Col>

            <Col breakPoint={{ lg: 6, md: 6, sm: 12, xs: 12 }}>
              <InfoBox>
                <TextSpan apparence="c2" hint>
                  <FormattedMessage id="date.end" />
                </TextSpan>
                <TextSpan apparence="s1">{moment(activity.endDate).format("lll")}</TextSpan>
              </InfoBox>
            </Col>
          </InfoRow>
          <InfoRow>
            <Col breakPoint={{ lg: 3, md: 6, sm: 6, xs: 6 }}>
              <InfoBox>
                <TextSpan apparence="c2" hint>
                  <FormattedMessage id="distance" />
                </TextSpan>
                <MetricContainer>
                  <TextSpan apparence="h6">{floatToStringExtendDot(activity.distance, 2)}</TextSpan>
                  <TextSpan apparence="c2" hint>
                    nm
                  </TextSpan>
                </MetricContainer>
              </InfoBox>
            </Col>
            <Col breakPoint={{ lg: 3, md: 6, sm: 6, xs: 6 }}>
              <InfoBox>
                <TextSpan apparence="c2" hint>
                  <FormattedMessage id="speed.avg" />
                </TextSpan>
                <MetricContainer>
                  <TextSpan apparence="h6">
                    {floatToStringExtendDot(
                      activity.distance / diffDate(activity.startDate, activity.endDate) / KNOTS_IN_KILOMETER_PER_HOUR,
                      2
                    )}
                  </TextSpan>
                  <TextSpan apparence="c2" hint>
                    {intl.formatMessage({ id: "kn" })}
                  </TextSpan>
                </MetricContainer>
              </InfoBox>
            </Col>
            <Col breakPoint={{ lg: 3, md: 6, sm: 6, xs: 6 }}>
              <InfoBox>
                <TextSpan apparence="c2" hint>
                  <FormattedMessage id="duration" />
                </TextSpan>
                <MetricContainer>
                  <TextSpan apparence="h6">
                    {floatToStringExtendDot(diffDate(activity.startDate, activity.endDate), 2)}
                  </TextSpan>
                  <TextSpan apparence="c2" hint>
                    min
                  </TextSpan>
                </MetricContainer>
              </InfoBox>
            </Col>
            <Col breakPoint={{ lg: 3, md: 6, sm: 6, xs: 6 }}>
              <InfoBox>
                <TextSpan apparence="c2" hint>
                  <FormattedMessage id="consumption" />
                </TextSpan>
                <MetricContainer>
                  <TextSpan apparence="h6">{floatToStringExtendDot(activity.consumption, 3)}</TextSpan>
                  <TextSpan apparence="c2" hint>
                    m³
                  </TextSpan>
                </MetricContainer>
              </InfoBox>
            </Col>
          </InfoRow>
        </ActivityContainer>
      ))}
    </Modal>
  );
}
