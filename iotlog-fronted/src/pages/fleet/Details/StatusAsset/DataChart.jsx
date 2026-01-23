import { Col, Row } from "@paljs/ui";
import ChartHistory from "./ChartHistory";

export default function DataChart(props) {
  const { item } = props;
  return (
    <>
      <Row className="mt-4">
        <Col
          breakPoint={{ md: 12 }}
          className="col-flex-center"
          style={{ zIndex: 1299 }}
        >
          <ChartHistory machine={item?.machine} key={item?.machine?.id} />
        </Col>
      </Row>
    </>
  );
}
