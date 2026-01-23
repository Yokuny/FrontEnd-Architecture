import { Row } from "@paljs/ui";
import React from "react";
import { connect } from "react-redux";
import { TextSpan } from "../../../../components";
import DeleteGroup from "./DeleteGroup";
import EditGroup from "./EditGroup";

const TitleGroup = (props) => {
  const { data, dragEnabled, idDashboard } = props;

  return (<>
    <Row style={{ margin: 0 }}>
      <TextSpan apparence="s2">{data.description}</TextSpan>
      {dragEnabled && <>
        <EditGroup data={data} idDashboard={idDashboard} />
        <DeleteGroup data={data} idDashboard={idDashboard} />
      </>}
    </Row>
  </>)
}

const mapStateToProps = (state) => ({
  dragEnabled: state.dashboard.dragEnabled,
});

export default connect(mapStateToProps, undefined)(TitleGroup);
