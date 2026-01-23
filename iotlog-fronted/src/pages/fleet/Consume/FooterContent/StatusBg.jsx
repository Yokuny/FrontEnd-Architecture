import React from "react";
import { Badge } from "@paljs/ui";
import { connect } from "react-redux";
import styled, { useTheme } from "styled-components";
import { getStatusIcon } from "../../Status/Base";
import { LabelIcon } from "../../../../components";
import { POSITION_DATA_CONSUME } from "../Constants";

const ColFlex = styled.div`
  display: flex;
  flex-direction: column;
`;

const RowFlex = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const StatusBg = (props) => {
  const { data, isShowData, itemHistoryConsume, eventsStatusHistory } = props;

  const theme = useTheme();

  const getItemSelected = () => {
    if (isShowData) {
      const dateBase = new Date(itemHistoryConsume[POSITION_DATA_CONSUME.DATE] * 1000).getTime();
      return eventsStatusHistory
      ?.find(x =>
        dateBase >= new Date(x.data.dateTimeStart).getTime() &&
        dateBase <= (x.data.dateTimeEnd ? new Date(x.data.dateTimeEnd).getTime() : new Date().getTime())
      )
      ?.data?.status;
    }

    return data?.statusNavigation
  }

  const statusToShow = getStatusIcon(getItemSelected(), theme);

  return (
    <>
      <ColFlex className="ml-2">
        <LabelIcon iconName="flash-outline" title={`Status`} />
        {statusToShow?.bgColor && (
          <Badge
            position=""
            style={{
              position: "inherit",
              backgroundColor: statusToShow.bgColor,
            }}
          >
            <RowFlex>{statusToShow.component}</RowFlex>
          </Badge>
        )}
      </ColFlex>
    </>
  );
};

const mapStateToProps = (state) => ({
  itemHistoryConsume: state.fleet.itemHistoryConsume,
  eventsStatusHistory: state.fleet.eventsStatusHistory,
});


export default connect(
  mapStateToProps,
  undefined
)(StatusBg);
