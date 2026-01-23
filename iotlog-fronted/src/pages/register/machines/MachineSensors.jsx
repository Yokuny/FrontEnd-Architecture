import { EvaIcon, InputGroup, Spinner } from "@paljs/ui";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import React from "react";
import { debounce } from "underscore";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";
import { Fetch, LabelIcon, MachineHeader, TextSpan } from "../../../components";
import BackButton from "../../../components/Button/BackButton";
import { TABLE, TBODY, TD, TH, THEAD, TR } from "../../../components/Table";
import { translate } from "../../../components/language";

const EmptyWrapper = styled.div`
  display: flex;
  height: 40vh;
  align-items: center;
  width: 100%;
  justify-content: center;
`;

const ContainerIcon = styled.a`
  position: absolute;
  right: 15px;
  top: 10px;
  cursor: pointer;
`;

function MachineSensors() {

  const theme = useTheme();
  const intl = useIntl();
  const params = new URL(window.location.href).searchParams;
  const idMachine = params.get("id");

  const [isLoading, setIsLoading] = React.useState(false);
  const [machineSensors, setMachineSensors] = React.useState([]);
  const [textFilter, setTextFilter] = React.useState("");

  React.useEffect(() => {
    getData();
  }, []);

  const getData = () => {
    setIsLoading(true);

    Fetch.get(`/machine/sensors?id=${idMachine}`)
      .then((response) => {
        setMachineSensors(response.data)
        setIsLoading(false);
      })
      .catch((e) => {
        toast.error(translate('error.get'))
        setIsLoading(false);
      });
  };

  const changeValueDebounced = debounce((text) => {
    setTextFilter(text);
  }, 500);

  const machinesFiltered = machineSensors.filter((sensor) => {
    return sensor?.sensor?.toLowerCase()?.includes((textFilter || "").trim().toLowerCase())
    || sensor?.sensorId?.toLowerCase()?.includes((textFilter || "").trim().toLowerCase())
  }
  );

  return (
    <>
      <Col>
        <Card>
          <CardHeader>
            <Col>
              <Row between="xs" middle="xs">
                <MachineHeader idMachine={idMachine} />
              </Row>
            </Col>
          </CardHeader>
          <CardBody>
            {isLoading ? (
              <EmptyWrapper>
                <Spinner style={{ backgroundColor: theme.scrollbarBackgroundColor }} />
              </EmptyWrapper>
            ) : (
              <>
                <Row>
                  <Col breakPoint={{ xs: 12, md: 12 }} className="mb-4">
                    <LabelIcon
                      iconName="search-outline"
                      title={intl.formatMessage({ id: "search" })}
                    />
                    <InputGroup fullWidth>
                      <input
                        placeholder={intl.formatMessage({ id: "search" })}
                        type="text"
                        onChange={(e) => changeValueDebounced(e.target.value)}
                      />
                      <ContainerIcon onClick={() => { }}>
                        <EvaIcon name="search-outline" status="Basic" />
                      </ContainerIcon>
                    </InputGroup>
                  </Col>
                </Row>
                {!machinesFiltered?.length ? (
                  <EmptyWrapper>
                    <TextSpan apparence="s1">
                      <FormattedMessage id="not.found" />
                    </TextSpan>
                  </EmptyWrapper>
                ) : (
                  <TABLE>
                    <THEAD>
                      <TR>
                        <TH>
                          <TextSpan apparence="s2" hint>
                            <FormattedMessage id="name" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center">
                          <TextSpan apparence="s2" hint>
                            Sensor ID
                          </TextSpan>
                        </TH>
                        <TH textAlign="center">
                          <TextSpan apparence="s2" hint>
                            <FormattedMessage id="type" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center">
                          <TextSpan apparence="s2" hint>
                            <FormattedMessage id="unit" />
                          </TextSpan>
                        </TH>
                        <TH textAlign="center">
                          <TextSpan apparence="s2" hint>
                            Min
                          </TextSpan>
                        </TH>
                        <TH textAlign="center">
                          <TextSpan apparence="s2" hint>
                            Max
                          </TextSpan>
                        </TH>
                      </TR>
                    </THEAD>
                    <TBODY>
                      {machinesFiltered?.sort((a, b) => a?.sensor?.localeCompare(b?.sensor))?.map((sensor, i) => {
                        return (
                          <TR isEvenColor={i % 2 === 0}>
                            <TD>
                              <TextSpan apparence="p2">
                                {sensor.sensor}
                              </TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="p2">
                                {sensor.sensorId}
                              </TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="p2">
                                {sensor.type}
                              </TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="p2">
                                {sensor.unit}
                              </TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="p2">
                                {sensor.valueMin}
                              </TextSpan>
                            </TD>
                            <TD textAlign="center">
                              <TextSpan apparence="p2">
                                {sensor.valueMax}
                              </TextSpan>
                            </TD>
                          </TR>
                        )
                      })}
                    </TBODY>
                  </TABLE>
                )}
              </>
            )
            }
          </CardBody>
          <CardFooter>
            <BackButton />
          </CardFooter>
        </Card>
      </Col >
    </>
  );
}
export default MachineSensors;
