import React from "react";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, injectIntl } from "react-intl";
import { TextSpan, CardFile } from "../../../../components";
import styled from "styled-components";
import Row from "@paljs/ui/Row";
import Col from "@paljs/ui/Col";
import { getPriorities, getStatus } from "../../services";
import Badge from "@paljs/ui/Badge";
import moment from "moment";

const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
`;

const ColText = styled(Col)`
  display: flex;
  flex-direction: column;
`;

const DataDetails = (props) => {
  const { data, intl } = props;
  const priority = getPriorities(data?.priority);
  const status = getStatus(data?.status);

  const getDateSla = (sla) => {
    let dateSla = "";
    if (sla) {
      dateSla = moment(sla).format(
        intl.formatMessage({ id: "format.datetimewithoutss" })
      );
    }

    return dateSla;
  };

  return (
    <>
      <Card>
        <CardHeader>
          {status && (
            <Badge style={{ marginRight: 12 }} status={status?.badge}>
              <FormattedMessage id={status?.textId} />
            </Badge>
          )}
          <TextSpan apparence="p2">
            <FormattedMessage id="support" />
            {": "}
          </TextSpan>
          <TextSpan apparence="h7">{data?.code || "-"}</TextSpan>
        </CardHeader>
        {props.renderContent && <CardBody>{props.renderContent()}</CardBody>}
        <CardFooter>
          <Row className="mb-4">
            <Col breakPoint={{ md: 4 }}>
              <Img
                src={data?.urlProductServiceImage}
                alt={data?.productService}
              />
            </Col>
            <Col breakPoint={{ md: 8 }}>
              <Row>
                <ColText breakPoint={{ md: 12 }} className="mb-4">
                  <TextSpan apparence="p2">
                    <FormattedMessage id="support.subject.label" />
                  </TextSpan>
                  <TextSpan apparence="s1">{data?.subject}</TextSpan>
                </ColText>

                <ColText breakPoint={{ md: 2 }} className="mb-4">
                  <TextSpan apparence="p2">
                    <FormattedMessage id="support.priority.label" />
                  </TextSpan>
                  <div>
                    {priority && (
                      <Badge
                        style={{
                          backgroundColor: priority?.color,
                          position: "relative",
                        }}
                      >
                        <FormattedMessage id={priority?.description} />
                      </Badge>
                    )}
                  </div>
                </ColText>

                <ColText breakPoint={{ md: 10 }} className="mb-4">
                  <TextSpan apparence="p2">
                    <FormattedMessage id="support.typeProblem.label" />
                  </TextSpan>
                  <TextSpan apparence="s1">{data?.typeProblem}</TextSpan>
                </ColText>

                <ColText breakPoint={{ md: 12 }} className="mb-4">
                  <TextSpan apparence="p2">
                    <FormattedMessage id="product.service" />
                  </TextSpan>
                  <TextSpan apparence="s1">{`${data?.idProductService} - ${data?.productService}`}</TextSpan>
                </ColText>

                <ColText breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="p2">
                    <FormattedMessage id="user.request" />
                  </TextSpan>
                  <TextSpan apparence="s1">{data?.userRequest}</TextSpan>
                </ColText>

                <ColText breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="p2">
                    <FormattedMessage id="enterprise" />
                  </TextSpan>
                  <TextSpan apparence="s1">{data?.enterprise}</TextSpan>
                </ColText>

                <ColText breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="p2">
                    <FormattedMessage id="sla.attendance" />
                  </TextSpan>
                  <TextSpan apparence="s1">
                    {`${getDateSla(data?.dateSlaAttendance)}`}
                  </TextSpan>
                </ColText>

                <ColText breakPoint={{ md: 6 }} className="mb-4">
                    <TextSpan apparence="p2">
                      <FormattedMessage id="sla.solution" />
                    </TextSpan>
                    <TextSpan apparence="s1">{`${getDateSla(data?.dateSlaSolution)}`}
                    </TextSpan>
                </ColText>
              </Row>
            </Col>
          </Row>
          <Row className="mb-4">
            <Col breakPoint={{ md: 8 }}>

            </Col>
          </Row>
          <Row>
            <ColText breakPoint={{ md: 12 }} className="mb-4">
              <TextSpan apparence="p2">
                <FormattedMessage id="description" />
              </TextSpan>
              <TextSpan apparence="s1" style={{ whiteSpace: "pre-line" }}>
                {data?.description}
              </TextSpan>
            </ColText>
          </Row>
          <Row>
            {data?.files.map((file, i) => (
              <Col key={i} breakPoint={{ md: 3 }} className="mr-2">
                <CardFile file={file} />
              </Col>
            ))}
          </Row>
        </CardFooter>
      </Card>
    </>
  );
};

export default injectIntl(DataDetails);
