import React from "react";
import { connect } from "react-redux";
import ListVesselsInFence from "./ListVesselsInFence";

const VesselsInFence = (props) => {

  if (!props.isShowList) {
    return null
  }

  if (props.filterPortActivity?.type) {
    return <ListVesselsInFence
      code={props.filterPortActivity?.code}
      type={props.filterPortActivity?.type}
    />
  }
}

const mapStateToProps = (state) => ({
  filterPortActivity: state.map.filterPortActivity,
  isShowList: state.fleet.isShowList,
});

export default connect(mapStateToProps, undefined)(VesselsInFence);
