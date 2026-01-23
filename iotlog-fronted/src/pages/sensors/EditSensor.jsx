import { Button, CardFooter, Col, EvaIcon, InputGroup, Row } from "@paljs/ui";
import React, { useState } from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { Fetch, LabelIcon, Modal, SelectTypeSensor } from "../../components";
import { VARIABLE_TYPE } from "../../constants";
import { toast } from "react-toastify";
import { SkeletonThemed } from "../../components/Skeleton";

export const EditSensor = ({
  sensor,
  idEnterprise,
  onAfterSave = () => { },
}) => {
  const intl = useIntl();
  const [openModal, setOpenModal] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [data, setData] = useState({
    id: sensor?.id || "",
    sensorId: sensor?.idSensor || "",
    sensor: sensor?.label || "",
    type: sensor?.type || null,
    unit: sensor?.unit || "",
  });

  React.useEffect(() => {
    if (sensor?.id) {
      setData({
        id: sensor?.id || "",
        sensorId: sensor?.idSensor || "",
        sensor: sensor?.label || "",
        type: sensor?.type || null,
        unit: sensor?.unit || "",
      });
    }

    return () => {
      setData({
        id: "",
        sensorId: "",
        sensor: "",
        type: null,
        unit: "",
      });
    }
  }, [sensor?.id]);


  const onChange = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  }

  const onSave = (e) => {
    const { sensorId, sensor, id } = data;

    if (!idEnterprise) {
      toast.warn(intl.formatMessage({ id: "enterprise.required" }));
      return;
    }

    if (!sensorId) {
      toast.warn(intl.formatMessage({ id: "sensor.id.required" }));
      return;
    }

    if (!id) {
      toast.warn(intl.formatMessage({ id: "sensor.id.required" }));
      return;
    }

    if (!sensor) {
      toast.warn(intl.formatMessage({ id: "sensor.name.required" }));
      return;
    }

    setIsloading(true);
    Fetch.post("/sensor", {
      id: id,
      sensorId,
      idEnterprise: idEnterprise,
      sensor,
      type: data?.type?.value,
      unit: data?.unit
    })
      .then((response) => {
        toast.success(intl.formatMessage({ id: "save.successfull" }));
        onAfterSave({
          id: data?.id,
          type: data?.type?.value,
          unit: data?.unit,
          label: data?.sensor,
        })
        setIsloading(false);
        setOpenModal(false);
      })
      .catch((e) => {
        setIsloading(false);
      });
  };

  return (
    <>
      <Button
        size="Tiny"
        status="Basic"
        appearance="ghost"
        style={{ padding: 2 }}
        onClick={() => setOpenModal(true)}
      >
        <EvaIcon name="edit-2-outline" />
      </Button>

      {openModal && (
        <Modal
          show={openModal}
          onClose={() => setOpenModal(false)}
          size="Medium"
          title={intl.formatMessage({ id: "sensor" })}
          renderFooter={
            () => (
              <CardFooter>
                <Row end="xs" className="m-0">
                  <Button
                    size="Small"
                    status="Primary"
                    className="mr-2"
                    disabled={isloading || !data?.sensor}
                    onClick={() => onSave()}
                  >
                    <FormattedMessage id="save" />
                  </Button>
                </Row>
              </CardFooter>
            )
          }
        >
          <Row className="m-0">
            {isloading
              ? (
                <>
                  <Col breakPoint={{ md: 12 }}>
                    <SkeletonThemed height={40} width="100%" />
                    <div className="mt-4"></div>
                    <SkeletonThemed height={60} width="100%" />
                  </Col>
                </>
              ) : (
                <>
                  <Col breakPoint={{ md: 12 }} className="mb-4">
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
                  <Col breakPoint={{ md: 6 }} className="mb-4">
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
                  {([VARIABLE_TYPE.INT, VARIABLE_TYPE.DECIMAL, VARIABLE_TYPE.DOUBLE].includes(data?.type?.value) ||
                    [VARIABLE_TYPE.INT, VARIABLE_TYPE.DECIMAL, VARIABLE_TYPE.DOUBLE].includes(data?.type)
                  ) && <Col breakPoint={{ md: 6 }} className="mb-4">
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
                    </Col>}
                </>)}
          </Row >
        </Modal >
      )}
    </>
  );
}
