import React from "react";
import { toast } from "react-toastify";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import { Card, CardBody, CardHeader, CardFooter } from "@paljs/ui/Card";
import { FormattedMessage, useIntl } from "react-intl";
import { Button } from "@paljs/ui/Button";
import styled from "styled-components";
import { InputGroup } from "@paljs/ui";
import { useNavigate } from "react-router-dom";
import { verifyIDInvalid } from "../../../components/Utils";
import {
  DeleteConfirmation,
  Fetch,
  LabelIcon,
  SelectEnterprise,
  SpinnerFull,
  InputDecimal,
  SelectTypeSensor,
} from "../../../components";
import { OPTIONS_TYPE } from "../../../components/Select/SelectTypeSensor";

const ContainerRow = styled(Row)`
  input {
    line-height: 0.5rem;
  }
`;


const SensorAdd = (props) => {
  const intl = useIntl();
  const navigate = useNavigate();
  const [data, setData] = React.useState({
    sensorId: "",
    sensor: "",
    description: "",
  });
  const [enterprise, setEnterprise] = React.useState();
  const [isLoading, setIsloading] = React.useState(false);
  const [isEdit, setIsEdit] = React.useState(false);

  const id = new URL(window.location.href).searchParams.get("id");

  React.useEffect(() => {
    verifyingEdit();
  }, []);

  const verifyingEdit = () => {
    if (!!id) {
      setIsloading(true);
      Fetch.get(`/sensor/find?id=${id}`)
        .then((response) => {
          if (response.data) {
            setData({
              ...response.data,
              type: findOptionsTypeByVariable(response.data.type),
            });
            setEnterprise({
              value: response.data?.enterprise?.id,
              label: response.data?.enterprise?.name,
            });
            setIsEdit(true);
            setIsloading(false);
          } else {
            navigate(`/sensor-add`);
            setIsloading(false);
          }
        })
        .catch((e) => {
          setIsloading(false);
        });
    }
  };

  const onSave = (e) => {
    e.preventDefault();

    const { sensorId, sensor, id } = data;

    if (!enterprise?.value) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!sensorId) {
      toast.warn(intl.formatMessage({ id: "sensor.id.required" }));
      return;
    }

    if (verifyIDInvalid(sensorId)) {
      toast.warn(intl.formatMessage({ id: "sensor.id.invalid" }));
      return;
    }

    if (!sensor) {
      toast.warn(intl.formatMessage({ id: "sensor.name.required" }));
      return;
    }

    setIsloading(true);
    Fetch.post("/sensor", {
      id,
      sensorId,
      idEnterprise: enterprise?.value,
      sensor,
      description: data?.description,
      type: data?.type?.value,
      unit: data?.unit,
      valueMin: data?.valueMin,
      valueMax: data?.valueMax,
    })
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        setIsloading(false);
        setIsEdit(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsloading(false);
      });
  };

  const onChange = (prop, value) => {
    setData({
      ...data,
      [prop]: value,
    });
  };

  const onDelete = () => {
    setIsloading(true);
    Fetch.delete(`/sensor?id=${id}`)
      .then((r) => {
        toast.success(intl.formatMessage({ id: "delete.successfull" }));
        setIsloading(false);
        navigate(-1);
      })
      .catch((e) => {
        setIsloading(false);
      });
  };

  function findOptionsTypeByVariable(value) {
    return OPTIONS_TYPE.find((i) => i.value === value);
  }

  return (
    <>
      <ContainerRow>
        <Col breakPoint={{ xs: 12, md: 12 }}>
          <Card>
            <CardHeader>
              <FormattedMessage id={isEdit ? "sensor.edit" : "sensor.new"} />
            </CardHeader>
            <CardBody>
              <Row>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon mandatory title={<FormattedMessage id="enterprise" />} />
                  <div className="mt-1"></div>
                  <SelectEnterprise
                    onChange={(value) => setEnterprise(value)}
                    value={enterprise}
                    oneBlocked
                  />
                </Col>
                <Col breakPoint={{ md: 4 }} className="mb-4">
                  <LabelIcon mandatory title={<FormattedMessage id="sensor.id.placeholder" />} />
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      disabled={isEdit}
                      placeholder={intl.formatMessage({
                        id: "sensor.id.placeholder",
                      })}
                      onChange={(text) =>
                        onChange("sensorId", text.target.value)
                      }
                      value={data?.sensorId}
                      maxLength={150}
                    />
                  </InputGroup>
                </Col>

                <Col breakPoint={{ md: 8 }} className="mb-4">
                  <LabelIcon mandatory title={<FormattedMessage id="sensor.name.placeholder" />} />
                  <InputGroup fullWidth className="mt-1">
                    <input
                      type="text"
                      placeholder={intl.formatMessage({
                        id: "sensor.name.placeholder",
                      })}
                      onChange={(text) => onChange("sensor", text.target.value)}
                      value={data?.sensor}
                      maxLength={150}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 12 }} className="mb-4">
                  <LabelIcon title={<FormattedMessage id="description" />} />
                  <InputGroup fullWidth className="mt-1">
                    <textarea
                      placeholder={intl.formatMessage({
                        id: "description",
                      })}
                      onChange={(text) => onChange("description", text.target.value)}
                      value={data?.description}
                      maxLength={500}
                      rows={3}
                    />
                  </InputGroup>
                </Col>
                <Col breakPoint={{ md: 4 }} className="mb-4">
                  <LabelIcon title={<FormattedMessage id="variable.type" />} />
                  <div className="mt-1"></div>
                  <SelectTypeSensor
                    onChange={(value) => onChange("type", value)}
                    value={data?.type}
                    menuPosition="fixed"
                    isClearable
                    placeholder={intl.formatMessage({
                      id: "variable.type",
                    })}
                  />
                </Col>

                {["int", "decimal"].includes(data?.type?.value) && (
                  <>
                    <Col breakPoint={{ md: 3 }} className="mb-4">
                      <LabelIcon title={<FormattedMessage id="sensor.signal.value.min" />} />
                      <InputGroup fullWidth className="mt-1">
                        <InputDecimal
                          placeholder={intl.formatMessage({
                            id: "sensor.signal.value.min",
                          })}
                          value={data?.valueMin}
                          onChange={(e) => onChange("valueMin", e)}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 3 }} className="mb-4">
                      <LabelIcon title={<FormattedMessage id="sensor.signal.value.max" />} />
                      <InputGroup fullWidth className="mt-1">
                        <InputDecimal
                          placeholder={intl.formatMessage({
                            id: "sensor.signal.value.max",
                          })}
                          value={data?.valueMax}
                          onChange={(e) => onChange("valueMax", e)}
                        />
                      </InputGroup>
                    </Col>
                    <Col breakPoint={{ md: 2 }}>
                      <LabelIcon title={<FormattedMessage id="unit" />} />
                      <InputGroup fullWidth className="mt-1">
                        <input
                          type="text"
                          placeholder={intl.formatMessage({
                            id: "unit",
                          })}
                          value={data?.unit}
                          onChange={(e) => onChange("unit", e.target.value)}
                        />
                      </InputGroup>
                    </Col>
                  </>
                )}
              </Row>
            </CardBody>
            <CardFooter>
              <Row between className="pr-2 pl-2">
                {!!id ? (
                  <DeleteConfirmation
                    message={intl.formatMessage({
                      id: "delete.message.default",
                    })}
                    onConfirmation={onDelete}
                  />
                ) : (
                  <div></div>
                )}

                <Button size="Small" onClick={onSave}>
                  <FormattedMessage id="save" />
                </Button>
              </Row>
            </CardFooter>
          </Card>
        </Col>
      </ContainerRow>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

export default SensorAdd;
