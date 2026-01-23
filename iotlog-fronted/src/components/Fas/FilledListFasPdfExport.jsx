import * as React from "react";
import { Card, CardBody } from "@paljs/ui/Card";
import { FormattedMessage } from "react-intl";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import moment from "moment";
import {
  LabelIcon,
  TextSpan,
} from "../";
import { isObject, isArray } from "underscore";
import { TABLE, TBODY, TD, TH, THEAD, TR, TRH } from './ExportPdfTable';
import StatusFas from "../../pages/forms/fas/StatusFas";
import styled from "styled-components";

const ColStyled = styled(Col)`
  border: 1pt solid #000;
  border-bottom: none;
  &:first-child {
    border-right: none; // Remove border from the last column
 }
 &:last-child {
    border-bottom: 1pt solid #000; // Remove border from the last column
 }
`
const FilledListFas = (props) => {

  const [data, setData] = React.useState(props.data)

  React.useEffect(() => {
    if (!isArray(props.data) && isObject(props.data)) {
      const parsedData = {
        ...props.data,
        orders: props.data?.orders?.filter((order) =>
          !["not.approved", "cancelled", "not.realized", "awaiting.create.confirm"].includes(order.state)
        ).map((order) => {
          return {
            ...order,
            collaborators: order.collaborators?.length ?
              order.collaborators.map((col => col.name)).join(",") :
              "N/A",
          }
        }) || []
      }
      setData(parsedData);
    }

  }, [props])

  return (
    <React.Fragment>
      <Card style={{ display: "none", width: "100%" }}>
        <style type="text/css" media="print" >
          {"@page { size: landscape; }"}
        </style>
        <CardBody ref={props.fowardedRef}>
          <Row between="sm">
            <Col breakPoint={{ lg: 3, md: 3, sm: 4 }} className="mb-4">
              <span>
                <img src={'https://siot-file.konztec.com/enterprise/2022/01/07/20220107_205142_dca2a1ac96df4e9ea0d2c918a28be431.png'} height={56.69} style={{ height: 56.69 }} alt="logo" />
              </span>
            </Col>
            <Col breakPoint={{ lg: 3, md: 3, sm: 6 }} className="mb-4">
              <TextSpan apparence="h5" className="pl-1">
                {`${data?.vessel?.name} | ${data?.type} | ${data?.serviceDate ? moment(data?.serviceDate).format("DD MMM YYYY") : "-"}`}
              </TextSpan>
            </Col>
            <ColStyled breakPoint={{ lg: 3, md: 3, sm: 2 }} className="mb-4">
              <LabelIcon
                title={<FormattedMessage id="date" />}
              />
              <TextSpan apparence="s1" className="pl-1">
                {data?.serviceDate ? moment(data?.serviceDate).format("DD MMM YYYY") : "-"}
              </TextSpan>
            </ColStyled>
          </Row>

          <Row>
            <ColStyled style={{ borderRight: "none !important" }} breakPoint={{ lg: 3, md: 3, sm: 6 }} className="mb-0">
              <LabelIcon
                title={<FormattedMessage id="type" />}
              />
              <TextSpan apparence="s1" className="pl-1">
                {data?.type}
              </TextSpan>
            </ColStyled>
            <ColStyled breakPoint={{ lg: 2, md: 2, sm: 6 }} style={{ borderCollapse: "collapse" }} className="mb-0">
              <LabelIcon
                title={<FormattedMessage id="local" />}
              />
              <TextSpan apparence="s1" className="pl-1">
                {data?.local}
              </TextSpan>
            </ColStyled>
            <ColStyled style={{ borderTop: "none !important" }} breakPoint={{ lg: 3, md: 3 }} className="mb-0">
              <LabelIcon
                title={<FormattedMessage id="vessel" />}
              />
              <TextSpan apparence="s1" className="pl-1">
                {data?.vessel?.name}
              </TextSpan>
            </ColStyled>
          </Row>
          <Row>
            {data?.orders?.length ?
              <Col breakPoint={{ lg: 12, md: 12 }} className="mb-4">
                <LabelIcon
                  title={<FormattedMessage id="order.service" />}
                />
                <TABLE >
                  <THEAD>
                    <TRH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='p2' >
                          JOB
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='p2' >
                          <FormattedMessage id="os" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='p2' >
                          <FormattedMessage id="description" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='p2' >
                          <FormattedMessage id="materialFas.label" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='p2' >
                          <FormattedMessage id="onboardMaterialFas.label" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='p2' >
                          <FormattedMessage id="rmrbFas.label" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='p2' >
                          <FormattedMessage id="suppliers" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='p2' >
                          <FormattedMessage id="fas.expense.collaborator.name" />
                        </TextSpan>
                      </TH>
                      <TH textAlign="center" key={`col-Zw-1`}>
                        <TextSpan apparence='p2' >
                          <FormattedMessage id="status" />
                        </TextSpan>
                      </TH>
                    </TRH>
                  </THEAD>
                  <TBODY>
                    {data
                      ?.orders
                      ?.filter(x => x.state !== "not.approved" && x.state !== "cancelled")
                      ?.map(({ id, ...order }, i) =>
                        <TR key={i} isEvenColor={i % 2 === 0} >
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.job}</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.name}</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.description}</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.materialFas}</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.onboardMaterial}</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.rmrb}</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{
                              order.supplierData?.razao
                                ? order.supplierData.razao
                                : order.recommendedSupplier
                                  ? `${order.recommendedSupplier} (Sugerido)`
                                  : "N/A"
                            }</TextSpan>
                          </TD>
                          <TD textAlign="center">
                            <TextSpan apparence="s2">{order.collaborators} </TextSpan>
                          </TD>
                          <TD textAlign="center" style={{ width: 60, padding: 11 }}>
                            <StatusFas status={order.state} />
                          </TD>
                        </TR>)}
                  </TBODY>
                </TABLE>
              </Col>
              : <></>}
          </Row>
        </CardBody>
      </Card>
    </React.Fragment>
  );
};

export default FilledListFas;

