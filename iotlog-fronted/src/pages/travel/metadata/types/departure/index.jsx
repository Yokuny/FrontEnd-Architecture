import { Row, Tab, Tabs } from "@paljs/ui";
import { useIntl } from "react-intl";
import { connect } from "react-redux";
import styled from "styled-components";
import { addDataVoyage } from "../../../../../actions";
import PerformanceReport from "../../performance";
import ROBData from "../../ROB";

const TabsStyled = styled(Tabs)`
  width: 100%;

  .tab-content {
    padding: 1rem 0 0 0;
  }
`;

const DepartureReport = (props) => {
  const { data, addDataVoyage } = props;

  const intl = useIntl();

  const onChangeDeparture = (prop, value) => {
    addDataVoyage({
      departureReport: {
        ...(data?.departureReport || {}),
        [prop]: value
      },
    });
  };

  return (
    <>
      <Row style={{ padding: 0 }}>
        <TabsStyled fullWidth>
          <Tab title="ROB" responsive>
            <ROBData
              dataRBO={data?.departureReport}
              onChangeData={onChangeDeparture}
              machine={data?.machine}
            />
          </Tab>
          <Tab title={intl.formatMessage({ id: "performance" })} responsive>
            <PerformanceReport
              dataPerformance={data?.departureReport}
              onChangeData={onChangeDeparture}
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

export default connect(mapStateToProps, mapDispatchToProps)(DepartureReport);
