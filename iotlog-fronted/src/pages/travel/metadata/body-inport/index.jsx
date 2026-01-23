import { Card, CardHeader, Col, EvaIcon } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { addDataVoyage } from "../../../../actions";
import { TextSpan } from "../../../../components";
import { getIsBarge } from "../common";
import ROBData from "../ROB";
import { FormInPort } from "../forms";

const BodyInPort = (props) => {
  const { data, addDataVoyage } = props;

  const onChangeData = (prop, value) => {
    addDataVoyage({
      inPortReport: {
        ...(data?.inPortReport || {}),
        [prop]: value,
      },
    });
  };

  if (!data?.machine) {
    return (<></>)
  }

  const isBarge = getIsBarge(data?.machine?.model?.description);

  return (
    <>
      {!isBarge && (
        <Col breakPoint={{ md: 12 }}>
          <Card>
            <CardHeader style={{ alignItems: "center", display: "flex" }}>
              <EvaIcon name="droplet" status="Primary" />
              <TextSpan className="ml-2" apparence="s1">
                <FormattedMessage id="consume" />
              </TextSpan>
            </CardHeader>
            <div className="mt-2"></div>
            <ROBData
              dataRBO={data?.inPortReport}
              onChangeData={onChangeData}
              isShowDistance
            />
          </Card>
        </Col>
      )}
      <FormInPort />
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

export default connect(mapStateToProps, mapDispatchToProps)(BodyInPort);
