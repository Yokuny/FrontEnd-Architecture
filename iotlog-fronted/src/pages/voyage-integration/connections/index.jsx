import { Checkbox, Col, EvaIcon, Row } from "@paljs/ui";
import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import styled, { css } from "styled-components";
import { setKickVoyageFilter } from "../../../actions";
import { LabelIcon, TextSpan } from "../../../components";

const RowContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const RowCenter = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
`;

const RowStart = styled.div`
  ${({ theme, isSelected = false }) => css`
  display: flex;
  flex-direction: row;
  align-items: flex-start;

  ${isSelected && ` background-color: ${theme.backgroundBasicColor3}; color: ${theme.colorPrimary500}; `}

  :hover {
      {
       cursor: pointer;
       background-color: ${theme.colorBasicHover};
       color: ${theme.colorPrimary500};
     }
  `}
`;

const ColData = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

function ConnectionsVoyage(props) {

  const { voyages } = props;

  React.useEffect(() => {
    return () => {
      props.setKickVoyageFilter(undefined);
    }
  }, [])

  const getTravels = () => {
    if (!voyages?.length)
      return []

    voyages?.forEach(x => {
      x.operations = x.operations?.toString()
    });

    const seqFinish = voyages?.slice(-1)[0]?.sequence;
    const seqDeparture = voyages?.find(x => x.operations?.includes("D"))?.sequence;


    const kicks = [
      {
        source: voyages?.find(x => x.operations?.includes("S")),
        destiny: voyages?.find(x => x.operations?.includes("L"))
      },
      {
        source: voyages?.find(x => x.operations?.includes("L")),
        destiny: voyages?.find(x => x.operations?.includes("D")),
      },
    ]

    if (seqFinish !== seqDeparture) {
      kicks.push({
        source: voyages?.find(x => x.operations?.includes("D")),
        destiny: voyages?.slice(-1)[0],
      })
    }

    return kicks
  }

  const onChangeKickVoyageFilter = (travels, e) => {
    e.preventDefault();
    if (props.kickVoyageFilter) {
      props.setKickVoyageFilter(undefined)
      return;
    }

    if (travels?.length)
      props.setKickVoyageFilter({
        dateTimeDeparture: travels[0].source?.dateTimeDeparture,
        dateTimeArrival: travels[0].destiny?.dateTimeArrival,
        dateTimeSourceArrival: travels[0].source?.dateTimeArrival,
        dateTimeDestinyDeparture: travels[0].destiny?.dateTimeDeparture,
        index: 0
      })
  }

  const travels = getTravels();

  return (
    <>
      <div className="mb-2 mt-2">
        <Row between="xs" style={{ margin: 0 }} className="mb-1">
          <LabelIcon
            iconName="swap-outline"
            title={<FormattedMessage id="kick.voyage" />}
          />
          <RowCenter onClick={(e) => onChangeKickVoyageFilter(travels, e)}>
            <Checkbox
              checked={!props.kickVoyageFilter}
              onChange={(e) => onChangeKickVoyageFilter(travels, e)}
            >
            </Checkbox>
            <TextSpan className="ml-1" apparence="s3" hint>
              <FormattedMessage id="voyage.complete" />
            </TextSpan>
          </RowCenter>
        </Row>
        {travels?.map((x, i) => {
          const isSelected = props.kickVoyageFilter?.index === i;
          return (<RowStart
            key={`${i}-item`}
            isSelected={isSelected}
            className="p-1"
            onClick={() => props.setKickVoyageFilter(isSelected
              ? undefined
              : {
                dateTimeDeparture: x?.source?.dateTimeDeparture,
                dateTimeArrival: x?.destiny?.dateTimeArrival,
                dateTimeSourceArrival: x?.source?.dateTimeArrival,
                dateTimeDestinyDeparture: x?.destiny?.dateTimeDeparture,
                index: i,
              }
            )}>
            <Col style={{ padding: 0 }} breakPoint={{ md: 6 }} className="mb-2 mt-2">
              <RowContent>
                <EvaIcon
                  name="arrow-circle-up"
                  status="Danger"
                  options={{
                    height: 18
                  }}
                  className="mr-1"
                />
                <ColData className="ml-1 mr-1">
                  <TextSpan apparence="s2">
                    {x?.source?.port}
                  </TextSpan>
                  <TextSpan apparence="p3" hint>
                    {moment(x?.source?.dateTimeDeparture).format(
                      "DD MMM, HH:mm"
                    )}
                  </TextSpan>
                </ColData>
              </RowContent>
            </Col>
            <Col style={{ padding: 0 }} breakPoint={{ md: 6 }} className="mb-2 mt-2">
              <RowContent>
                <EvaIcon
                  name="arrow-circle-down"
                  status="Success"
                  options={{
                    height: 18
                  }}
                  className="mr-1"
                />
                <ColData className="ml-1">
                  <TextSpan apparence="s2">
                    {x?.destiny?.port}
                  </TextSpan>
                  <TextSpan apparence="p3" hint>
                    {moment(x?.destiny?.dateTimeArrival).format(
                      "DD MMM, HH:mm"
                    )}
                  </TextSpan>
                </ColData>
              </RowContent>
            </Col>
          </RowStart>
          )
        })}
      </div>
    </>
  )

}

const mapStateToProps = (state) => ({
  kickVoyageFilter: state.voyage.kickVoyageFilter,
});

const mapDispatchToProps = (dispatch) => ({
  setKickVoyageFilter: (kickVoyageFilter) => {
    dispatch(setKickVoyageFilter(kickVoyageFilter));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ConnectionsVoyage);
