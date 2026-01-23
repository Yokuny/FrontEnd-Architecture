import React from "react";
import { Card } from "@paljs/ui/Card";
import { connect } from "react-redux";
import { LoadingCard } from "../../../../Loading";

const ConsumeStatusDetailWrapper = (props) => {
  return (
    <LoadingCard isLoading={props.isLoadingStatusConsume} >
      <Card style={{
        boxShadow: "none",
        height: "100%", width: "100%", marginBottom: 0
      }}>
        <props.component
          id={props.id}
          activeEdit={props.activeEdit}
          isMobile={props.isMobile}
          filterStatusConsume={props.filterStatusConsume}
          dataStatusConsume={props.dataStatusConsume}
          unitStatusConsume={props.unitStatusConsume}
        />
      </Card>
    </LoadingCard>
  );
};

const mapStateToProps = (state) => ({
  isLoadingStatusConsume: state.chartData.isLoadingStatusConsume,
  dataStatusConsume: state.chartData.dataStatusConsume,
  filterStatusConsume: state.chartData.filterStatusConsume,
  unitStatusConsume: state.chartData.unitStatusConsume,
});

export default connect(mapStateToProps, undefined)(ConsumeStatusDetailWrapper);
