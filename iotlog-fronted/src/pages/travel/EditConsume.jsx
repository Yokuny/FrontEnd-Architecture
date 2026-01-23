import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  InputGroup,
  Row,
  Select,
} from "@paljs/ui";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";
import { Fetch, LabelIcon, SpinnerFull, TextSpan } from "../../components";
import { Vessel, Route, Money, Container } from "../../components/Icons";
import {
  floatToStringNormalize,
  formatFloat,
  parseToFloatValid,
} from "../../components/Utils";
import { useNavigate } from "react-router-dom";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }

  overflow-x: hidden;
`;

const EditConsume = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const intl = useIntl();
  const theme = useTheme();
  const navigate = useNavigate();
  const idTravel = new URL(window.location.href).searchParams.get("id");

  const unitsOptions = [
    {
      value: "m³",
      label: "m³",
    },
    {
      value: "L",
      label: "L",
    },
    {
      value: "T",
      label: "T",
    },
  ];

  React.useLayoutEffect(() => {
    getData();
  }, []);

  const onChange = (prop, value) => {
    setData((prevState) => ({
      ...prevState,
      [prop]: value,
    }));
  };

  const getData = () => {
    if (idTravel) {
      setIsLoading(true);
      Fetch.get(`/travel/finddetailsadvanced?id=${idTravel}`)
        .then((response) => {
          setData({
            code: response.data?.code,
            machine: response.data?.machine,
            consumeIFO: floatToStringNormalize(response.data?.consumeIFO),
            consumeMDO: floatToStringNormalize(response.data?.consumeMDO),
            distance: floatToStringNormalize(response.data?.distance),
            loadWeight: floatToStringNormalize(response.data?.loadWeight),
            loadValue: floatToStringNormalize(response.data?.loadValue),
            freightCost: floatToStringNormalize(response.data?.freightCost),
            densityMDO: floatToStringNormalize(response.data?.densityMDO),
            densityIFO: floatToStringNormalize(response.data?.densityIFO),
            unitIFO: response.data?.unitIFO,
            unitMDO: response.data?.unitMDO,
          });
          setIsLoading(false);
        })
        .catch((e) => {
          setIsLoading(false);
        });
    }
  };

  const onSave = () => {
    setIsLoading(true);
    const dataToSave = {
      consumeIFO: parseToFloatValid(data?.consumeIFO),
      consumeMDO: parseToFloatValid(data?.consumeMDO),
      distance: parseToFloatValid(data?.distance),
      loadWeight: parseToFloatValid(data?.loadWeight),
      loadValue: parseToFloatValid(data?.loadValue),
      freightCost: parseToFloatValid(data?.freightCost),
      unitIFO: data?.unitIFO,
      unitMDO: data?.unitMDO,
    };

    if (data?.densityMDO || data?.densityMDO === "0") {
      dataToSave.densityMDO = parseToFloatValid(data?.densityMDO);
    }

    if (data?.densityIFO || data?.densityIFO === "0") {
      dataToSave.densityIFO = parseToFloatValid(data?.densityIFO);
    }

    Fetch.put(`/travel/detailsadvanced?id=${idTravel}`, dataToSave)
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsLoading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Card>
        <CardHeader>
          <TextSpan apparence="s1">
            <FormattedMessage id="add.travel.metadata" />
          </TextSpan>
        </CardHeader>
        <CardBody>
          <ContainerRow>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                iconName="cube-outline"
                title={<FormattedMessage id="code" />}
              />
              <TextSpan apparence="s1">{data?.code || "-"}</TextSpan>
            </Col>
            <Col breakPoint={{ md: 8 }} className="mb-4">
              <LabelIcon
                renderIcon={() => (
                  <Vessel
                    style={{
                      height: 13,
                      width: 13,
                      color: theme.textHintColor,
                      marginRight: 5,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
                title={<FormattedMessage id="active" />}
              />
              <TextSpan apparence="s1">
                {[data?.machine?.code, data?.machine?.name]
                  ?.filter((x) => x)
                  ?.join(" - ") || "-"}
              </TextSpan>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                iconName="droplet"
                title={`${intl.formatMessage({ id: "consume" })} IFO ${
                  data?.unitIFO ? `(${data.unitIFO})` : ""
                }`}
              />
              <Row className="mt-1" between style={{ margin: 0 }}>
                <InputGroup fullWidth style={{ width: "65%" }}>
                  <input
                    value={data?.consumeIFO}
                    onChange={(e) =>
                      onChange("consumeIFO", formatFloat(e.target.value))
                    }
                    type="text"
                    placeholder={`${intl.formatMessage({
                      id: "consume",
                    })} IFO`}
                  />
                </InputGroup>
                <div style={{ width: "32%" }}>
                  <Select
                    options={unitsOptions}
                    menuPosition="fixed"
                    placeholder={intl.formatMessage({ id: "unit" })}
                    value={unitsOptions.find((x) => x.value === data?.unitIFO)}
                    onChange={(e) => onChange("unitIFO", e?.value)}
                  />
                </div>
              </Row>
            </Col>
            <Col breakPoint={{ md: 4 }} className="mb-4">
              <LabelIcon
                iconName="droplet-outline"
                title={`${intl.formatMessage({ id: "consume" })} MDO`}
              />
              <Row className="mt-1" between style={{ margin: 0 }}>
                <InputGroup fullWidth style={{ width: "65%" }}>
                  <input
                    value={data?.consumeMDO}
                    onChange={(e) =>
                      onChange("consumeMDO", formatFloat(e.target.value))
                    }
                    type="text"
                    placeholder={`${intl.formatMessage({
                      id: "consume",
                    })} MDO`}
                  />
                </InputGroup>
                <div style={{ width: "32%" }}>
                  <Select
                    options={unitsOptions}
                    menuPosition="fixed"
                    placeholder={intl.formatMessage({ id: "unit" })}
                    value={unitsOptions.find((x) => x.value === data?.unitMDO)}
                    onChange={(e) => onChange("unitMDO", e?.value)}
                  />
                </div>
              </Row>
            </Col>
            <Col breakPoint={{ md: 2 }} className="mb-4">
              <LabelIcon
                iconName="droplet"
                title={`${intl.formatMessage({ id: "density" })} IFO ${
                  data?.unitIFO ? `(${data.unitIFO})` : ""
                }`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  value={data?.densityIFO}
                  onChange={(e) =>
                    onChange("densityIFO", formatFloat(e.target.value))
                  }
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "density",
                  })} IFO`}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 2 }} className="mb-4">
              <LabelIcon
                iconName="droplet-outline"
                title={`${intl.formatMessage({ id: "density" })} MDO`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  value={data?.densityMDO}
                  onChange={(e) =>
                    onChange("densityMDO", formatFloat(e.target.value))
                  }
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "density",
                  })} MDO`}
                />
              </InputGroup>
            </Col>
            <Col breakPoint={{ md: 3 }} className="mb-4">
              <LabelIcon
                renderIcon={() => (
                  <Route
                    style={{
                      height: 13,
                      width: 13,
                      fill: theme.textHintColor,
                      marginRight: 5,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
                title={`${intl.formatMessage({ id: "distance" })} (nm)`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  value={data?.distance}
                  onChange={(e) =>
                    onChange("distance", formatFloat(e.target.value))
                  }
                  type="text"
                  placeholder={`${intl.formatMessage({ id: "distance" })} (nm)`}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 3 }} className="mb-4">
              <LabelIcon
                renderIcon={() => (
                  <Container
                    style={{
                      height: 13,
                      width: 13,
                      fill: theme.textHintColor,
                      marginRight: 5,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
                title={`${intl.formatMessage({ id: "load.weight" })} (t)`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  value={data?.loadWeight}
                  onChange={(e) =>
                    onChange("loadWeight", formatFloat(e.target.value))
                  }
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "load.weight",
                  })} (t)`}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 3 }} className="mb-4">
              <LabelIcon
                renderIcon={() => (
                  <Money
                    style={{
                      height: 13,
                      width: 13,
                      fill: theme.textHintColor,
                      marginRight: 5,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
                title={`${intl.formatMessage({ id: "load.value" })} ($)`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  value={data?.loadValue}
                  onChange={(e) =>
                    onChange("loadValue", formatFloat(e.target.value))
                  }
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "load.value",
                  })} ($)`}
                />
              </InputGroup>
            </Col>

            <Col breakPoint={{ md: 3 }} className="mb-4">
              <LabelIcon
                renderIcon={() => (
                  <Money
                    style={{
                      height: 13,
                      width: 13,
                      fill: theme.textHintColor,
                      marginRight: 5,
                      marginTop: 2,
                      marginBottom: 2,
                    }}
                  />
                )}
                title={`${intl.formatMessage({ id: "freight.cost" })} ($)`}
              />
              <InputGroup fullWidth className="mt-1">
                <input
                  value={data?.freightCost}
                  onChange={(e) =>
                    onChange("freightCost", formatFloat(e.target.value))
                  }
                  type="text"
                  placeholder={`${intl.formatMessage({
                    id: "freight.cost",
                  })} ($)`}
                />
              </InputGroup>
            </Col>
          </ContainerRow>
        </CardBody>
        <CardFooter>
          <Button size="Small" onClick={onSave} disabled={!idTravel}>
            <FormattedMessage id="save" />
          </Button>
        </CardFooter>
      </Card>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default EditConsume;
