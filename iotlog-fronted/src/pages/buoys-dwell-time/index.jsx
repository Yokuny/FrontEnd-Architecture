import { Accordion, AccordionItem, Card, CardHeader, EvaIcon, Spinner, Row } from '@paljs/ui';
import moment from 'moment';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import styled from 'styled-components';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { useTheme } from 'styled-components';
import { Fetch, TextSpan } from '../../components';
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from '../../components/Table';

const RowStyled = styled(Row)`
  width: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  align-content: center;
`

const ContentIcon = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
`

function BuoysDwellTime(props) {

  const intl = useIntl();
  const theme = useTheme();

  const [isLoading, setIsLoading] = React.useState(true);
  const [data, setData] = React.useState([]);

  React.useLayoutEffect(() => {
    if (props.enterprises?.length) {
      fetchDwellTimes(props.enterprises[0].id)
    }
  }, [props.enterprises]);

  function fetchDwellTimes(idEnterprise) {
    setIsLoading(true)

    Fetch.get(`/dwell-time/${idEnterprise}`)
      .then((response) => reduceBuoys(response.data))
      .catch((e) => toast.error(e))
  }

  async function fetchBuoysById(dwellTimes) {
    try {
      const idBuoys = [...new Set(dwellTimes.map(item => item.idBuoy))];
      if (!idBuoys.length) return [];
      const idBuoysString = idBuoys.join(',');

      const response = await Fetch.get(`/buoy/by-ids/${idBuoysString}`);
      return response.data
    } catch (error) {
      toast.error(intl.formatMessage({ id: 'error.get' }))
    }
  }

  function reduceBuoys(_dwellTimes) {

    fetchBuoysById(_dwellTimes)
      .then((buoys) => {

        const buoysWithDwellTime = buoys.map((buoy) => {
          const dwellTimes = _dwellTimes.filter((dwellTime) => dwellTime.idBuoy === buoy.id);
          return { ...buoy, dwellTimes };
        });

        setData(buoysWithDwellTime);
        setIsLoading(false)
      })
      .catch(() => toast.error(intl.formatMessage({ id: 'error.get' })));
  }

  function calculateTimeDifference(_inAt, _outAt) {
    const inAt = moment(_inAt);
    const outAt = moment(_outAt);

    const duration = moment.duration(outAt.diff(inAt));

    return duration.asHours().toFixed(2);
  };

  function calculateTotalTimeSpent(dwellTimes) {
    let totalTime = 0;

    dwellTimes.forEach((dwellTime) => {
      const inAt = moment(dwellTime.inAt);
      const outAt = moment(dwellTime.outAt);

      const duration = moment.duration(outAt.diff(inAt));
      totalTime += duration.asHours();
    });

    return totalTime.toFixed(2);
  }

  function getDelimitationNameById(location, idDelimitation) {
    const foundDelimitation = location.find(area => area.idDelimitation === idDelimitation);
    return foundDelimitation ? foundDelimitation.name : 'Unknown Delimitation';
  }

  function renderAccordionItemTitle(item) {
    return (
      <>
        <RowStyled
          between="xs" className="m-0">
          <ContentIcon>
            <EvaIcon name="radio-button-on-outline"
              options={{
                fill: theme.colorPrimary500,
                width: 18,
                height: 18,
              }}
            />
            <Column className="ml-2">
              <TextSpan apparence='s2'>{item.name}</TextSpan>
              <TextSpan apparence="p3" hint>{item.proximity}</TextSpan>
            </Column>
          </ContentIcon>
          <ContentIcon className="mr-4">
            <EvaIcon
              status="Info"
              name="clock-outline" options={{ width: 18, height: 18 }} />
            <TextSpan apparence='s2' className="mr-2">
              {calculateTotalTimeSpent(item.dwellTimes)}

              <TextSpan apparence='p3' hint> HR</TextSpan>
            </TextSpan>
          </ContentIcon>
        </RowStyled>
      </>
    )
  }

  return (
    <Card>
      <CardHeader>
        <FormattedMessage id="buoys.dwell.time" />
      </CardHeader>
      {isLoading ? (<Spinner />) : (
        <Accordion>
          {data.map((item,i) => {
            return (
              <AccordionItem uniqueKey={i} title={renderAccordionItemTitle(item)}>
                <TABLE>
                  <THEAD>
                    <TRH>
                      <TH>
                        <TextSpan apparence='p2' hint>
                          <FormattedMessage id="delimitation" />
                        </TextSpan>
                      </TH>
                      <TH>
                        <TextSpan apparence='p2' hint>
                          <FormattedMessage id="vessel" />
                        </TextSpan>
                      </TH>
                      <TH>
                        <TextSpan apparence='p2' hint>
                          <FormattedMessage id="mmsi" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center">
                        <TextSpan apparence='p2' hint>
                          <FormattedMessage id="hour.start" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center">
                        <TextSpan apparence='p2' hint>
                          <FormattedMessage id="hour.end" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center">
                        <TextSpan apparence='p2' hint>
                          <FormattedMessage id="total.time" />
                        </TextSpan>
                      </TH>
                    </TRH>
                  </THEAD>
                  <TBODY>
                    {item.dwellTimes.map((dwellTime, index) => (
                      <TR key={index} isEvenColor={index % 2 === 0}>
                        <TD>
                          <TextSpan apparence='s2'>{getDelimitationNameById(item.location, dwellTime.idDelimitation)}</TextSpan>
                        </TD>
                        <TD>
                          <TextSpan apparence='s2'>{dwellTime.machine?.name}</TextSpan>
                        </TD>
                        <TD>
                          <TextSpan apparence='s2'>{dwellTime.machine?.mmsi}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence='s2'>{moment(dwellTime.inAt).format(intl.formatMessage({ id: "format.datetimewithoutss"}))}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence='s2'>{dwellTime.outAt ? moment(dwellTime.outAt).format(intl.formatMessage({ id: "format.datetimewithoutss"})) : "-"}</TextSpan>
                        </TD>
                        <TD textAlign="center">
                          <TextSpan apparence='s2'>
                            {dwellTime.outAt && dwellTime.inAt ?
                            <>
                            {calculateTimeDifference(dwellTime.inAt, dwellTime.outAt)}
                            <TextSpan apparence='p3' hint> HR</TextSpan>
                            </> : "-"}
                            </TextSpan>
                        </TD>
                      </TR>
                    ))}
                  </TBODY>
                </TABLE>
              </AccordionItem>
            )
          })}
        </Accordion>
      )}

    </Card>
  )
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
  enterprises: state.enterpriseFilter.enterprises
});

export default connect(mapStateToProps)(BuoysDwellTime);
