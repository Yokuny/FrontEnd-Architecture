import { Card, CardBody } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import { EvaIcon } from "@paljs/ui/Icon";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { TextSpan } from "../../../../components";
import { useFetchSupport } from "../../../../components/Fetch/FetchSupport";

const Start = styled.div`
  margin-left: 10px;
`;

const ViewFeedback = (props) => {
  const { data, isLoading } = useFetchSupport(
    `/feedback/find?idOrderSupport=${props.order.id}`
  );

  const note = data?.note || 0;

  return (
    <>
      {/* <Card>
        <CardBody> */}
          <Col>
            <TextSpan apparence="p1"><FormattedMessage id="feedback.show"/></TextSpan>
            <Row className="mb-4 mt-4">
              <Start>
                <EvaIcon
                  name={note >= 1 ? "star" : "star-outline"}
                  options={{
                    fill: "#ffcb2b",
                    width: 30,
                    height: 30,
                  }}
                />
              </Start>

              <Start>
                <EvaIcon
                  name={note >= 2 ? "star" : "star-outline"}
                  options={{
                    fill: "#ffcb2b",
                    width: 30,
                    height: 30,
                  }}
                />
              </Start>
              <Start>
                <EvaIcon
                  name={note >= 3 ? "star" : "star-outline"}
                  options={{
                    fill: "#ffcb2b",
                    width: 30,
                    height: 30,
                  }}
                />
              </Start>
              <Start>
                <EvaIcon
                  name={note >= 4 ? "star" : "star-outline"}
                  options={{
                    fill: "#ffcb2b",
                    width: 30,
                    height: 30,
                  }}
                />
              </Start>
              <Start>
                <EvaIcon
                  name={note >= 5 ? "star" : "star-outline"}
                  options={{
                    fill: "#ffcb2b",
                    width: 30,
                    height: 30,
                  }}
                />
              </Start>
            </Row>
            <TextSpan apparence="s1">{data?.description}</TextSpan>
          </Col>
        {/* </CardBody>
      </Card> */}
    </>
  );
};

export default ViewFeedback;
