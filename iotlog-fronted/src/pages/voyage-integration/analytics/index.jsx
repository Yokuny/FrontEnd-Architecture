import { Col, Row } from "@paljs/ui";
import { FormattedMessage, useIntl } from "react-intl";
import { connect } from "react-redux";
import { Divide, ItemInfoView, LabelIcon } from "../../../components";
import { floatToStringExtendDot } from "../../../components/Utils";

function AnalyticsVoyage(props) {
  const { voyages } = props;

  const intl = useIntl();

  if (!voyages?.length) {
    return <></>
  }

  const getVoyagesFiltered = (voyages) => {
    if (props.kickVoyageFilter) {
      return voyages?.filter(x =>
        new Date(x.dateTimeDeparture).getTime() >= new Date(props.kickVoyageFilter.dateTimeDeparture).getTime() &&
        new Date(x.dateTimeArrival).getTime() >= new Date(props.kickVoyageFilter.dateTimeDeparture).getTime() &&
        new Date(x.dateTimeArrival).getTime() <= new Date(props.kickVoyageFilter.dateTimeArrival).getTime()
      )?.map(x => x.analytics);
    }

    return voyages.map(x => x.analytics);
  }

  const voyagesFiltered = getVoyagesFiltered(voyages);
  const sums = voyagesFiltered?.reduce((a, b) =>
    a = {
      distance: a.distance + (b?.inVoyage?.distance || 0),
      speedAvg: a.speedAvg + (b?.inVoyage?.speedAvg || 0),
      speedAvgInOcean: a.speedAvgInOcean + (Number(b?.inVoyage?.avgData?.speedInOcean?.distance /  b?.inVoyage?.avgData?.speedInOcean?.time) || 0),
      ifo: a.ifo + (b?.inPort?.consume?.ifo || 0) + (b?.inVoyage?.consume?.ifo || 0),
      ifoPort: a.ifoPort + (b?.inPort?.consume?.ifo || 0),
      ifoVoyage: a.ifoVoyage + (b?.inVoyage?.consume?.ifo || 0),
      mdo: a.mdo + (b?.inPort?.consume?.mdo || 0) + (b?.inVoyage?.consume?.mdo || 0),
      lsf: a.lsf + (b?.inPort?.consume?.lsf || 0) + (b?.inVoyage?.consume?.lsf || 0),
      mgo: a.mgo + (b?.inPort?.consume?.mgo || 0) + (b?.inVoyage?.consume?.mgo || 0),
    }
    , { ifoPort: 0, ifoVoyage: 0, distance: 0, speedAvg: 0, speedAvgInOcean: 0, ifo: 0, mdo: 0, lsf: 0, mgo: 0 })

  const getValueAvgSpeedFiltered = (voyagesFiltered, propName) => {
    const speedsMoreZero = voyagesFiltered?.filter(x => !!x?.inVoyage && x?.inVoyage[propName] > 0);
    const speedsSum = speedsMoreZero.reduce((a, b) => a + (b?.inVoyage[propName] || 0), 0);
    return speedsSum
      ? speedsSum / speedsMoreZero.length
      : 0;
  }

  const getAvgSpeedFiltered = (voyagesFiltered) => {
    const speedsMoreZero = voyagesFiltered?.filter(x => !!x?.inVoyage && x?.inVoyage?.avgData?.speed?.distance > 0);
    if (!speedsMoreZero?.length) return 0;
    const distancesSums = speedsMoreZero.reduce((a, b) => a + (b?.inVoyage?.avgData?.speed?.distance || 0), 0);
    const timesSums = speedsMoreZero.reduce((a, b) => a + (b?.inVoyage?.avgData?.speed?.time || 0), 0);
    return distancesSums
      ? parseFloat((distancesSums / timesSums)?.toFixed(2))
      : 0
  }

  const getValueAvgSpeed = (sums, voyages, propName) => {
    return sums[propName]
      ? sums[propName] / voyages?.filter(x => !!x?.analytics?.inVoyage && x?.analytics?.inVoyage[propName] > 0)?.length
      : 0;
  }

  const analytics = [
    {
      description: intl.formatMessage({ id: 'distance' }),
      value: sums?.distance,
      unit: voyages[0].analytics?.inPort?.distanceUnit
    },
    {
      description: intl.formatMessage({ id: 'speed.avg' }),
      value: props.kickVoyageFilter
        ? getAvgSpeedFiltered(voyagesFiltered, 'speedAvg')
        : getValueAvgSpeed(sums, voyages, 'speedAvg'),
      unit: intl.formatMessage({ id: 'kn' })
    },
    {
      description: intl.formatMessage({ id: 'speed.avg.in.ocean' }),
      value: props.kickVoyageFilter
        ? getValueAvgSpeedFiltered(voyagesFiltered, 'speedAvgInOcean')
        : getValueAvgSpeed(sums, voyages, 'speedAvgInOcean'),
      unit: intl.formatMessage({ id: 'kn' })
    }
  ]

  if (sums?.ifo) {
    analytics.push({
      description: 'IFO total',
      value: sums?.ifo,
      unit: voyages[0].analytics?.consume?.unit || 'ton'
    })
  }

  if (sums?.ifoPort) {
    analytics.push({
      description: 'IFO Porto',
      value: sums?.ifoPort,
      unit: voyages[0].analytics?.consume?.unit || 'ton'
    })
  }

  if (sums?.ifoVoyage) {
    analytics.push({
      description: 'IFO Viagem',
      value: sums?.ifoVoyage,
      unit: voyages[0].analytics?.consume?.unit || 'ton'
    })
  }

  if (sums?.lsf) {
    analytics.push({
      description: 'LSF',
      value: sums?.lsf,
      unit: voyages[0].analytics?.consume?.unit || 'ton'
    })
  }

  if (sums?.mdo) {
    analytics.push({
      description: 'MDO',
      value: sums?.mdo,
      unit: voyages[0].analytics?.consume?.unit || 'ton'
    })
  }

  if (sums?.mgo) {
    analytics.push({
      description: 'MGO',
      value: sums?.mgo,
      unit: voyages[0].analytics?.consume?.unit || 'ton'
    })
  }

  if (sums?.ifoVoyage && props.kickVoyageFilter) {
    const timesSums = voyagesFiltered?.reduce((a, b) => a + (b?.inVoyage?.avgData?.speed?.time || 0), 0);
    analytics.push({
      description: `${intl.formatMessage({ id: 'average' })} IFO/h`,
      value: (sums?.ifoVoyage / timesSums) * 1000,
      unit: 'kg/h',
      isInt: true
    })

    analytics.push({
      description: `${intl.formatMessage({ id: 'average' })} IFO/${intl.formatMessage({ id: 'day' })}`,
      value: (sums?.ifoVoyage / timesSums) * 24,
      unit: `ton/${intl.formatMessage({ id: 'day' })}`,
      isInt: false
    })
  }

  return (
    <>
      {!!analytics?.length && (
        <>
          <Divide mh="-18px" />
          <div className="mt-2"></div>
          <LabelIcon
            title={<FormattedMessage id="indicators" />}
            iconName="pie-chart-outline"
          />
          <Row middle="xs" center="xs" className="mt-2">
            {analytics?.map((analytic, i) => (
              <Col
                key={`a-${i}-z`}
                className="mb-4"
                breakPoint={{ md: 6 }}
              >
                <ItemInfoView
                  noShowIcon
                  title={analytic.description}
                  description={floatToStringExtendDot(
                    analytic.value,
                    analytic.isInt ? 0 : 2
                  )}
                  footer={analytic.unit}
                />
              </Col>
            ))}
          </Row>
        </>
      )}
    </>

  )


}

const mapStateToProps = (state) => ({
  kickVoyageFilter: state.voyage.kickVoyageFilter,
});


export default connect(mapStateToProps, undefined)(AnalyticsVoyage);
