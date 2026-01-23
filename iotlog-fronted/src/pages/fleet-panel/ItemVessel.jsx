import { Badge, CardHeader, Col, EvaIcon, Row, Tooltip } from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import { floatToStringExtendDot, getDifferenceDateAgo } from "../../components/Utils";
import Proximity from "../fleet/Proximity";
import StatusAsset from "./StatusAsset";
import { CardNoShadow, TextSpan } from "../../components";
import { Barrel } from "../../components/Icons";


const Img = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  margin-left: 0.015rem;
  margin-right: 0.015rem;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .rotate {
    animation: rotation 2s infinite linear;
  }

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const RowBetween = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`

const DivFillColor = styled.div`
  ${({ theme, status }) => css`
    background-color: ${theme[`color${status}500`]};
    /* border-radius: 50%; */
    /* width: 3.45rem;
    height: 1.45rem; */
    border-radius: 0.15rem;
    padding: 0rem 0.25rem;
    line-height: 0.75rem;
    position: absolute;
    right: 1.3rem;
    top: 14.8rem;
    color: #fff;
  `}
`

export default function ItemVessel(props) {

  const { data } = props;
  const intl = useIntl();
  const theme = useTheme();

  const getStatusByDate = (date) => {
    if (!date) return 'Basic';

    const diff = moment().diff(date, 'minutes');
    if (diff < 120) {
      return 'Info';
    } else if (diff < 1440) {
      return 'Warning';
    } else {
      return 'Danger';
    }
  }

  return (<>
    <CardNoShadow>
      <CardHeader>
        <Row between="xs" middle="xs">
          <TextSpan apparence="s2" hint>
            {data?.name}
          </TextSpan>
          <StatusAsset engines={data?.tree?.engineMain} />
        </Row>
      </CardHeader>
      <Content>
        <Img src={data?.image?.url} alt={data?.name} />
        <DivFillColor
          status={getStatusByDate(new Date(data?.tree?.lastUpdated))}>
          <Tooltip
            trigger="hover"
            placement="top"
            content={`${intl.formatMessage({ id: 'last.date.acronym' })}: ${moment(data?.tree?.lastUpdated).format('DD/MMM/YYYY HH:mm:ss')}`}
          >
            <TextSpan apparence="c3">
              {getDifferenceDateAgo(data?.tree?.lastUpdated, intl).match(/\d+/)[0]}
            </TextSpan>
            <TextSpan apparence="p4">
              {getDifferenceDateAgo(data?.tree?.lastUpdated, intl)
                .replace(/\d+/g, '')
                .slice(0, 4)}
            </TextSpan>
          </Tooltip>
        </DivFillColor>

        <Col className="mt-4">
          {data?.tree?.engineMain?.map((x, i) =>
            <>
              {x.rpm !== undefined && <RowBetween
                key={i + 'jed'}
                className="mb-2"
              >
                <RowFlex>
                  <EvaIcon
                    name="settings-2-outline"
                    status={x.isRunning ? "Info" : "Basic"}
                    className={x.isRunning ? `rotate` : ''}
                  />
                  <Badge
                    status={x.isRunning ? "Info" : "Basic"}
                    position=""
                    style={{ marginLeft: `1.5rem`, padding: `0.13rem 0.17rem` }}
                  >
                    {x.title}
                  </Badge>
                </RowFlex>
                <RowFlex>
                  <TextSpan apparence="s2">
                    {floatToStringExtendDot(x.rpm || 0, 1)}
                    <TextSpan apparence="p3" hint className="ml-1">
                      RPM
                    </TextSpan>
                  </TextSpan>
                </RowFlex>
              </RowBetween>}
              {x.load?.value !== undefined && <RowBetween
                key={i + 'jed'}
                className="mb-2"
              >
                <RowFlex>
                  <EvaIcon
                    name="settings-2-outline"
                    status={x.load?.value ? "Info" : "Basic"}
                    className={x.load?.value ? `rotate` : ''}
                  />
                  <Badge
                    status={x.load?.value ? "Info" : "Basic"}
                    position=""
                    style={{ marginLeft: `1.5rem`, padding: `0.13rem 0.17rem` }}
                  >
                    {x.title}
                  </Badge>
                </RowFlex>
                <RowFlex>
                  <TextSpan apparence="s2">
                    {floatToStringExtendDot(x.load?.value || 0, 1)}
                    <TextSpan apparence="p3" hint className="ml-1">
                      {x.load?.unit}
                    </TextSpan>
                  </TextSpan>
                </RowFlex>
              </RowBetween>}
              {x.consumption?.value === undefined
                ? <></>
                : <RowBetween
                  key={i + 'consF'}
                  className="mb-2"
                >
                  <RowFlex>
                    <EvaIcon
                      name="droplet-off"
                      status={x.isRunning ? "Info" : "Basic"}
                    />
                    <Badge
                      status={x.isRunning ? "Info" : "Basic"}
                      position=""
                      style={{ marginLeft: `1.5rem`, padding: `0.13rem 0.17rem` }}
                    >
                      {x.title}
                    </Badge>
                  </RowFlex>
                  <RowFlex>
                    <TextSpan apparence="s2">
                      {floatToStringExtendDot(x?.consumption?.value || 0, 1)}
                      <TextSpan apparence="p3" hint className="ml-1">
                        {x?.consumption?.unit}
                      </TextSpan>
                    </TextSpan>
                  </RowFlex>
                </RowBetween>}
            </>)}
          {data?.tree?.engineMain?.map((x, i) =>
            <>
              {x.hoursOperation === undefined
                ? <></>
                : <RowBetween
                  key={i + 'Hd'}
                  className="mb-2"
                >
                  <RowFlex>
                    <EvaIcon
                      name="clock-outline"
                      status={x.isRunning ? "Info" : "Basic"}
                    />
                    <Badge
                      status={x.isRunning ? "Info" : "Basic"}
                      position=""
                      style={{ marginLeft: `1.5rem`, padding: `0.13rem 0.17rem` }}
                    >
                      {x.title}
                    </Badge>
                  </RowFlex>
                  <RowFlex>
                    <TextSpan apparence="s2">
                      {floatToStringExtendDot(x.hoursOperation || 0, 1)}
                      <TextSpan apparence="p3" hint className="ml-1">
                        HR
                      </TextSpan>
                    </TextSpan>
                  </RowFlex>
                </RowBetween>
              }
            </>)}
          {data?.tree?.generator?.map((x, i) =>
            <RowBetween
              key={i}
              className="mb-2"
            >
              <RowFlex>
                <EvaIcon
                  name={x.isRunning ? "flash" : "flash-outline"}
                  status={x.isRunning ? "Warning" : "Basic"}
                />

                <Badge
                  status={"Basic"}
                  position=""
                  style={{ marginLeft: `1.5rem`, padding: `0.13rem 0.17rem` }}
                >
                  {x.title}
                </Badge>

              </RowFlex>
              <RowFlex>
                <TextSpan apparence="s3">
                  {x.isRunning ? "ON" : "OFF"}
                </TextSpan>
              </RowFlex>
            </RowBetween>)}
          {!!data?.tree?.oilTank?.volume && <RowBetween
            className="mb-2"
          >
            <RowFlex>
              <Barrel
                style={{
                  marginLeft: 1,
                  height: 17, width: 17,
                  fill: theme.textHintColor
                }}
              />
              <TextSpan apparence="c3" hint className="ml-2">
                {data?.tree?.oilTank?.type}
              </TextSpan>
            </RowFlex>
            <RowFlex>
              <TextSpan apparence="s2">
                {floatToStringExtendDot(data?.tree?.oilTank?.volume || 0, 3)}
                <TextSpan apparence="p3" hint className="ml-1">
                  {data?.tree?.oilTank?.unit}
                </TextSpan>
              </TextSpan>
            </RowFlex>
          </RowBetween>}
          <RowBetween
            className="mb-2"
          >
            <RowFlex>
              <EvaIcon
                name="pin-outline"
                status={"Basic"}
              />

            </RowFlex>
            <RowFlex>
              <TextSpan apparence="p3" hint>
                {!!data?.tree?.location?.length
                  ? <Proximity
                    latitude={data?.tree?.location[0]}
                    longitude={data?.tree?.location[1]}
                    showFlag={true}
                  /> : '-'}
              </TextSpan>
            </RowFlex>
          </RowBetween>
        </Col>
      </Content>
    </CardNoShadow>
  </>)
}
