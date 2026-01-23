import { Card, CardBody, CardFooter, CardHeader, InputGroup } from "@paljs/ui";
import { Button } from "@paljs/ui/Button";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Fetch, LabelIcon, SelectMachineEnterprise, SelectSensorByEnterprise, SpinnerFull } from "../../../../components";
import { translate } from "../../../../components/language";
import SensorFunctionUtils from "../utils";

function SensorFunctionForm(props) {

  const [formData, setFormData] = React.useState();
  const [isEditing, setIsEditing] = React.useState();
  const [sensorFunctionObjectId, setSensorFunctionObjectId] = React.useState();
  const [idEnterprise, setIdEnterprise] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  const navigate = useNavigate();
  const id = new URL(window.location.href).searchParams.get("id");

  React.useEffect(() => {
    if (props.enterprises?.length) {
      setIdEnterprise(props.enterprises[0].id)
    }
  }, [props.enterprises]);

  React.useEffect(() => {
    if (id) {
      setIsEditing(true)
      setSensorFunctionObjectId(id)
      findSensorFunctionData()
    } else {
      setIsEditing(false)
    }

  }, [id])

  function findSensorFunctionData() {
    setIsLoading(true)
    Fetch.get(`/sensor-function/find/${id}`)
      .then((response) => {
        const newFormData = {
          ...response.data[0],
          algorithm: SensorFunctionUtils.replacePlaceholdersWithArray(response.data[0].algorithm, response.data[0].sensorsIn)
        }
        setFormData(newFormData)
      })
      .catch((e) => {
        toast.error(translate("error.get"))
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  function addSensorFunction(algorithm, sensorsIn) {

    let idMachines = []

    formData.machines.forEach((machine) => idMachines.push(machine.value));

    const payload = {
      idEnterprise,
      sensorsIn,                     // [ sensorA, sensorB, sensorC ]
      algorithm,                     // "{0} + ({1} - {2})"
      idMachines,
      description: formData.description,
      idSensor: formData.sensor?.value,
      sensor: formData.sensor,
      enabled: true
    }

    Fetch.post('/sensor-function', payload)
      .then(() => {
        toast.success(translate('success.save'))
        navigate(-1)
      })
      .catch((e) => {
        return toast.error(translate('error.save'));
      })
  };

  function onChange(prop, value) {
    setFormData({
      ...formData,
      [prop]: value,
    });
  };


  function onToggle() {
    if (!sensorFunctionObjectId) return;

    Fetch.post(`/sensor-function/toggle/${sensorFunctionObjectId}`)
      .then((_) => {
        toast.success(translate("success.save"));
        navigate(-1);
      })
      .catch((e) => {
        toast.error(translate("error.save"));
      });
  }

  function onSave() {
    const errors = SensorFunctionUtils.validateAlgorithm(formData.algorithm);

    let shouldExit = false;

    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error)
      });

      shouldExit = true;
    }

    if (shouldExit) return;

    const { algorithm, sensorsIn } = SensorFunctionUtils.extractSensorsFromAlgorithm(formData.algorithm);
    if (sensorsIn.length === 0) return toast.error(translate("error.sensor.function"))

    addSensorFunction(algorithm, sensorsIn)
  }

  function onUpdate() {
    const errors = SensorFunctionUtils.validateAlgorithm(formData.algorithm);

    let shouldExit = false;

    if (errors.length > 0) {
      errors.forEach(error => {
        toast.error(error)
      });

      shouldExit = true;
    }

    if (shouldExit) return;

    const { algorithm, sensorsIn } = SensorFunctionUtils.extractSensorsFromAlgorithm(formData.algorithm);
    if (sensorsIn.length === 0) return toast.error(translate("error.sensor.function"));

    const payload = {
      idEnterprise,
      sensorsIn,
      algorithm,
      machines: formData.machines,
      description: formData.description,
      idSensor: formData.sensor?.value,
      sensor: formData.sensor
    };

    Fetch.put(`/sensor-function/${sensorFunctionObjectId}`, payload)
      .then((_) => {
        toast.success(translate("success.update"));
        navigate(-1);
      })
      .catch((e) => {
        toast.error(translate("error.update"));
      });
  }

  function renderFooter() {
    let disabled = !formData?.sensor || !formData?.algorithm || !formData?.machines || !formData?.description;

    return (
      <Row between="xs" className="m-0">
        {(isEditing && !isLoading) ? (
          <Button
            appearance="ghost"
            size="Small"
            onClick={onToggle}
            status={formData.enabled ? "Danger" : "Warning"}
          >
            <FormattedMessage id={formData.enabled ? "to.disable" : "to.enable"} />
          </Button>
        ) : (<div />)}

        {isEditing ? (
          <Button
            size="Small"
            onClick={onUpdate}
            disabled={disabled}
          >
            <FormattedMessage id="save" />
          </Button>
        ) : (
          <Button
            size="Small"
            onClick={onSave}
            disabled={disabled}
          >
            <FormattedMessage id="save" />
          </Button>
        )}
      </Row>
    )
  }

  return (
    <Card>
      <CardHeader>
          <FormattedMessage id="sensor.function" />
      </CardHeader>
      <CardBody>
        <Row>
          <Col breakPoint={{ md: 12 }} className="mb-4" style={{ width: '100%' }}>
            <LabelIcon mandatory title={<FormattedMessage id="description" />} fullWidth />
            <InputGroup fullWidth>
              <input
                value={formData?.description}
                onChange={(e) => onChange("description", e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col breakPoint={{ md: 12 }} className="mb-4">
            <LabelIcon title={<FormattedMessage id="sensor.function.input.title" />} mandatory />
            <InputGroup fullWidth>
              <textarea rows={4}
                value={formData?.algorithm}
                onChange={(e) => onChange("algorithm", e.target.value)}
                style={{ fontFamily: 'monospace', marginTop: 4 }}
                placeholder={translate("sensor.function.algorithm.placeholder")}
              />
            </InputGroup>
          </Col>

          <Col breakPoint={{ md: 12 }} className="mb-4">
            <LabelIcon mandatory title={<FormattedMessage id="result.sensor" />} />
            <SelectSensorByEnterprise
              value={formData?.sensor}
              onChange={(value) => onChange("sensor", value)}
              idEnterprise={idEnterprise}
            />
          </Col>

          <Col breakPoint={{ md: 12 }}>
            <LabelIcon mandatory title={<FormattedMessage id="machines" />} />
            <SelectMachineEnterprise isMulti
              value={formData?.machines}
              idEnterprise={idEnterprise}
              onChange={(value) => onChange("machines", value)}
            />
          </Col>

        </Row>
      </CardBody>
      <CardFooter>
        {renderFooter()}
      </CardFooter>
      <SpinnerFull isLoading={isLoading} />
    </Card>
  );
}

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises
});

export default connect(mapStateToProps)(SensorFunctionForm);
