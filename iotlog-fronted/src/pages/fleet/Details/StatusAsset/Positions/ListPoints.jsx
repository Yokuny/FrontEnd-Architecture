import { Checkbox, Col, EvaIcon, Row } from "@paljs/ui";
import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import {
  setIsShowPoints,
  setIsShowSequencePoints,
  setListSelectedPoint,
} from "../../../../../actions";
import { Divide, LabelIcon, TextSpan, Toggle } from "../../../../../components";
import { Tacometer } from "../../../../../components/Icons";
import { floatToStringBrazilian, isPositionValid } from "../../../../../components/Utils";
import { DmsCoordinates } from "../../../Map/Coordinates/DmsCoordinates";
import LoadingPositions from "./LoadingPositions";
import { FormattedMessage } from "react-intl";
import DownloadCSV from "./DownloadCSV";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ColDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const ColStart = styled(Col)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const RowToggle = styled(Row)`
  padding-left: 8px;
  display: flex;
  flex-direction: row;
  margin-left: 0px;
`;

const ListPoints = (props) => {
  const { item } = props;

  const theme = useTheme();
  const [showOnlySelected, setShowOnlySelected] = React.useState(false);

  React.useEffect(() => {
    return () => {
      props.setListSelectedPoint([]);
    };
  }, []);

  const getDmsData = (coords) => {
    try {
      return !!coords?.length
        ? new DmsCoordinates(coords[0], coords[1])
        : undefined;
    } catch {
      return undefined;
    }
  };

  const onPress = (item, isChecked) => {
    props.setListSelectedPoint(
      isChecked
        ? props?.listSelectedPoints?.filter(
            (y) => y[0] !== item[0]
          )
        : [...(props?.listSelectedPoints || []), item]
    );
  };

  return (
    <>
      {props.isLoading ? (
        <LoadingPositions />
      ) : (
        <>
          <Row style={{ margin: 0 }} className="pt-2">
            <div className="ml-4">
              <LabelIcon
                iconName="eye-outline"
                title={<FormattedMessage id="display" />}
              />
            </div>
            <Row style={{ margin: 0 }} className="pb-2" middle="true">
              <Col breakPoint={{ md: 12 }}>
                <RowToggle between="xs" middle="xs">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="points.map" />
                  </TextSpan>
                  <Toggle
                    checked={props.isShowPoints}
                    onChange={() => props.setIsShowPoints(!props.isShowPoints)}
                  />
                </RowToggle>
                <RowToggle between="xs" middle="xs" className="mt-3">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="sequence.number" />
                  </TextSpan>
                  <Toggle
                    checked={props.isShowSequencePoints}
                    onChange={() =>
                      props.setIsShowSequencePoints(!props.isShowSequencePoints)
                    }
                  />
                </RowToggle>
                {!!props.listSelectedPoints?.length && (
                  <RowToggle between="xs" middle="xs" className="mt-3">
                    <TextSpan apparence="s2">
                      <FormattedMessage id="show.only.selected" />
                    </TextSpan>
                    <Toggle
                      checked={showOnlySelected}
                      onChange={() => setShowOnlySelected(!showOnlySelected)}
                    />
                  </RowToggle>
                )}
              </Col>
              <Col breakPoint={{ md: 12 }} className="mt-2 mb-2">
                <Row center>
                  <DownloadCSV
                    routeHistory={props.routeHistory}
                    machineDetailsSelected={props.machineDetailsSelected}
                  />
                </Row>
              </Col>
            </Row>
          </Row>
          <Divide />

          {props.routeHistory?.filter(x => isPositionValid(x.slice(1,3)))?.map((x, i) => {
            const itemDms = getDmsData(x.slice(1, 3));
            const itemSelected = props.listSelectedPoints?.some(
              (y) => y[0] === x[0]
            );

            return showOnlySelected && !itemSelected ? null : (
              <Row
                key={i}
                className="pt-1 pb-2 pl-1"
                style={{
                  backgroundColor:
                    i % 2 === 0
                      ? theme.backgroundBasicColor1
                      : theme.backgroundBasicColor2,
                  marginLeft: 0,
                  marginRight: 0,
                }}
              >
                <Col breakPoint={{ md: 1 }} className="col-flex-center">
                  <Checkbox
                    checked={itemSelected}
                    onChange={() => onPress(x, itemSelected)}
                  />
                </Col>
                <Col breakPoint={{ md: 1 }} className="col-flex-center">
                  <TextSpan
                    apparence="s3"
                    style={{
                      padding: 1,
                      backgroundColor: itemSelected
                        ? theme.colorPrimary600
                        : item?.modelMachine?.color || theme.colorPrimary500,
                      borderRadius: "100%",
                      textAlign: "center",
                      color: "#fff",
                      minWidth: 21,
                      height: 21,
                    }}
                  >
                    {i + 1}
                  </TextSpan>
                </Col>
                <Col breakPoint={{ md: 2 }} className="col-flex-center">
                  <TextSpan apparence="s3" style={{ textAlign: "center" }}>
                    {moment(x[0] * 1000).format("HH:mm")}
                  </TextSpan>
                  <TextSpan apparence="p4" style={{ textAlign: "center" }}>
                    {moment(x[0] * 1000).format("DD/MM")}
                  </TextSpan>
                </Col>
                <Col breakPoint={{ md: 5 }} className="col-flex-center">
                  <RowRead>
                    <EvaIcon
                      name="pin-outline"
                      className="mt-1 mr-1"
                      options={{
                        height: 18,
                        width: 16,
                        fill: theme.textHintColor,
                      }}
                    />
                    <ColDiv>
                      <TextSpan
                        style={{ marginTop: 2, marginBottom: -4 }}
                        apparence="s3"
                      >
                        {`${itemDms?.getLatitude()?.toString()}`}
                      </TextSpan>
                      <TextSpan apparence="s3">
                        {`${itemDms?.getLongitude()?.toString()}`}
                      </TextSpan>
                    </ColDiv>
                  </RowRead>
                </Col>
                <ColStart breakPoint={{ md: 3 }} className="col-flex-center">
                  <RowRead>
                    <EvaIcon
                      name="compass-outline"
                      className="mt-1 mr-1"
                      options={{
                        height: 18,
                        width: 16,
                        fill: theme.textHintColor,
                      }}
                    />

                    <TextSpan style={{ marginTop: 2 }} apparence="s3">
                      {`${floatToStringBrazilian(x[4], 1)}º`}
                    </TextSpan>
                  </RowRead>

                  <RowRead>
                    <Tacometer
                      style={{
                        height: 14,
                        width: 15,
                        color: theme.textHintColor,
                        marginTop: 2,
                        marginRight: 1,
                      }}
                    />
                    <TextSpan
                      className="ml-2"
                      style={{ marginTop: 2 }}
                      apparence="s3"
                    >
                      {`${floatToStringBrazilian(x[3], 1)} kn`}
                    </TextSpan>
                  </RowRead>
                </ColStart>
              </Row>
            );
          })}
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  listSelectedPoints: state.fleet.listSelectedPoints,
  routeHistory: state.fleet.routeHistory,
  isLoading: state.map.routerIsLoading,
  isShowPoints: state.map.isShowPoints,
  isShowSequencePoints: state.map.isShowSequencePoints,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
});

const mapDispatchToProps = (dispatch) => ({
  setListSelectedPoint: (listSelectedPoints) => {
    dispatch(setListSelectedPoint(listSelectedPoints));
  },
  setIsShowPoints: (isShowPoints) => {
    dispatch(setIsShowPoints(isShowPoints));
  },
  setIsShowSequencePoints: (isShowSequencePoints) => {
    dispatch(setIsShowSequencePoints(isShowSequencePoints));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ListPoints);
