import { Row, Tab, Tabs } from "@paljs/ui";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { addDataVoyage } from "../../../../../actions";
import PerformanceReport from "../../performance";
import ArrivalROB from "./ArrivalROB";

const TabsStyled = styled(Tabs)`
  width: 100%;

  .tab-content {
    padding: 1rem 0 0 0;
  }
`;

const ArrivalReport = (props) => {
  const { data, addDataVoyage } = props;

  const intl = useIntl();

  const onChangeArrival = (prop, value) => {
    addDataVoyage({
      arrivalReport: {
        ...(data?.arrivalReport || {}),
        [prop]: value,
      },
    });
  };

  const onChangeData = (prop, value) => {
    addDataVoyage({
      [prop]: value,
    });
  };

  return (
    <>
      <Row style={{ padding: 0 }}>
        <TabsStyled fullWidth>
          <Tab title="ROB" responsive>
            <ArrivalROB
              data={data}
              onChangeDataRBO={onChangeArrival}
              onChangeData={onChangeData}
              machine={data?.machine}
            />
          </Tab>
          <Tab title={intl.formatMessage({ id: "performance" })} responsive>
            <PerformanceReport
              dataPerformance={data?.arrivalReport}
              onChangeData={onChangeArrival}
              machine={data?.machine}
            />
          </Tab>
        </TabsStyled>
      </Row>
    </>
  );
};

const mapStateToProps = (state) => ({
  data: state.voyage.data,
});

const mapDispatchToProps = (dispatch) => ({
  addDataVoyage: (item) => {
    dispatch(addDataVoyage(item));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(ArrivalReport);
