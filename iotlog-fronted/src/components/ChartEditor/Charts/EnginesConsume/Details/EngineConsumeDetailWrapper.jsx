import React, { useEffect, useState } from "react";
import { Card } from "@paljs/ui/Card";
import moment from "moment";
import { Fetch } from "../../../../Fetch";
import { connect } from "react-redux";
import { LoadingCard } from "../../../../Loading";


const EngineConsumeDetailWrapper = (props) => {

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (props.filterStatusConsume?.length > 1)
    getData();
  }, [props.filterStatusConsume]);

  const getData = () => {
    if (!props.filterStatusConsume?.length) {
      return;
    }
    const data = {
      idMachine: props.filterStatusConsume[1]?.idMachine,
      dateInit: moment(props.filterStatusConsume[1]?.dateInit || new Date()).format("YYYY-MM-DDT00:00:00Z"),
      dateEnd: moment(props.filterStatusConsume[1]?.dateEnd || new Date()).format("YYYY-MM-DDT23:59:59Z"),
      status: props.filterStatusConsume?.length > 2 ? props.filterStatusConsume[2] : ""
    };
    setIsLoading(true);
    Fetch.get(
      `/sensordata/event/${data.idMachine}?dateInit=${data.dateInit}&dateEnd=${data.dateEnd
      }${data.status ? "&status=" + data.status : ""}`
    )
      .then((response) => {
        setData(response.data);
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <LoadingCard isLoading={props.isLoadingStatusConsume || isLoading}>
      <Card style={{
        boxShadow: "none",
        height: "100%", width: "100%", marginBottom: 0
      }}>
        <props.component
          id={props.id}
          activeEdit={props.activeEdit}
          isMobile={props.isMobile}
          filterStatusConsume={props.filterStatusConsume}
          data={data}
          dataStatusConsume={props.dataStatusConsume}
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


export default connect(mapStateToProps, undefined)(EngineConsumeDetailWrapper);
