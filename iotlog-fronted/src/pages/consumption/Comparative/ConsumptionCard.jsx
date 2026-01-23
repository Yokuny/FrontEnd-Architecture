import React, { useState } from 'react';
import { CardBody, CardHeader, EvaIcon, Row, Button, Col, Badge } from '@paljs/ui';
import styled from 'styled-components';
import { FormattedMessage, useIntl } from 'react-intl';
import { loadAndGet } from "./DecodeSeries";
import { floatToStringExtendDot } from '../../../components/Utils';
import { CardNoShadow, Fetch, TextSpan } from '../../../components';
import ChartComparative from './ChartComparative';
import { toast } from 'react-toastify';
import { SkeletonThemed } from '../../../components/Skeleton';

const Img = styled.img`
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  object-fit: cover;
`;

const ConsumptionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 0.5rem 1rem;
`;

const BoxesRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
  gap: 0.5rem;
  width: 100%;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ConsumptionBoxesContainer = styled(BoxesRow)`
  flex: 1;
`;

const ConsumptionBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${props => props.theme.backgroundBasicColor2};
  border-radius: 0.5rem;
  flex: 1;
  min-width: 0;

  @media (max-width: 768px) {
    min-height: 80px;
  }
`;


const IconContainer = styled.div`
  margin-right: 0.5rem;
  display: flex;
  align-items: center;
  color: ${props => props.theme.textHintColor};
`;

export const ConsumptionCardHeader = (props) => {
  return (
    <Row className="m-0 pb-3">
      <Col breakPoint={{ md: 4 }}>
        <Row className="m-0" middle="xs" start="md" center="xs">
          <TextSpan apparence="p2" hint className="mr-4">
            <FormattedMessage id="machine" />
          </TextSpan>
        </Row>
      </Col>
      <Col breakPoint={{ md: 1 }}>
        <Row className="m-0" middle="xs" center="xs">
          <TextSpan apparence="p2" hint className="mr-4">
            <FormattedMessage id="type" />
          </TextSpan>
        </Row>
      </Col>
      <Col breakPoint={{ md: 2 }}>
        <Row className="m-0" middle="xs" end="md" center="xs">
          <TextSpan apparence="p2" hint className="mr-4">
            <FormattedMessage id="manual" />
          </TextSpan>
        </Row>
      </Col>
      <Col breakPoint={{ md: 2 }}>
        <Row className="m-0" middle="xs" end="md" center="xs">
          <TextSpan apparence="p2" hint className="mr-4">
            <FormattedMessage id="telemetry" />
          </TextSpan>
        </Row>
      </Col>
      <Col breakPoint={{ md: 2 }}>
        <Row className="m-0" middle="xs" end="md" center="xs">
          <TextSpan apparence="p2" hint className="mr-4">
            <FormattedMessage id="diff" />
          </TextSpan>
        </Row>
      </Col>
      <Col breakPoint={{ md: 1 }}>
      </Col>
    </Row>
  );
}

