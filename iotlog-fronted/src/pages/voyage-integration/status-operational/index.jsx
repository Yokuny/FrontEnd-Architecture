import React from 'react';
import { FormattedMessage } from "react-intl";
import styled, { useTheme } from "styled-components";
import { Fetch, LabelIcon, TextSpan } from "../../../components";
import { IconBorder } from "../../../components/Icons/IconRounded";
import { floatToStringExtendDot } from "../../../components/Utils";
import { getIcon } from "../../fleet/Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { SkeletonThemed } from '../../../components/Skeleton';
import { Col, Row } from '@paljs/ui';
import { connect } from 'react-redux';
import { nanoid } from 'nanoid';

const RowContent = styled.div`
  display: flex;
  flex-direction: column;
`

const BetweenContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 100%;
`

const ColContent = styled.div`
  display: flex;
  align-content: center;
`

const StatusOperational = (props) => {

  const { idMachine, voyages, kickVoyageFilter } = props;
  const [isLoading, setIsLoading] = React.useState(false);
  const [eventStatus, setEventStatus] = React.useState([])

  const theme = useTheme();

  React.useLayoutEffect(() => {
    if (idMachine) {
      getData(idMachine, kickVoyageFilter)
    }
  }, [idMachine, kickVoyageFilter])

  const getData = (idMachine, kickVoyageFilter) => {
    if (!voyages?.length) {
      return;
    }

    setIsLoading(true)
    let params = [`idMachine=${idMachine}`]

    if (kickVoyageFilter) {
      params = [
        ...params,
        `min=${kickVoyageFilter.dateTimeDeparture}`,
        `max=${kickVoyageFilter.dateTimeArrival}`,
      ]
    } else {
      const min = voyages[0].dateTimeArrival
      const max = voyages.slice(-1)[0].dateTimeDeparture

      params = [
        ...params,
        `min=${min}`,
        `max=${max}`,
      ]
    }

    Fetch.get(`/machineevent/statusbymachine?${params.join('&')}`)
      .then(response => {
        setEventStatus(response.data)
        setIsLoading(false)
      })
      .catch(e => {
        setIsLoading(false)
      })
  }


  return (
    <>
      <div className="mt-2"></div>
      <LabelIcon
        title={<FormattedMessage id="time.operation" />}
        iconName="trending-up-outline"
      />
      {isLoading ? <RowContent className='mb-4'>
        <Row className='m-0 pb-2'>
          <Col breakPoint={{ md: 8 }}>
            <SkeletonThemed width={'100%'} />
          </Col>
          <Col breakPoint={{ md: 4 }}>
            <SkeletonThemed width={'100%'} />
          </Col>
        </Row>
        <Row className='m-0 pb-2'>
          <Col breakPoint={{ md: 8 }}>
            <SkeletonThemed width={'100%'} />
          </Col>
          <Col breakPoint={{ md: 4 }}>
            <SkeletonThemed width={'100%'} />
          </Col>
        </Row>
        <Row className='m-0'>
          <Col breakPoint={{ md: 8 }}>
            <SkeletonThemed width={'100%'} />
          </Col>
          <Col breakPoint={{ md: 4 }}>
            <SkeletonThemed width={'100%'} />
          </Col>
        </Row>
      </RowContent>

        : <RowContent>
          {eventStatus?.sort((a, b) => b.minutes - a.minutes)?.map((x, i) => {
            const iconProps = getIcon(x.status, theme, true);
            return (<BetweenContent key={`${nanoid(4)}_${i}`} className={`mt-1`}>
              <ColContent>
                <IconBorder
                  color="transparent"
                  style={{ fill: iconProps.bgColor }}
                >
                  {iconProps.component}
                </IconBorder>
                <TextSpan apparence="s3" hint className="ml-2 pt-2">
                  <FormattedMessage id={iconProps.text} />
                </TextSpan>
              </ColContent>
              <TextSpan apparence="s2" className="ml-2 pt-2">
                {floatToStringExtendDot(x.minutes / 60, 1)} hrs
              </TextSpan>
            </BetweenContent>
            )
          })
          }
          {!!eventStatus?.length &&
            <BetweenContent key={nanoid(4)} className={`mt-1 mb-3`}>
              <ColContent>
                <div style={{ width: 32 }}></div>
                <TextSpan apparence="s3" hint className="ml-2 pt-2">
                  <FormattedMessage id={"total"} />
                </TextSpan>
              </ColContent>
              <TextSpan apparence="s2" className="ml-2 pt-2">
                {floatToStringExtendDot(eventStatus.reduce((a, b) => a + b.minutes, 0) / 60, 1)} hrs
              </TextSpan>
            </BetweenContent>
          }
        </RowContent>}
    </>
  )
}

const mapStateToProps = (state) => ({
  kickVoyageFilter: state.voyage.kickVoyageFilter,
});


export default connect(mapStateToProps, undefined)(StatusOperational);
