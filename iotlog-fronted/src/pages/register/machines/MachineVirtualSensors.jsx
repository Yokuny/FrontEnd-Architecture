import { EvaIcon, InputGroup } from "@paljs/ui";
import { Button } from "@paljs/ui/Button";
import { Card, CardBody, CardFooter, CardHeader } from "@paljs/ui/Card";
import Col from "@paljs/ui/Col";
import Row from "@paljs/ui/Row";
import React from "react";
import { FormattedMessage, useIntl } from "react-intl";
import { toast } from "react-toastify";
import styled, { useTheme } from "styled-components";
import { Fetch, LabelIcon, Modal, TextSpan } from "../../../components";
import { translate } from "../../../components/language";

const moment = require('moment');

const InputWithValidation = styled(InputGroup)`
  border-radius: 4px;
  border: 1px solid ${(props) => (props.validSensorId === true ? 'green' : 'red')};
`;

function MachineVirtualSensors() {

  const theme = useTheme();
  const intl = useIntl();
  const params = new URL(window.location.href).searchParams;
  const idMachine = params.get("id");

  const [isLoading, setIsLoading] = React.useState(false);
  const [virtualSensors, setMachineSensors] = React.useState([]);
  const [data, setData] = React.useState();
  const [modalVisibility, setModalVisibility] = React.useState(false);
  const [selectedSensor, setSelectedSensor] = React.useState({});
  const [machine, setMachine] = React.useState({});
  const [validSensorId, setValidSensorId] = React.useState(undefined);
  const [sortByCreatedAt, setSortByCreatedAt] = React.useState('none'); // 'none', 'asc', 'desc'

  React.useLayoutEffect(() => {
    if (idMachine) {
      fetchMachine();
      fetchVirtualSensors();
    }
  }, [idMachine]);

  function fetchMachine() {
    setIsLoading(true);

    Fetch.get(`/machine?id=${idMachine}`)
      .then((response) => {
        setMachine(response.data[0])
        setIsLoading(false);
      })
      .catch((e) => {
        toast.error(translate('error.get'))
        setIsLoading(false);
      });

    setIsLoading(false);
  };

  function fetchVirtualSensors() {
    Fetch.get(`/virtual-sensors?idMachine=${idMachine}`)
      .then((response) => {
        setMachineSensors(response.data)
      })
      .catch((e) => {
      })
      .finally(() => { setIsLoading(false); })
  }

  function addVirtualSensor(algorithm, sensorsIn) {
    setIsLoading(true);

    let idEnterprise = machine.enterprise.id

    const payload = {
      idEnterprise,
      idMachine,
      sensorsIn,                     // [ sensorA, sensorB, sensorC ]
      algorithm,                     // "{0} + ({1} - {2})"
      sensorOut: data.sensorOut,     // "sensorX"
      sensorId: data.sensorId
    }

    Fetch.post('/virtual-sensors', payload)
      .then((response) => {

      })
      .catch((e) => {
        toast.error(translate('error.save'))
      })
      .finally(() => {
        fetchVirtualSensors();
        setIsLoading(false);
      })
  };

  function onChange(prop, value) {
    setData({
      ...data,
      [prop]: value,
    });
  };

  function onDelete() {
    toast.success("deleted")
    setModalVisibility(false)

    if (!selectedSensor) return;

    Fetch.delete(`/virtual-sensors/${selectedSensor.sensorId}`)
      .then((response) => {
        toast.success("Sensor deleted successfully");
        fetchVirtualSensors(); // Refresh the virtual sensors list after deletion
      })
      .catch((e) => {
        toast.error("Error deleting sensor");
      });
  }

  function onSave() {
    toast.dark("onSave")

    const { algorithm, sensorsIn } = extractSensorsFromAlgorithm(data.algorithm);

    if (sensorsIn.length === 0) return toast.error('sensorIn error')

    addVirtualSensor(algorithm, sensorsIn)
    setModalVisibility(false)
    // setData()
  }

  function onUpdate() {
    toast.dark("onUpdate")

    const { algorithm, sensorsIn } = extractSensorsFromAlgorithm(data.algorithm);

    if (sensorsIn.length === 0) return toast.error('sensorIn error')

    addVirtualSensor(algorithm, sensorsIn)
    setModalVisibility(false)
    // setData()
  }

  function replacePlaceholdersWithArray(string, array) {
    return string.replace(/\{(\d+)\}/g, (match, index) => {
      const arrayIndex = parseInt(index, 10);
      const replacement = array[arrayIndex] !== undefined ? `{${array[arrayIndex]}}` : match;
      return replacement;
    });
  }

  function extractSensorsFromAlgorithm(_algorithm) {
    const matches = _algorithm.match(/\{([^}]+)\}/g);

    if (!matches) {
      toast.error('Algorithm error');
      return { algorithm: _algorithm, sensorsIn: [] };
    }

    const sensorsIn = matches.map(match => match.slice(1, -1));
    const algorithm = _algorithm.replace(/\{([^}]+)\}/g, (match, p1) => `{${sensorsIn.indexOf(p1)}}`);

    return { algorithm, sensorsIn };
  }

  function validateSensorId(_id) {
    Fetch.post('/sensor/check', { sensorId: _id, idEnterprise: machine?.enterprise.id })
      .then((response) => {
        setValidSensorId(!response.data.exists)
        if (response.data.exists) toast.warn('Sensor ID already exists')
      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  function handleSortByCreatedAt() {
    let newSortByCreatedAt;

    if (sortByCreatedAt === 'none' || sortByCreatedAt === 'desc') {
      newSortByCreatedAt = 'asc';
    } else {
      newSortByCreatedAt = 'desc';
    }

    setSortByCreatedAt(newSortByCreatedAt);
    sortVirtualSensorsByCreatedAt(newSortByCreatedAt);
  };

  function sortVirtualSensorsByCreatedAt(sortOrder) {
    const sortedSensors = [...virtualSensors];

    sortedSensors.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === 'asc') {
        return dateA - dateB;
      } else if (sortOrder === 'desc') {
        return dateB - dateA;
      } else {
        return 0; // No sorting
      }
    });

    setMachineSensors(sortedSensors);
  };

  function renderModalFooter() {
    return (
      <Row between style={{ padding: '1rem 2rem' }}>
        {!!selectedSensor ? (
          <Button
            appearance="ghost"
            size="Small"
            onClick={onDelete}
            status="Danger"
          >
            <FormattedMessage id="delete" />
          </Button>
        ) : (
          <div></div>
        )}

        {selectedSensor ? (
          <Button size="Small" onClick={onSave} disabled={!selectedSensor.sensorOut || !selectedSensor.algorithm}>
            <FormattedMessage id="save" />
          </Button>
        ) : (

          <Button size="Small" onClick={onSave} disabled={!validSensorId || !data.sensorOut || !data.algorithm}>
            <FormattedMessage id="save" />
          </Button>
        )
        }
      </Row >
    )
  }

  return (
    <>
      <Card style={{ height: 'calc(100vh - 13.5rem' }}>
        <CardHeader>
          <Row between="xs">

            <TextSpan>{machine?.name}</TextSpan>

            <Button
              onClick={() => setModalVisibility(true)}
              style={{ marginRight: '1rem' }}
              className="flex-between mt-8"
              size="Small"
            >
              <EvaIcon name="plus-circle-outline" className="mr-1" />
              <FormattedMessage id="add" />
            </Button>
          </Row>
        </CardHeader>
        <CardBody>
          {virtualSensors.length > 0 ? (
            <>
              <Col breakPoint={{ xs: 12 }}>
                <Row style={{ marginBottom: '1rem' }}>
                  <Col breakPoint={{ md: 1 }} />
                  <Col breakPoint={{ md: 2 }}>
                    <TextSpan apparence="s2" hint>
                      ID
                    </TextSpan>
                  </Col>
                  <Col breakPoint={{ md: 2 }}>
                    <TextSpan apparence="s2" hint>
                      Name
                    </TextSpan>
                  </Col>
                  <Col breakPoint={{ md: 3 }}>
                    <TextSpan apparence="s2" hint>
                      Algorithm
                    </TextSpan>
                  </Col>
                  <Col breakPoint={{ md: 2 }}>
                    <TextSpan apparence="s2" hint>
                      Variables
                    </TextSpan>
                  </Col>
                  <Col breakPoint={{ md: 1 }}>
                    <div onClick={() => handleSortByCreatedAt()} style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', cursor: 'pointer', userSelect: 'none' }}>
                      <TextSpan apparence="s2" hint>
                        Created at
                        <EvaIcon
                          name={sortByCreatedAt === 'asc' ? 'arrow-upward-outline' : 'arrow-downward-outline'}
                          options={{ width: 12, height: 12 }}

                        />
                      </TextSpan>
                    </div>
                  </Col>
                  <Col breakPoint={{ md: 1 }} />
                </Row>
                {virtualSensors.map((_virtualSensor, index) => {

                  return (
                    <Row
                      middle="xs"
                      style={{
                        backgroundColor: index % 2 === 0 && theme.backgroundBasicColor2,
                        height: '3rem'
                      }}
                    >
                      <Col breakPoint={{ md: 1 }}>
                        <EvaIcon
                          name={"flash"}
                          options={{
                            fill: theme.colorSuccess500,
                            width: 25,
                            height: 25,
                            animation: { type: "pulse", infinite: false, hover: true },
                          }}
                        />
                      </Col>
                      <Col breakPoint={{ md: 2 }}>
                        <TextSpan>{_virtualSensor.sensorId || _virtualSensor.sensorOut}</TextSpan>
                      </Col>
                      <Col breakPoint={{ md: 2 }}>
                        <TextSpan>{_virtualSensor.sensorOut}</TextSpan>
                      </Col>
                      <Col breakPoint={{ md: 3 }}>
                        <TextSpan style={{ fontFamily: 'monospace' }}>{replacePlaceholdersWithArray(_virtualSensor.algorithm, _virtualSensor.sensorsIn)}</TextSpan>
                      </Col>
                      <Col breakPoint={{ md: 2 }}>
                        <Row>
                          {_virtualSensor.sensorsIn.map((_sensorIn, index) => (
                            <div key={index}
                              // onClick={} // TO DO >> Redirect user to the sensor-add screen
                            >
                              {_sensorIn}
                              {index < _virtualSensor.sensorsIn.length - 1 && ',\u00A0'}
                            </div>
                          ))}
                        </Row>
                      </Col>
                      <Col breakPoint={{ md: 1 }}>
                        <Row>{moment(_virtualSensor.createdAt).format('DD/MM/YYYY')}</Row>
                      </Col>
                      <Col breakPoint={{ md: 1 }}>
                        <div
                          style={{ display: 'flex', justifyContent: 'flex-end' }}
                        >
                          <Button
                            size="Tiny"
                            appearance="ghost"
                            onClick={() => {
                              setSelectedSensor(_virtualSensor)
                              setModalVisibility(true)
                            }}
                          >
                            <EvaIcon name="edit-2-outline" />
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  )
                })}
              </Col>
            </>
          ) : (
            <div>
              Empty
            </div>
          )}
        </CardBody>
        <CardFooter>
        </CardFooter>
      </Card >

      <Modal
        show={modalVisibility}
        onClose={() => {
          // setData()
          setSelectedSensor()
          setModalVisibility(false)
        }}
        title="virtual.sensors"
        renderFooter={renderModalFooter}
      >
        <Row>
          <Col breakPoint={{ md: 6 }} className="mb-4">
            <LabelIcon mandatory title={<FormattedMessage id="sensor.id.placeholder" />} />
            <InputWithValidation fullWidth className="mt-1" validSensorId={!!selectedSensor || validSensorId}>
              <input
                type="text"
                placeholder={intl.formatMessage({ id: "sensor.id.placeholder", })}
                onChange={(e) => onChange("sensorId", e.target.value)}
                onBlur={(e) => validateSensorId(e.target.value)}
                value={selectedSensor?.sensorId || data?.sensorId}
                maxLength={150}
                disabled={!!selectedSensor}
              />
            </InputWithValidation>
          </Col>

          <Col breakPoint={{ md: 6 }} className="mb-4">
            <LabelIcon mandatory title={<FormattedMessage id="sensor.name.placeholder" />} />
            <InputGroup fullWidth className="mt-1">
              <input
                type="text"
                placeholder={intl.formatMessage({ id: "sensor.name.placeholder", })}
                onChange={(e) => onChange("sensorOut", e.target.value)}
                value={selectedSensor?.sensorOut || data?.sensorOut}
                maxLength={150}
              />
            </InputGroup>
          </Col>

          <Col breakPoint={{ md: 12 }}>
            <LabelIcon title={<FormattedMessage id="virtual.algorithm.input.title" />} mandatory />
            <InputGroup fullWidth>
              <textarea
                rows={4}
                style={{ fontFamily: 'monospace', marginTop: 4 }}
                value={selectedSensor?.algorithm ? replacePlaceholdersWithArray(selectedSensor.algorithm, selectedSensor.sensorsIn) : data?.algorithm}
                placeholder={intl.formatMessage({ id: "virtual.algorithm.placeholder" })}
                onChange={(e) => onChange("algorithm", e.target.value)}
              />
            </InputGroup>
          </Col>

          <Col breakPoint={{ md: 12 }} className="mt-2">
            <TextSpan hint>
              <FormattedMessage id="virtual.sensor.algorithm.hint" />
            </TextSpan>
          </Col>

        </Row>
      </Modal>
    </>
  );
}
export default MachineVirtualSensors;
