import { Col, EvaIcon } from "@paljs/ui";
import styled, { css, useTheme } from "styled-components";
import moment from "moment";
import { FormattedMessage, useIntl } from "react-intl";
import { floatToStringExtendDot, getDifferenceDateAgo } from "../../components/Utils";
import Proximity from "../fleet/Proximity";
import { CardNoShadow, TextSpan } from "../../components";
import { getIcon } from "../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";


const Img = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  transition: transform 0.3s ease;
  margin-left: 0.015rem;
  margin-right: 0.015rem;
  border-top-left-radius: 0.55rem;
  border-top-right-radius: 0.55rem;

  &:focus {
    transform: scale(1.05);
  }

  &:hover {
    transform: scale(1.05);
  }
`

const Content = styled.div`
  display: flex;
   border-top-left-radius: 0.55rem;
  border-top-right-radius: 0.55rem;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  display: inline-block;

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
    border-radius: 0.15rem;
    padding: 0rem 0.25rem;
    line-height: 0.75rem;
    position: absolute;
    right: 1.3rem;
    top: 13.5rem;
    color: ${theme[`color${status}500`]};
  `}
`

const BadgeDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.0075rem 0.35rem;
  border-radius: 0.25rem;
  font-size: 0.56rem;
  font-weight: 700;
  text-transform: uppercase;
`

export default function ItemCardVessel(props) {

  const { data, hasConsumption, hasEngines } = props;
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

  // const tree = {
  //   idDashboard: "",
  //   engines: [
  //     {
  //       name: 'ME1',
  //       isRunning: true,
  //       load: 75,
  //       rpm: 85,
  //       consumption: 120.5
  //     },
  //     {
  //       name: 'ME2',
  //       isRunning: false,
  //       load: 0,
  //       rpm: 0,
  //       consumption: 0
  //     }
  //   ],
  //   location: data?.tree?.location || [],
  // }

  const tree = data?.tree || {};
  const someEngineIsRunning = tree?.engines?.some(engine => engine.isRunning);
  const totalConsumption = tree?.engines?.reduce((total, engine) => total + engine.consumption || 0, 0);
  const totalRunning = tree?.engines?.filter(engine => engine.isRunning).length;

  const averageByRunning = totalRunning > 0 ? totalConsumption / totalRunning : 0;
  const unitConsumption = tree?.engines?.find(Boolean)?.unitConsumption || '';


  const statusIcon = tree?.statusNavigation
    ? getIcon(tree?.statusNavigation, theme)
    : null;

  return (<>
    <CardNoShadow
      style={{
        borderTopLeftRadius: '0.55rem',
        borderTopRightRadius: '0.55rem'
      }}
    >
      <Content>
        <Img src={data?.image?.url} alt={data?.name} tabIndex={0} />
        <DivFillColor
          status={getStatusByDate(new Date(data?.tree?.lastUpdated))}>

            <TextSpan apparence="c3">
             Últ: {getDifferenceDateAgo(data?.tree?.lastUpdated, intl).match(/\d+/)[0]}
            </TextSpan>
            <TextSpan apparence="p4">
              {getDifferenceDateAgo(data?.tree?.lastUpdated, intl)
                .replace(/\d+/g, '')
                .slice(0, 4)}
            </TextSpan>

        </DivFillColor>

        <Col className="mt-2">
          <RowBetween
            className="mb-4"
          >
            <TextSpan apparence="s2">
              🚢 {data?.name}
            </TextSpan>
          </RowBetween>
          {hasEngines && <RowBetween
            className="mb-2"
          >
            <RowFlex>
              <EvaIcon
                name="settings-2-outline"
                status={"Basic"}
                className={someEngineIsRunning ? `rotate` : ''}
              />
              <TextSpan
                apparence="c2"
                className="ml-1"
                hint
              >
                Main Engines
              </TextSpan>
            </RowFlex>
            <RowFlex>
              <TextSpan apparence="s2">
                {totalRunning || '-'}
              </TextSpan>
            </RowFlex>
          </RowBetween>}
          {hasConsumption && <RowBetween
            className="mb-2"
          >
            <RowFlex>
              <EvaIcon
                name={someEngineIsRunning ? "droplet" : "droplet-off-outline"}
                status={"Basic"}
              />
              <TextSpan
                apparence="c2"
                className="ml-1"
                hint
              >
                Consumption
              </TextSpan>
            </RowFlex>
            <RowFlex>
              <TextSpan apparence="s2">
                {averageByRunning ? floatToStringExtendDot(averageByRunning, 2) : '-'}
                {unitConsumption && <TextSpan apparence="p3" hint className="ml-1">
                  {unitConsumption}
                </TextSpan>}
              </TextSpan>
            </RowFlex>
          </RowBetween>}
          <RowBetween
            className="mb-2"
          >
            <RowFlex>
              <EvaIcon
                name="checkmark-outline"
                status={"Basic"}
              />
              <TextSpan apparence="c2" hint className="ml-1">
                <FormattedMessage id={"navigation"} />
              </TextSpan>
            </RowFlex>
            <RowFlex>
              {statusIcon
                ? <BadgeDiv
                  style={{
                    backgroundColor: `${statusIcon.bgColor}20`,
                    color: statusIcon.bgColor,
                  }}>
                  <FormattedMessage id={statusIcon?.text} />
                </BadgeDiv>
                : <TextSpan apparence="p3" hint>
                  {'-'}
                </TextSpan>}
            </RowFlex>
          </RowBetween>
          <RowBetween
            className="mb-2"
          >
            <RowFlex>
              <EvaIcon
                name="pin-outline"
                status={"Basic"}
              />
              <TextSpan apparence="c2" hint className="ml-1">
                <FormattedMessage id={"location"} />
              </TextSpan>
            </RowFlex>
            <RowFlex>
              <TextSpan apparence="p3" hint>
                {!!tree?.location?.length
                  ? <Proximity
                    latitude={tree?.location[0]}
                    longitude={tree?.location[1]}
                    showFlag={true}
                  /> : '-'}
              </TextSpan>
            </RowFlex>
          </RowBetween>
        </Col>
      </Content>
    </CardNoShadow >
  </>)
}
