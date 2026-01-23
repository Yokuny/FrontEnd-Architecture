import React from "react";
import { Button } from "@paljs/ui/Button";
import { EvaIcon } from "@paljs/ui/Icon";
import styled from "styled-components";
import { connect } from "react-redux";
import { setDataChart, setEditorItem } from "../../../actions";

const EditContainer = styled.div`
  position: absolute;
  top: 9px;
  left: 9px;
  z-index: 9999;
`;

const RemoveContainer = styled.div`
  position: absolute;
  top: 9px;
  right: 9px;
  z-index: 9999;
`;

const ActionsChart = (props) => {
  const {
    children,
    setOptionsData,
    setEditorItem,
    onRemove,
    data,
    activeEdit = true,
  } = props;

  const onRemoveInternal = () => {
    onRemove(data);
  };

  const onEdit = () => {
    setEditorItem(data);
    setOptionsData(data.options);
  };

  return (
    <>
      {activeEdit && (
        <RemoveContainer>
          <Button size="Tiny" status="Danger" onMouseDown={onRemoveInternal}>
            <EvaIcon name="trash-2-outline" />
          </Button>
        </RemoveContainer>
      )}
      {children}
      {activeEdit && (
        <EditContainer>
          <Button size="Tiny" status="Basic" onMouseDown={onEdit}>
            <EvaIcon name="edit-outline" />
          </Button>
        </EditContainer>
      )}
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  setOptionsData: (data) => {
    dispatch(setDataChart(data));
  },
  setEditorItem: (data) => {
    dispatch(setEditorItem(data));
  },
});

export default connect(undefined, mapDispatchToProps)(ActionsChart);
