import React from 'react';
import { Card, CardBody, CardHeader, CardFooter } from '@paljs/ui/Card';
import Row from '@paljs/ui/Row';
import styled, { ThemeProvider, css } from 'styled-components';
import moment from 'moment';
import { Fetch, TextSpan, UserImage } from '../../../components';
import themes from '../../../themes';
import { floatToStringExtendDot } from '../../../components/Utils';
import { SkeletonThemed } from '../../../components/Skeleton';
import { ArrowForward, Anchor, Crane } from '../../../components/Icons';

const DivContent = styled.span`

  ${({ theme, status, noBorder = false }) => css`
    padding: 2px 4px;
    background-color: ${theme[`color${status}${status !== 'Basic' ? '100' : '200'}`]};
    color: ${theme[`color${status}700`]};
    ${!noBorder && `border: 1px solid ${theme[`color${status}100`]};`}
    border-radius: 4px;
    font-size: 12px;
    flex-wrap: nowrap;

    svg {
      fill: ${theme[`color${status}700`]};
    }
  `}

  .span-title {
    font-size: 10px !important;
  }
`

const STATUS_NEAR_PORT = ["ARRIVAL", "ANCHORAGE"]

function formatTimeDifference(dateTime) {
  const now = moment();
  const pastDateTime = moment(dateTime);
  const duration = moment.duration(now.diff(pastDateTime));

  if (duration.asHours() < 1) {
    return `${Math.floor(duration.asMinutes())}m`;
  } else {
    return `${Math.floor(duration.asHours())}h`;
  }
}

export default function CardDetailsVessel({ imo }) {

  const [data, setData] = React.useState()
  const [isLoading, setIsLoading] = React.useState(false)

  React.useEffect(() => {
    if (!imo) return
    getData(imo)

    return () => {
      setData()
    }
  }, [imo])

  const getData = async (imo) => {
    setIsLoading(true)
    try {
      const response = await Fetch.get(`/integrationthird/ais/vessel/info?imo=${imo}`);
      setData(response.data);
    }
    catch (error) {
    }
    finally {
      setIsLoading(false)
    }
  }

  return <>
    <ThemeProvider theme={themes("default", "ltr")}>
      <Card style={{ minWidth: 320 }}>
        {isLoading
          ? <CardBody style={{ minWidth: 310 }}>
            <SkeletonThemed
              height={10}
              count={4}
            />
          </CardBody>
          :
          <>
            <CardHeader>
              <Row between='xs' middle='xs' className='m-0'>
                <UserImage
                  size="Large"
                  image={data?.profilePictureUrl}
                  name={data?.name}
                  title={`${data?.segment?.label} / ${data?.subSegment?.label}`}
                />

                <TextSpan apparence='p2' hint>
                  {formatTimeDifference(data?.ais?.lastSeen)}
                </TextSpan>
              </Row>
            </CardHeader>
            <CardBody >
              <Row between='xs' className="m-0">
                {data?.ais?.sog !== undefined && <DivContent
                  status="Primary"
                >
                  <span className="span-title">Nós:</span> {floatToStringExtendDot(data?.ais?.sog || 0, 1)}
                </DivContent>}

                {data?.dwtSummer && <DivContent
                  status="Basic"
                >
                  <span className="span-title">DWT:</span> {data?.dwtSummer}
                </DivContent>}

                {data?.teu && <DivContent
                  status="Basic"
                >
                  <span className="span-title">TEU:</span> {data?.teu}
                </DivContent>}



                {data?.buildYear && <DivContent
                  status="Basic"
                >
                  <span className="span-title">Built:</span> {data?.buildYear}
                </DivContent>}
              </Row>
            </CardBody>
            {data?.portActivity?.status &&
              STATUS_NEAR_PORT.includes(data?.portActivity?.status)
              ?
              <CardFooter>
                <Row between='xs' middle='xs' className="m-0">
                  {data?.portActivity?.status === "ARRIVAL"
                    ? <DivContent
                      status="Control"
                      noBorder
                    >
                      <Crane
                        style={{
                          height: 12,
                          width: 12,
                          marginRight: 5,
                          marginTop: 2,
                          marginLeft: 2
                        }}
                      />
                      Moored at: <strong>{data?.portActivity?.port?.id}</strong>
                    </DivContent>
                    : <DivContent
                      status="Warning"
                      noBorder
                    >
                      <Anchor
                        style={{
                          height: 12,
                          width: 12,
                          marginRight: 5,
                          marginTop: 2,
                          marginLeft: 2
                        }}
                      />
                      Anchored at: <strong>{data?.portActivity?.port?.id}</strong>
                    </DivContent>}
                  {data?.portActivity?.port?.name &&
                    <TextSpan apparence='p2' hint>
                      {data?.portActivity?.port?.name}
                    </TextSpan>}
                </Row>
              </CardFooter>
              :
              <>
                {data?.aisReport &&
                  <CardFooter>
                    <Row between="xs" middle="xs" className="m-0">
                      <TextSpan apparence='p2'>
                        {data?.portActivity?.port?.id}
                        <br />
                        <TextSpan apparence='p3' hint>
                          {data?.portActivity?.port?.name}
                        </TextSpan>
                      </TextSpan>
                      <ArrowForward
                        style={{
                          height: 18,
                          width: 18
                        }}/>
                      <TextSpan apparence='p2'>
                        {data?.aisReport?.destinationStatus?.reportedDestinationPort?.id || data?.aisReport?.destinationStatus?.reportedDestination}
                        <br />
                        {data?.aisReport?.destinationStatus?.reportedDestinationPort?.name &&
                          <>
                            <TextSpan apparence='p3' hint>
                              {data?.aisReport?.destinationStatus?.reportedDestinationPort?.name}
                            </TextSpan>
                            <br />
                          </>}
                        <TextSpan apparence='c2' hint>
                          ETA: {moment(data?.aisReport?.eta).format('DD,MMM HH:mm')}
                        </TextSpan>

                      </TextSpan>
                    </Row>
                  </CardFooter>}
              </>}
          </>
        }
      </Card>
    </ThemeProvider>
  </>;
}
