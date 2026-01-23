import React from "react";
import styled from "styled-components";
import Col from "@paljs/ui/Col";
import { Card, CardHeader } from "@paljs/ui/Card";
import { useSearchParams } from "react-router-dom";
import { InputGroup } from "@paljs/ui/Input";
import { EvaIcon } from "@paljs/ui/Icon";
import { FormattedMessage } from "react-intl";
import Row from "@paljs/ui/Row";
import moment from "moment";
import { Tab, Tabs } from "@paljs/ui/Tabs";
import { useFetch } from "../../components/Fetch/Fetch";
import { SpinnerFull, TextSpan, UserImage } from "../../components";


const ContainerIcon = styled.a`
  position: absolute;
  right: 10px;
  top: 6px;
  cursor: pointer;
`;

export default function DocIntegration(props) {

  const [searchParams] = useSearchParams();

  const idMachine = searchParams.get("idMachine");
  const id = searchParams.get("id");

  const { data, isLoading } = useFetch(`/machine/integration?id=${id}`);

  const [showToken, setShowToken] = React.useState(false);
  const [date] = React.useState(moment().format("YYYY-MM-DDTHH:mm:ss"));

  return (
    <>
      <Col>
        <Card>
          <CardHeader>
            <UserImage
              size="Large"
              image={data?.image?.url}
              title={data?.enterprise?.name}
              name={data?.name}
            />
          </CardHeader>

          <Tabs fullWidth>
            <Tab title="MQTT (v2.0)">
              <Row>
                {/* <Col breakPoint={{ md: 6 }} className="mt-1">
                  <TextSpan apparence="s2">Host</TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.hostMqtt || "-"} />
                  </InputGroup>
                </Col> */}
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2">Host (SSL/TLS)</TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.hostMqtts || "-"} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 4 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="username" />
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.id} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 8 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="password" />
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input
                      type={showToken ? "text" : "password"}
                      value={data?.token}
                      onChange={(e) => {}}
                    />
                    <ContainerIcon onClick={() => setShowToken(!showToken)}>
                      <EvaIcon
                        name={showToken ? "eye-outline" : "eye-off-outline"}
                        status="Basic"
                      />
                    </ContainerIcon>
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="topic" />
                  </TextSpan>

                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={`/siot/n/${data?.id}`} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2" className="mt-2">
                    <FormattedMessage id="example.request.machine" />:
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2">
                    <textarea
                      rows={18}
                      value={`{
    "date": "${date}",
    "sensors": [
        ${data?.sensors
          ?.map(
            (x) => `{
          "id": "${x.sensorId}",
          "value": ${x.sensorId === "gps" ? "[2.58959, 9.65958]" : Math.floor(
                  Math.random() * 600
                )}`).join("\n        },\n        ")
          }
        }
    ]
}`}
                      onChange={(e) => {}}
                      readOnly
                    ></textarea>
                  </InputGroup>
                </Col>
              </Row>
            </Tab>

            <Tab title="MQTT (Simple)">
              <Row>
                {/* <Col breakPoint={{ md: 6 }} className="mt-1">
                  <TextSpan apparence="s2">Host</TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.hostMqtt || "-"} />
                  </InputGroup>
                </Col> */}
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2">Host (SSL/TLS)</TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.hostMqtts || "-"} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 4 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="username" />
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.id} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 8 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="password" />
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input
                      type={showToken ? "text" : "password"}
                      value={data?.token}
                      onChange={(e) => {}}
                    />
                    <ContainerIcon onClick={() => setShowToken(!showToken)}>
                      <EvaIcon
                        name={showToken ? "eye-outline" : "eye-off-outline"}
                        status="Basic"
                      />
                    </ContainerIcon>
                  </InputGroup>
                </Col>

                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2" className="mt-2">
                    <FormattedMessage id="example.request.machine" />:
                  </TextSpan>

                  {data?.sensors?.map((x, i) =>
                    x.signals?.map((y, j) => (
                      <Row key={`${i}-${j}`}>
                        <Col breakPoint={{ md: 6 }} className="mt-1">
                          <TextSpan apparence="s2">
                            <FormattedMessage id="topic" />
                          </TextSpan>

                          <InputGroup
                            fullWidth
                            size="Small"
                            className="mt-2 mb-4"
                          >
                            <input
                              type="text"
                              value={`/siot/${data?.id}/${x.sensorId}/${y.id}`}
                            />
                          </InputGroup>
                        </Col>
                        <Col breakPoint={{ md: 6 }} className="mt-1">
                          <TextSpan apparence="s2">Payload (Value)</TextSpan>

                          <InputGroup
                            fullWidth
                            size="Small"
                            className="mt-2 mb-4"
                          >
                            <input
                              type="text"
                              value={x.sensorId === "gps" ? "[-25.569,-32.59548]" : Math.floor(Math.random() * 600)}
                            />
                          </InputGroup>
                        </Col>
                      </Row>
                    ))
                  )}
                </Col>
              </Row>
            </Tab>

            <Tab title="HTTP (REST API)">
              <Row>
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2">Host</TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.hostRest || "-"} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="machine.token.label" />
                  </TextSpan>
                  <Row>
                    <Col breakPoint={{ md: 2 }}>
                      <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                        <input
                          type="text"
                          value="key-token"
                          onChange={(e) => {}}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 10 }}>
                      <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                        <input
                          type={showToken ? "text" : "password"}
                          value={data?.token}
                          onChange={(e) => {}}
                        />
                        <ContainerIcon onClick={() => setShowToken(!showToken)}>
                          <EvaIcon
                            name={showToken ? "eye-outline" : "eye-off-outline"}
                            status="Basic"
                          />
                        </ContainerIcon>
                      </InputGroup>
                    </Col>
                  </Row>
                  <TextSpan apparence="s2" className="mt-2">
                    <FormattedMessage id="example.request.machine" />:
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2">
                    <textarea
                      rows={18}
                      value={`{
    "idMachine": "${data?.id}",
    "date": "${date}",
    "sensors": [
        ${data?.sensors
          ?.map(
            (x) => `{
          "id": "${x.sensorId}",
          "value": ${x.sensorId === "gps" ? "[2.58959, 9.65958]" : Math.floor(
                  Math.random() * 600
                )}`).join("\n        },\n        ")
          }
        }
    ]
}`}
                      onChange={(e) => {}}
                      readOnly
                    ></textarea>
                  </InputGroup>
                </Col>
              </Row>
            </Tab>
{/*
            <Tab title="MQTT (Minified - DEPRECATED)">
              <Row>
                <Col breakPoint={{ md: 6 }} className="mt-1">
                  <TextSpan apparence="s2">Host</TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.hostMqtt || "-"} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 6 }} className="mt-1">
                  <TextSpan apparence="s2">Host (SSL/TLS)</TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.hostMqtts || "-"} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 4 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="username" />
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.id} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 8 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="password" />
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input
                      type={showToken ? "text" : "password"}
                      value={data?.token}
                      onChange={(e) => {}}
                    />
                    <ContainerIcon onClick={() => setShowToken(!showToken)}>
                      <EvaIcon
                        name={showToken ? "eye-outline" : "eye-off-outline"}
                        status="Basic"
                      />
                    </ContainerIcon>
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="topic" />
                  </TextSpan>

                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={`/siot/m/${data?.id}`} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2" className="mt-2">
                    <FormattedMessage id="example.request.machine" />:
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2">
                    <textarea
                      rows={25}
                      value={`{
    "date": "${date}",
    "sensors": [
        ${data?.sensors
          ?.map(
            (x) => `{
          "id": "${x.sensorId}",\n          "signals": [
            ${x?.signals
              ?.map(
                (y) => ` {
                "id": "${y.id}",\n                "value": ${Math.floor(
                  Math.random() * 600
                )}`
              )
              .join(",\n              ")}
              }
          ]
        }`
          )
          .join(",\n        ")}
    ]
}`}
                      onChange={(e) => {}}
                      readOnly
                    ></textarea>
                  </InputGroup>
                </Col>
              </Row>
            </Tab>

            <Tab title="MQTT (EXPLICIT DEPRECATED)">
              <Row>
                <Col breakPoint={{ md: 6 }} className="mt-1">
                  <TextSpan apparence="s2">Host</TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.hostMqtt} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 6 }} className="mt-1">
                  <TextSpan apparence="s2">Host (SSL/TLS)</TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.hostMqtts} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 4 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="username" />
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={data?.id} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 8 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="password" />
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input
                      type={showToken ? "text" : "password"}
                      value={data?.token}
                      onChange={(e) => {}}
                    />
                    <ContainerIcon onClick={() => setShowToken(!showToken)}>
                      <EvaIcon
                        name={showToken ? "eye-outline" : "eye-off-outline"}
                        status="Basic"
                      />
                    </ContainerIcon>
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2">
                    <FormattedMessage id="topic" />
                  </TextSpan>

                  <InputGroup fullWidth size="Small" className="mt-2 mb-4">
                    <input type="text" value={`/siot/s/${data?.id}`} />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mt-1">
                  <TextSpan apparence="s2" className="mt-2">
                    <FormattedMessage id="example.request.machine" />
                  </TextSpan>
                  <InputGroup fullWidth size="Small" className="mt-2">
                    <textarea
                      rows={25}
                      value={`{
    "idMachine": "${data?.id}",
    "date": "${date}",
    "status": "active", // optional
    "sensors": [
        ${data?.sensors
          ?.map(
            (x) => `{
          "sensorId": "${
            x.sensorId
          }",\n          "status": "active", // optional\n          "signals": [
            ${x?.signals
              ?.map(
                (y) => ` {
                "signal": "${y.id}",\n                "value": ${Math.floor(
                  Math.random() * 600
                )}`
              )
              .join(",\n              ")}
              }
          ]
        }`
          )
          .join(",\n        ")}
    ]
}`}
                      onChange={(e) => {}}
                      readOnly
                    ></textarea>
                  </InputGroup>
                </Col>
              </Row>
            </Tab> */}


          </Tabs>
        </Card>
      </Col>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
}
