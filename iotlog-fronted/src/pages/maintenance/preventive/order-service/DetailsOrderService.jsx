import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  EvaIcon,
  InputGroup,
  Row
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, injectIntl } from "react-intl";
import styled from "styled-components";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import { SpinnerFull, TextSpan } from "../../../../components";
import { useFetch } from "../../../../components/Fetch/Fetch";
import {
  TABLE,
  TBODY,
  TH,
  THEAD,
  TR,
  TRH,
  TD,
} from "../../../../components/Table";

const ColCenter = styled(Col)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ColItem = styled(Col)`
  display: flex;
  flex-direction: column;
`;

const HeaderContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const DetailsOrderService = (props) => {
  const id = new URL(window.location.href).searchParams.get("id");

  const [isPrinting, setIsPriting] = React.useState(false);

  const componentRef = React.useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: () => {
      setIsPriting(false);
    },
  });
  const { isLoading, data } = useFetch(
    `/maintenancemachine/os/details?id=${id}`
  );

  const onPrint = () => {
    setIsPriting(true);
    setTimeout(() => {
      handlePrint();
    }, 1000);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <Row end className="mr-2">
            <Button
              size="Small"
              className="flex-between"
              status="Info"
              onClick={onPrint}
            >
              <EvaIcon name="printer-outline" className="mr-1" />
              <FormattedMessage id="print" />
            </Button>
          </Row>
        </CardHeader>
        <CardBody
          ref={componentRef}
          style={isPrinting ? { paddingTop: 0, marginTop: 0 } : {}}
        >
          <Row className="p-2">
            <ColCenter breakPoint={{ md: 12, sm: 12, xs: 12 }} className="mb-4">
              <img
                style={{
                  width: 100,
                  height: 60,
                  objectFit: "contain",
                  borderRadius: 8,
                }}
                src={data?.enterprise?.image?.url}
                alt={data?.enterprise?.name}
              />

              <HeaderContainer>
                <TextSpan apparence="s1" className="ml-2">
                  {data?.enterprise?.name}
                </TextSpan>
                <TextSpan apparence="c1" className="ml-2">
                  {`${data?.enterprise?.city} - ${data?.enterprise?.state}`}
                </TextSpan>
              </HeaderContainer>

              <TextSpan apparence="s1" className="ml-2">
                {data?.order}
              </TextSpan>
            </ColCenter>
            <Col breakPoint={{ md: 12 }} className="mt-4">
              <TextSpan apparence="s2" className="ml-2">
                <FormattedMessage id="machine" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input type="text" value={data?.machine?.name} readOnly />
              </InputGroup>
            </Col>
            <ColItem
              breakPoint={isPrinting ? { xs: 6 } : { md: 6 }}
              className="mt-4"
            >
              <TextSpan apparence="s2" className="ml-2">
                <FormattedMessage id="maintenance.plan" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="text"
                  value={data?.maintenancePlan?.description}
                  readOnly
                />
              </InputGroup>
            </ColItem>
            <ColItem
              breakPoint={isPrinting ? { xs: 3 } : { md: 3 }}
              className="mt-4 "
            >
              <TextSpan apparence="s2" className="ml-2">
                <FormattedMessage id="order.service" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="text"
                  style={{
                    textAlign: "right",
                  }}
                  value={data?.order}
                  readOnly
                />
              </InputGroup>
            </ColItem>

            <Col
              breakPoint={isPrinting ? { xs: 3 } : { md: 3 }}
              className="mt-4 "
            >
              <TextSpan apparence="s2" className="ml-2">
                <FormattedMessage id="done.at" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="text"
                  style={{
                    textAlign: "right",
                  }}
                  value={
                    data?.doneAt &&
                    moment(data?.doneAt).format(
                      props.intl.formatMessage({ id: "format.date" })
                    )
                  }
                  readOnly
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 12 }} className="mt-4 ">
              <TextSpan apparence="s2" className="ml-2">
                <FormattedMessage id="description" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <textarea rows={5} value={data?.description} readOnly />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 12 }} className="mt-4 ">
              <TextSpan apparence="s2">
                <FormattedMessage id="checklist" />
              </TextSpan>
              <div className="mt-1"></div>
              <TABLE>
                <THEAD>
                  <TRH>
                    <TH></TH>
                    <TH>
                      <FormattedMessage id="description" />
                    </TH>
                    <TH textAlign="center">
                      <FormattedMessage id="group" />
                    </TH>
                    <TH textAlign="center">
                      <FormattedMessage id="select.type.service.placeholder" />
                    </TH>
                    <TH>
                      <FormattedMessage id="observation" />
                    </TH>
                  </TRH>
                </THEAD>

                <TBODY>
                  {data?.services?.map((item, i) => (
                    <TR key={i} isEvenColor={i % 2 === 0}>
                      <TD textAlign="center">
                        <EvaIcon
                          name={
                            item?.done ? "checkmark-outline" : "close-outline"
                          }
                          status={item?.done ? "Success" : "Danger"}
                        />
                      </TD>

                      <TD>
                        <TextSpan apparence="s2">{item.description}</TextSpan>
                      </TD>
                      <TD textAlign="center">
                        <TextSpan apparence="s2">{item.groupName}</TextSpan>
                      </TD>
                      <TD textAlign="center">
                        <TextSpan apparence="s2">
                          {item?.typeService?.label ?? ""}
                        </TextSpan>
                      </TD>
                      <TD>
                        <TextSpan apparence="s2">{item?.observation ?? ""}</TextSpan>
                      </TD>
                    </TR>
                  ))}
                </TBODY>
              </TABLE>
            </Col>

            <Col breakPoint={{ md: 12 }} className="mt-4">
              <TextSpan apparence="s2" className="ml-2">
                <FormattedMessage id="action.by" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <textarea
                  rows={4}
                  value={data?.usersDone?.map((x) => x.name).join("\r\n")}
                  readOnly
                />
              </InputGroup>
            </Col>
            <Col
              breakPoint={isPrinting ? { xs: 9 } : { md: 9 }}
              className="mt-4"
            >
              <TextSpan apparence="s2" className="ml-2">
                <FormattedMessage id="user.fill" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input type="text" value={data?.userFill?.name} readOnly />
              </InputGroup>
            </Col>
            <Col
              breakPoint={isPrinting ? { xs: 3 } : { md: 3 }}
              className="mt-4"
            >
              <TextSpan apparence="s2" className="ml-2">
                <FormattedMessage id="fill.at" />
              </TextSpan>
              <div className="mt-1"></div>
              <InputGroup fullWidth>
                <input
                  type="text"
                  style={{
                    textAlign: "right",
                  }}
                  value={
                    data?.createAt &&
                    moment(data?.createAt).format(
                      props.intl.formatMessage({ id: "format.date" })
                    )
                  }
                  readOnly
                />
              </InputGroup>
            </Col>
          </Row>
        </CardBody>
      </Card>

      <SpinnerFull isLoading={isLoading || isPrinting} />
    </>
  );
};

export default injectIntl(DetailsOrderService);
