import React from "react";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import { InputGroup } from "@paljs/ui/Input";
import styled from "styled-components";
import { Select } from "@paljs/ui";
import { TYPE_PLATFORM, OPERATORS, MODELS } from "./Constants";
import { verifyIDInvalid } from "../../../components/Utils";
import {
  Fetch,
  TextSpan,
  SelectEnterprise,
  SpinnerFull,
  LabelIcon,
} from "../../../components";
import { InputDecimal } from "../../../components/Inputs/InputDecimal";
import { DmsCoordinates } from "../../fleet/Map/Coordinates/DmsCoordinates";
import { useNavigate } from "react-router-dom";

const optionsOperations = [
  {
    value: OPERATORS.PETROBRAS,
    label: OPERATORS.PETROBRAS,
  },
  {
    value: OPERATORS.TOTAL_EP_DO_BRASIL,
    label: OPERATORS.TOTAL_EP_DO_BRASIL,
  },
  {
    value: OPERATORS.SHELL_BRASIL,
    label: OPERATORS.SHELL_BRASIL,
  },
  {
    value: OPERATORS.CHEVRON_FRADE,
    label: OPERATORS.CHEVRON_FRADE,
  },
  {
    value: OPERATORS.DOMMO_ENERGIA,
    label: OPERATORS.DOMMO_ENERGIA,
  },
  {
    value: OPERATORS.EQUINOR_BRASIL,
    label: OPERATORS.EQUINOR_BRASIL,
  },
  {
    value: OPERATORS.QUEIROZ_GALVAO,
    label: OPERATORS.QUEIROZ_GALVAO,
  },
  {
    value: OPERATORS.PERENCO_BRASIL,
    label: OPERATORS.PERENCO_BRASIL,
  },
  {
    value: OPERATORS.PETRO_RIO_OG,
    label: OPERATORS.PETRO_RIO_OG,
  },
];

const optionsModelsPlatform = [
  {
    value: MODELS.FPSO,
    label: MODELS.FPSO,
  },
  {
    value: MODELS.JACK_UP,
    label: MODELS.JACK_UP,
  },
  {
    value: MODELS.SEMI_SUBMERSIVEL,
    label: MODELS.SEMI_SUBMERSIVEL,
  },
  {
    value: MODELS.FPU,
    label: MODELS.FPU,
  },
  {
    value: MODELS.TLWP,
    label: MODELS.TLWP,
  },
  {
    value: MODELS.DRILLING,
    label: MODELS.DRILLING,
  },
  {
    value: MODELS.FSO,
    label: MODELS.FSO,
  },
];

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;

const RowCenter = styled.div`
  display: flex;
  flex-direction: row;
`;

