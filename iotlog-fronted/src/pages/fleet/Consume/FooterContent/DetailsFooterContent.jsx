import React from "react";
import { Col, Row } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { useTheme } from "styled-components";
import Skeleton from "react-loading-skeleton";
import { LabelIcon, TextSpan } from "../../../../components";
import { Tacometer, Vessel } from "../../../../components/Icons";
import { DateDiff } from "../../../../components/Date/DateDiff";
import { floatToStringExtendDot } from "../../../../components/Utils";
import { connect } from "react-redux";
import { setItemHistoryConsume } from "../../../../actions";
import moment from "moment";
import StatusBg from "./StatusBg";
import { POSITION_DATA_CONSUME } from "../Constants";
import { nanoid } from "nanoid";
import ConsumptionData from "./TypeData/ConsumptionData";
import SpeedData from "./TypeData/SpeedData";
import EnginesRunData from "./TypeData/EnginesRunData";
import PowerData from "./TypeData/PowerData";

const Img = styled.img`
  width: 35px;
  height: 35px;
  border-radius: 8px;
  object-fit: cover;
`;

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;

  .max-text-ellipsis {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 90px;
  }
`;

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DetailsFooterContent = (props) => {
  const { machineDetails, itemHistoryConsume, data, isLoading } = props;

  const theme = useTheme();

  const isShowData = !!itemHistoryConsume?.length;

  return (
    <>
      <Row style={{ margin: 0 }} key={nanoid(3)}>
        <Col breakPoint={{ md: 2 }}>
          <LabelIcon
            renderIcon={() => (
              <Vessel
                style={{
                  height: 13,
                  width: 13,
                  color: theme.textHintColor,
                  marginRight: 5,
                  marginTop: 2,
                  marginBottom: 2,
                }}
              />
            )}
            title={<FormattedMessage id="vessel" />}
          />
          <Row style={{ margin: 0 }} middle="xs" className="pt-1">
            {machineDetails?.machine?.image?.url && (
              <Img
                src={machineDetails?.machine?.image?.url}
                alt={machineDetails?.machine?.name}
              />
            )}
            <ColFlex className="ml-2">
              <TextSpan apparence="s2">
                {machineDetails?.machine?.name}
              </TextSpan>
              <TextSpan apparence="p3" className="max-text-ellipsis">
                {machineDetails?.modelMachine?.description}
              </TextSpan>
            </ColFlex>
          </Row>
        </Col>
        <Col breakPoint={{ md: 10 }}>
          <RowFlex
            style={{
              alignItems: "flex-start",
              justifyContent: "space-evenly",
            }}
          >
            <ColFlex>
              <LabelIcon
                iconName="radio-outline"
                title={<FormattedMessage id={itemHistoryConsume ? "date" : "last.date.acronym"} />}
              />
              <TextSpan apparence="s2" className="ml-1">
                {isLoading ? (
                  <Skeleton />
                ) :
                  (<>
                    {
                      data?.lastUpdate ? (
                        <DateDiff dateInitial={isShowData ? new Date(itemHistoryConsume[POSITION_DATA_CONSUME.DATE] * 1000) : data.lastUpdate} />
                      ) : (
                        "-"
                      )
                    }
                    <br />
                    {
                      isShowData && <TextSpan apparence="p3">{
                        moment(itemHistoryConsume[POSITION_DATA_CONSUME.DATE] * 1000).format("HH:mm, DD/MMM")
                      }</TextSpan>
                    }
                  </>)
                }
              </TextSpan>
            </ColFlex>
            <StatusBg isShowData={isShowData} data={data} />
            <ColFlex className="ml-2">
              <LabelIcon
                renderIcon={() => (
                  <Tacometer
                    style={{
                      height: 22,
                      width: 15,
                      color: theme.textHintColor,
                      marginRight: 5,
                    }}
                  />
                )}
                title={<FormattedMessage id="speed" />}
              />
              <TextSpan apparence="s2" className="ml-1">
                {isLoading ? (
                  <Skeleton />
                ) : (
                  <SpeedData
                    isShowData={isShowData}
                    data={data}
                  />
                )}
              </TextSpan>
            </ColFlex>
            <ColFlex className="ml-1">
              <LabelIcon iconName="settings-outline" title={`Engines`} />
              {isLoading ? (
                <Skeleton />
              ) : (
                <EnginesRunData
                  isShowData={isShowData}
                  data={data}
                />
              )}
            </ColFlex>
            <ColFlex className="ml-2">
              <LabelIcon iconName="flash-outline" title={`Power`} />
              {isLoading ? (
                <Skeleton />
              ) : (
                <PowerData
                  isShowData={isShowData}
                  data={data}
                />
              )}
            </ColFlex>
            <ColFlex className="ml-2">
              <LabelIcon
                iconName="droplet-outline"
                title={<FormattedMessage id="consume" />}
              />
              {isLoading
                ? <Skeleton />
                : <ConsumptionData
                  isShowData={isShowData}
                  data={data}
                />
              }
            </ColFlex>
            {!itemHistoryConsume && <ColFlex className="ml-2">
              <LabelIcon iconName="flag-outline" title={<FormattedMessage id="today" />} />
              {isLoading ? (
                <Skeleton />
              ) : (
                <>
                  <TextSpan apparence="s2" className="ml-1">
                    {`${floatToStringExtendDot(data?.comsuptionToday, 1)} ${data?.comsuptionTodayUnit ?? ""}`}
                  </TextSpan>
                </>
              )}
            </ColFlex>}
          </RowFlex>
        </Col>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  itemHistoryConsume: state.fleet.itemHistoryConsume,
  eventsStatusHistory: state.fleet.eventsStatusHistory,
});

const mapDispatchToProps = (dispatch) => ({
  setItemHistoryConsume: (itemHistoryConsume) => {
    dispatch(setItemHistoryConsume(itemHistoryConsume));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailsFooterContent);
