import React from "react";
import { Button, EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { setDataChart, setEditorItem } from "../../../../actions";

const AddChart = (props) => {

  const { dragEnabled, idDashboard, idGroup } = props;

  const onAdd = () => {
    props.setEditorItem({ idDashboard, idGroup });
    props.setOptionsData(undefined);
  };

  return (
    dragEnabled && (
      <Button
        status="Primary"
        size="Small"
        className="flex-between mr-1 mt-3"
        onClick={onAdd}
      >
        <EvaIcon name="plus-square-outline" className="mr-1" />
        <FormattedMessage id="add.chart" />
      </Button>
    )
  );
};

const mapStateToProps = (state) => ({
  dragEnabled: state.dashboard.dragEnabled,
});

const mapDispatchToProps = (dispatch) => ({
  setOptionsData: (data) => {
    dispatch(setDataChart(data));
  },
  setEditorItem: (data) => {
    dispatch(setEditorItem(data));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AddChart);