const AddPlatform = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [isEdit, setIsEdit] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [data, setData] = React.useState({
    name: "",
    enterprise: "",
    code: "",
  });

  const id = new URL(window.location.href).searchParams.get("id");

  React.useEffect(() => {
    verifyEdit();
  }, []);

  const verifyEdit = () => {
    if (!!id) {
      getEditEntity(id);
    }
  };

  const getEditEntity = (id) => {
    setIsLoading(true);
    Fetch.get(`/platform/find?id=${id}`)
      .then((response) => {
        if (response.data) {
          setData({
            ...response.data,
            type: findOptionsTypeByValue(response.data.type),
            model: findOptionsModelsPlataformByValue(response.data.modelType),
            operator: findOptionsOperationsByValue(response.data.operator),
            latitude: response.data.location?.coordinates?.length
              ? response.data.location?.coordinates[0]
              : undefined,
            longitude:
              response.data.location?.coordinates?.length == 2
                ? response.data.location?.coordinates[1]
                : undefined,
            enterprise: {
              value: response.data.enterprise.id,
              label: `${response.data.enterprise.name} - ${response.data.enterprise.city} ${response.data.enterprise.state}`,
            },
          });

          setIsEdit(true);
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const onSave = async (id) => {
    if (!data?.enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!data?.name) {
      toast.warn(intl.formatMessage({ id: "name.required" }));
      return;
    }
    if (!data?.code) {
      toast.warn(intl.formatMessage({ id: "code.required" }));
      return;
    }
    if (verifyIDInvalid(data?.code)) {
      toast.warn(intl.formatMessage({ id: "code.id.invalid" }));
      return;
    }

    setIsLoading(true);
    const dataToSave = {
      idEnterprise: data?.enterprise?.value,
      id,
      name: data?.name,
      code: data?.code,
      acronym: data?.acronym,
      basin: data?.basin,
      type: data?.type?.value,
      modelType: data?.model?.value,
      operator: data?.operator?.value,
      imo: data?.imo,
      mmsi: data?.mmsi,
      location: {
        type: "Point",
        coordinates: [data?.latitude, data?.longitude],
      },
      radius:
        data?.radius && !isNaN(parseInt(data?.radius))
          ? parseInt(data?.radius)
          : null,
      ais: {
        distanceToBow: data?.ais?.distanceToBow,
        distanceToStern: data?.ais?.distanceToStern,
        distanceToStarboard: data?.ais?.distanceToStarboard,
        distanceToPortSide: data?.ais?.distanceToPortSide,
      }
    };

    if (!isEdit) {
      try {
        await Fetch.post("/platform", dataToSave);
      } catch (e) {
        setIsLoading(false);
        return;
      }
    } else {
      try {
        await Fetch.put(`/platform/update?id=${id}`, dataToSave);
      } catch (e) {
        setIsLoading(false);
        return;
      }
    }

    toast.success(intl.formatMessage({ id: "save.successfull" }));
    setIsLoading(false);
    navigate(-1);
  };

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const optionsType = [
    {
      value: TYPE_PLATFORM.FIXED,
      label: intl.formatMessage({ id: TYPE_PLATFORM.FIXED }),
    },
    {
      value: TYPE_PLATFORM.MOVE,
      label: intl.formatMessage({ id: TYPE_PLATFORM.MOVE }),
    },
  ];

  function findOptionsTypeByValue(value) {
    return optionsType.find((i) => i.value === value);
  }

  function findOptionsModelsPlataformByValue(value) {
    return optionsModelsPlatform.filter((i) => i.value === value);
  }

  function findOptionsOperationsByValue(value) {
    return optionsOperations.filter((i) => i.value === value);
  }

  const getDmsData = (lat, lon) => {
    try {
      return lat !== undefined && lon !== undefined
        ? new DmsCoordinates(lat, lon)
        : undefined;
    } catch {
      return undefined;
    }
  };

  const onChangeAIS = (prop, value) => {
    onChange("ais", {
      ...(data?.ais || {}),
      [prop]: value,
    });
  };

  const itemDms = getDmsData(data?.latitude, data?.longitude);

  return (
    <>
      <Row>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage
                id={isEdit ? "edit.platform" : "new.platform"}
              />
            </CardHeader>
            <CardBody>
              <ContainerRow>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="enterprise" />
                  </TextSpan>
                  <SelectEnterprise
                    onChange={(value) => onChange("enterprise", value)}
                    value={data?.enterprise}
                    oneBlocked
                  />
                </Col>
                <Col breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="name" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "name",
                      })}
                      onChange={(text) => onChange("name", text.target.value)}
                      value={data?.name}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="acronym" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "acronym",
                      })}
                      onChange={(text) =>
                        onChange("acronym", text.target.value)
                      }
                      value={data?.acronym}
                      maxLength={50}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="code" /> (IoTLog)
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "code",
                      })}
                      onChange={(text) => onChange("code", text.target.value)}
                      value={data?.code}
                      disabled={isEdit}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="basin" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "basin",
                      })}
                      onChange={(text) => onChange("basin", text.target.value)}
                      value={data?.basin}
                      maxLength={50}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="type" />
                  </TextSpan>
                  <div className="mt-1"></div>
                  <Select
                    onChange={(value) => onChange("type", value)}
                    value={data?.type}
                    options={optionsType}
                    placeholder={intl.formatMessage({
                      id: "type",
                    })}
                  />
                </Col>
                <Col breakPoint={{ md: 3 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="model" />
                  </TextSpan>
                  <div className="mt-1"></div>
                  <Select
                    onChange={(value) => onChange("model", value)}
                    value={data?.model}
                    options={optionsModelsPlatform}
                    placeholder={intl.formatMessage({
                      id: "model",
                    })}
                  />
                </Col>

                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="operator" />
                  </TextSpan>
                  <div className="mt-1"></div>
                  <Select
                    onChange={(value) => onChange("operator", value)}
                    value={data?.operator}
                    options={optionsOperations}
                    placeholder={intl.formatMessage({
                      id: "operator",
                    })}
                  />
                </Col>
                <Col breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="imo" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "imo",
                      })}
                      onChange={(text) => onChange("imo", text.target.value)}
                      value={data?.imo}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 6 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="mmsi" />
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "mmsi",
                      })}
                      onChange={(text) => onChange("mmsi", text.target.value)}
                      value={data?.mmsi}
                    />
                  </InputGroup>
                </Col>

                <Col breakPoint={{ md: 2 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="radius" /> (
                    <FormattedMessage id="meter.unity" />)
                  </TextSpan>
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="number"
                      min={0}
                      placeholder={intl.formatMessage({
                        id: "radius",
                      })}
                      onChange={(text) => onChange("radius", text.target.value)}
                      value={data?.radius}
                    />
                  </InputGroup>
                </Col>

                <Col breakPoint={{ md: 5 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="latitude" />
                  </TextSpan>
                  <RowCenter className="mt-1">
                    <InputGroup fullWidth>
                      <InputDecimal
                        type="text"
                        placeholder={intl.formatMessage({
                          id: "latitude",
                        })}
                        onChange={(e) => onChange("latitude", e)}
                        value={data?.latitude}
                      />
                    </InputGroup>
                    <InputGroup className="ml-2" fullWidth>
                      <input
                        type="text"
                        disabled
                        value={itemDms?.getLatitude()?.toString()}
                      />
                    </InputGroup>
                  </RowCenter>
                </Col>
                <Col breakPoint={{ md: 5 }} className="mb-4">
                  <TextSpan apparence="p2" hint>
                    <FormattedMessage id="longitude" />
                  </TextSpan>
                  <RowCenter className="mt-1">
                    <InputGroup fullWidth>
                      <InputDecimal
                        placeholder={intl.formatMessage({
                          id: "longitude",
                        })}
                        onChange={(e) => onChange("longitude", e)}
                        value={data?.longitude}
                      />
                    </InputGroup>
                    <InputGroup className="ml-2" fullWidth>
                      <input
                        type="text"
                        disabled
                        value={itemDms?.getLongitude()?.toString()}
                      />
                    </InputGroup>
                  </RowCenter>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon
                    title={`AIS ${intl.formatMessage({ id: "dimensions" })}`}
                  />
                  <Row className="m-0">
                    <Col breakPoint={{ md: 3 }}>
                      <LabelIcon
                        title={`${intl.formatMessage({
                          id: "distance.to.bow",
                        })} (m)`}
                      />
                      <InputGroup fullWidth className="mt-1">
                        <input
                          type="number"
                          onChange={(text) =>
                            onChangeAIS(
                              "distanceToBow",
                              parseInt(text.target.value)
                            )
                          }
                          value={data?.ais?.distanceToBow}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }}>
                      <LabelIcon
                        title={`${intl.formatMessage({
                          id: "distance.to.stern",
                        })} (m)`}
                      />
                      <InputGroup fullWidth className="mt-1">
                        <input
                          type="number"
                          onChange={(text) =>
                            onChangeAIS(
                              "distanceToStern",
                              parseInt(text.target.value)
                            )
                          }
                          value={data?.ais?.distanceToStern}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }}>
                      <LabelIcon
                        title={`${intl.formatMessage({
                          id: "distance.to.starboard",
                        })} (m)`}
                      />
                      <InputGroup fullWidth className="mt-1">
                        <input
                          type="number"
                          onChange={(text) =>
                            onChangeAIS(
                              "distanceToStarboard",
                              parseInt(text.target.value)
                            )
                          }
                          value={data?.ais?.distanceToStarboard}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }}>
                      <LabelIcon
                        title={`${intl.formatMessage({
                          id: "distance.to.port",
                        })} (m)`}
                      />
                      <InputGroup fullWidth className="mt-1">
                        <input
                          type="number"
                          onChange={(text) =>
                            onChangeAIS(
                              "distanceToPortSide",
                              parseInt(text.target.value)
                            )
                          }
                          value={data?.ais?.distanceToPortSide}
                        />
                      </InputGroup>
                    </Col>
                  </Row>
                </Col>
              </ContainerRow>
            </CardBody>
            <CardFooter>
              <Row end>
                <Button size="Small" onClick={() => onSave(id)}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </Row>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default AddPlatform;