const ConsumptionCard = (props) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [consumptionReadings, setConsumptionReadings] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { data, filterQuery } = props;

  const {
    machine,
    consumptionSources,
  } = data;

  const intl = useIntl();

  React.useEffect(() => {
    if (isExpanded) {
      getConsumptions();
    }
  }, [isExpanded]);

  const getConsumptions = () => {
    if (!machine?.id || consumptionReadings?.length) {
      return;
    }
    setIsLoading(true);
    const query = []
    if (filterQuery?.dateMin) {
      query.push(`dateMin=${filterQuery.dateMin}`);
    }
    if (filterQuery?.dateMax) {
      query.push(`dateMax=${filterQuery.dateMax}`);
    }
    if (filterQuery?.idEnterprise) {
      query.push(`idEnterprise=${filterQuery.idEnterprise}`);
    }
    if (filterQuery?.unit) {
      query.push(`unit=${filterQuery.unit}`);
    }
    if (filterQuery?.viewType) {
      query.push(`viewType=${filterQuery.viewType}`);
    }
    const root = loadAndGet();
    const TimeSeriesCollection = root.lookupType('timeseries.TimeSeriesCollection');

    Fetch.get(`/consumption/comparative/${machine.id}?${query.join("&")}`,
      {
        responseType: 'arraybuffer',
        defaultTakeCareError: false,
      })
      .then(response => {
        const buffer = new Uint8Array(response.data);
        const collection = TimeSeriesCollection.decode(buffer)?.series || [];
        if (!collection?.length) {
          setIsLoading(false);
          return;
        }
        setConsumptionReadings(collection);
      })
      .catch((e) => {
        if (e?.response?.status === 400) {
          toast.warn(intl.formatMessage({ id: "error.query.fields" }));
        } else {
          toast.error(intl.formatMessage({ id: "error.get" }));
        }
        setConsumptionReadings([]);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const manualValue = consumptionSources?.manual?.value || 0;
  const telemetryValue = consumptionSources?.telemetry?.value || 0;
  const difference = manualValue - telemetryValue;
  const differencePercentage = telemetryValue ? (difference / telemetryValue) * 100 : 0;

  const existsDiff = !!manualValue && !!telemetryValue;

  return (
    <CardNoShadow style={{ width: '100%' }}>
      <CardHeader style={{ borderBottom: 'none' }}>
        <Row className="m-0" between="xs" middle="xs">
          <Col breakPoint={{ md: 4 }}>
            <Row className="m-0 pb-2 pt-2" middle="xs">
              {machine?.image?.url ? (
                <Img src={machine.image.url} alt={machine.name} />
              ) : (
                <Img src="/assets/images/vessel-placeholder.png" alt={machine.name} />
              )}
              <TextSpan apparence="s1" className="ml-3">
                {machine?.name}
              </TextSpan>
            </Row>
          </Col>
          <Col breakPoint={{ md: 1 }}>
            <Badge
              status={filterQuery?.viewType !== "consumption" ? "Basic" : "Info"}
              className="ml-3"
              style={{
                position: 'relative',
              }}
            >
              <FormattedMessage id={filterQuery?.viewType === "consumption" ? "consumption" : "stock"} />
            </Badge>
          </Col>

          <Col breakPoint={{ md: 2 }}>
            <Row className="m-0 pb-2 pt-2" middle="xs" end="md" center="sm">
              <Button
                appearance="outline"
                style={{ border: 0, padding: `0.4rem 0.6rem` }}
                className="flex-between mr-3"
                status="Warning"
              >
                <EvaIcon
                  name="edit-outline"
                  className="mr-2"
                />
                {floatToStringExtendDot(manualValue, 2)}
                <TextSpan apparence="p3" className="ml-1">
                  {consumptionSources?.manual?.unit}
                </TextSpan>
              </Button>
            </Row>
          </Col>
          <Col breakPoint={{ md: 2 }}>
            <Row className="m-0 pb-2 pt-2" middle="xs" end="md" center="xs">
              <Button
                appearance="outline"
                style={{ border: 0, padding: `0.4rem 0.6rem` }}
                className="flex-between"
                status="Info"
              >
                <EvaIcon
                  name="activity-outline"
                  className="mr-2"
                />
                {floatToStringExtendDot(telemetryValue, 2)}
                <TextSpan apparence="p3" className="ml-1">
                  {consumptionSources?.manual?.unit}
                </TextSpan>
              </Button>
            </Row>
          </Col>
          <Col breakPoint={{ md: 2 }}>
            <Row className="m-0 pb-2 pt-2" middle="xs" end="md" center="xs">
              <Button
                appearance="ghost"
                style={{ border: 0, padding: `0.4rem 0.6rem`, marginRight: '-0.6rem' }}
                className={existsDiff ? "flex-between" : ""}
                status={existsDiff
                  ? differencePercentage <= 0 ? "Danger" : "Basic"
                  : "Basic"}
              >
                {existsDiff && (
                  <EvaIcon
                    name={differencePercentage > 0 ? "trending-up" : "trending-down"}
                    className="mr-2"
                  />
                )}
                {existsDiff ? floatToStringExtendDot(differencePercentage, 1) : ''}
                {existsDiff && <TextSpan apparence="p3" className="ml-1">%</TextSpan>}
              </Button>
            </Row>
          </Col>
          <Col breakPoint={{ md: 1 }}>
            <Row className="m-0" middle="xs" end="md" center="xs">
              <Button
                appearance="ghost"
                style={{ border: 0, padding: `0.4rem 0.6rem` }}
                status="Basic"
                disabled={isLoading}
                className="ml-2"
                onClick={() => setIsExpanded(prev => !prev)}
              >
                <EvaIcon name={isExpanded ? "arrow-ios-upward-outline" : "arrow-ios-downward-outline"} />
              </Button>
            </Row>
          </Col>
        </Row>
      </CardHeader>
      {isLoading
        ? <CardBody>
          <Row className="m-0" middle="xs" center="xs">
            <Col breakPoint={{ xs: 4, md: 4 }} className='mb-4'>
              <SkeletonThemed height={80} />
            </Col>
            <Col breakPoint={{ xs: 4, md: 4 }} className='mb-4'>
              <SkeletonThemed height={80} />
            </Col>
            <Col breakPoint={{ xs: 4, md: 4 }} className='mb-4'>
              <SkeletonThemed height={80} />
            </Col>
            <Col breakPoint={{ xs: 12, md: 12 }}>
              <SkeletonThemed height={300} />
            </Col>
          </Row>
        </CardBody>
        : <>
          {isExpanded && !!consumptionReadings?.length && (<CardBody>
            <ConsumptionSection>
              <ConsumptionBoxesContainer>
                <ConsumptionBox>
                  <Row className="m-0" middle="xs">
                    <IconContainer>
                      <EvaIcon name="edit-outline" />
                    </IconContainer>
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="manual" />
                    </TextSpan>
                  </Row>
                  <TextSpan apparence="h6" className="ml-1">
                    {floatToStringExtendDot(manualValue, 2)}{' '}
                    <TextSpan apparence="s2">{consumptionSources?.manual?.unit}</TextSpan>
                  </TextSpan>
                </ConsumptionBox>

                <ConsumptionBox>
                  <Row className="m-0" middle="xs">
                    <IconContainer>
                      <EvaIcon name="activity-outline" />
                    </IconContainer>
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="telemetry" />
                    </TextSpan>
                  </Row>
                  <TextSpan apparence="h6" className="ml-1">
                    {floatToStringExtendDot(telemetryValue, 2)}{' '}
                    <TextSpan apparence="s2">{consumptionSources?.sounding?.unit}</TextSpan>
                  </TextSpan>
                </ConsumptionBox>

                <ConsumptionBox>
                  <Row className="m-0" middle="xs">
                    <IconContainer>
                      <EvaIcon name="droplet-off-outline" />
                    </IconContainer>
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="diff" />
                    </TextSpan>
                  </Row>
                  <Row className="m-0" middle="xs">
                    <TextSpan apparence="h6"
                      status={existsDiff && differencePercentage <= 0 && "Danger"} className="ml-1">
                      {existsDiff ? floatToStringExtendDot(difference, 2) : "-"}{' '}
                      {existsDiff && <TextSpan apparence="s2">{consumptionSources?.manual?.unit}</TextSpan>}
                    </TextSpan>
                  </Row>
                </ConsumptionBox>

                <ConsumptionBox>
                  <Row className="m-0" middle="xs">
                    <IconContainer>
                      <EvaIcon name={
                        existsDiff ? (differencePercentage > 0 ? "trending-up" : "trending-down") : "trending-up"
                      } />
                    </IconContainer>
                    <TextSpan apparence="p2" hint>
                      <FormattedMessage id="percent" />
                    </TextSpan>
                  </Row>
                  <TextSpan apparence="h6" status={existsDiff && differencePercentage <= 0 && "Danger"} className="ml-1">
                    {existsDiff ? floatToStringExtendDot(differencePercentage, 1) : "-"}
                    {existsDiff && <TextSpan apparence="s2">%</TextSpan>}
                  </TextSpan>
                </ConsumptionBox>
              </ConsumptionBoxesContainer>
            </ConsumptionSection>

            <ChartComparative
              consumptionReadings={consumptionReadings}
              unit={filterQuery?.unit}
            />
          </CardBody>)}
        </>}
    </CardNoShadow>
  );
};

export default ConsumptionCard;
