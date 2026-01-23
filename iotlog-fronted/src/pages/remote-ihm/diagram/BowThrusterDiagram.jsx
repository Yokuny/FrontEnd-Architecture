import { Button, Col, Container, EvaIcon, Row } from '@paljs/ui';
import React, { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { addEmptyBowThruster, fetchRemoteIHMData, getSensorsRemoteIHM, setIsEditingIHM, setRemoteIHMData } from '../../../actions/ihm.action';
import { floatToStringExtendDot } from '../../../components/Utils';
import { IHM_SENSOR_TYPE, TYPE_DIAGRAM } from '../../../constants';
import ModalChangeSensor from '../ModalChangeSensor';
import Engine from '../diagram-components/Engine';

const AddButtonWrapper = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  visibility: ${(props) => (props.isEditing ? 'visible' : 'hidden')};
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // position: absolute;
  background-color: #a6a6a6;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid black;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
  text-wrap: nowrap;
  width: fit-content;
  align-self: center;
  -webkit-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  -moz-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
  margin-left: 1rem;
  margin-right: 1rem;
`
const BowThrusterInfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #a6a6a6;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid black;
  -webkit-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  -moz-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  margin-left: 20px;
  margin-right: 20px;
  // ${({ reverse }) => reverse ? 'margin-right: 20px;' : 'margin-left: 20px;'}
`
const LabelNumber = styled.span`
  color: white;
  font-weight: bolder;
  font-size: 12px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`
const InfoItem = styled.div`
  // position: relative;
  height: 16px;
  padding: 2px 6px;
  display: flex;
  flex-direction: row;
  gap: 4px;
  font-size: 10px;
  font-weight: bold;
  line-height: 1;
  text-wrap: nowrap;
  width: fit-content;
  align-self: center;
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
`
const ButtonClear = styled(Button)`
  background-color: transparent;
  border: none;
  justify-content: center;
  height: 20px;
`
const InfoStyleStatus = styled.div`
  font-size: 16px;
  color: lawngreen;
  padding: 2px 30px;
  font-weight: bold;
  line-height: 1;
  text-wrap: nowrap;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed #a6a6a6;`}
`

const DeleteButtonWrapper = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
  visibility: ${(props) => (props.isEditing ? 'visible' : 'hidden')};
`;

const ThrusterWrapper = styled(Col)`
  padding: 2rem;
  position: relative;
  min-height: 420px;
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  border-style: ${(props) => (props.isEditing ? 'dashed' : 'none')};
  border-radius: 6px;
`;

const ThrustersWrapper = styled(Row)`
  padding: 2rem;
  display: flex;
  flex-direction: row;
  gap: 2rem;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const BowThrusterDiagram = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [sensorSelected, setSensorSelected] = useState(undefined)
  const [thrusterSelected, setThrusterSelected] = useState(undefined)
  const [data, setData] = useState(undefined)

  const [allows, setAllows] = useState({
    label: false,
    unit: false,
    sizeDecimal: false
  })

  const reload = React.useRef();

  useEffect(() => {
    setData(Array.isArray(props.data) ? props.data?.sort((a, b) => a.index - b.index) : [])
  }, [props.data])

  useEffect(() => {
    if (reload.current && props.isEditing)
      clearInterval(reload.current)
    else
      refreshIHM()
    return () => {
      clearInterval(reload.current)
    }
  }, [props.isEditing])

  useEffect(() => {
    if (reload.current)
      clearTimeout(reload.current)
    props.setIsEditing(false)
    refreshIHM()
    props.getSensorsIHM(props.filter.machine?.value)
  }, [props.filter])

  const refreshIHM = () => {
    reload.current = setInterval(function fetchData() {
      props.fetchIHMData();
      return fetchData
    }(), 60000);
  }

  const handleChangeInfo = (sensor, thruster) => {
    if (props.isEditing) {
      let selected = { ...sensor, sensor: { label: sensor.sensor?.sensor || sensor.idSensor, value: sensor.sensor?.sensorId || sensor.idSensor } }
      setThrusterSelected(thruster)

      if (sensor.typeSensor === IHM_SENSOR_TYPE.BOW_THRUSTER_INFO || sensor.typeSensor === IHM_SENSOR_TYPE.INFO) {
        setAllows({
          label: true,
          unit: true,
          sizeDecimal: true
        })
      } else if (sensor.typeSensor === IHM_SENSOR_TYPE.STATUS) {
        setAllows({
          label: true,
          unit: false,
          sizeDecimal: false
        })
        selected = { ...selected, label: thruster.label }
      } else {
        setAllows({
          label: false,
          unit: false,
          sizeDecimal: true
        })
      }

      setSensorSelected(selected)
      setShowModal(true);
    }
  }

  const handleOnConfirm = (sensor) => {

    let data = props.data.filter((el) => el.key === thrusterSelected.key)[0]
    switch (sensor.typeSensor) {
      case IHM_SENSOR_TYPE.STATUS:
        data = {
          ...data,
          label: sensor.label,
          sensors: data.sensors
            .map(el => (el.typeSensor === sensor.typeSensor
              ? Object.assign({}, el, { idSensor: sensor.sensor?.value })
              : el))
        }
        break;

      case IHM_SENSOR_TYPE.INFO:
        if (sensor.sensor?.value)
          data = {
            ...data,
            sensors: data.sensors
              .map(el => (el.index === sensor.index && el.typeSensor === sensor.typeSensor
                ? Object.assign({}, el, {
                  idSensor: sensor.sensor?.value,
                  label: sensor.label,
                  unit: sensor.unit,
                  sizeDecimals: sensor.sizeDecimals
                }) : el))
          }

        else
          data = {
            ...data,
            sensors: data.sensors.filter(el => el.index !== sensor.index)
          }
        break;

      case IHM_SENSOR_TYPE.BOW_THRUSTER_INFO:
        data = {
          ...data,
          sensors: data.sensors
            .map(el => (el.index === sensor.index && el.typeSensor === sensor.typeSensor
              ? Object.assign({}, el, {
                idSensor: sensor.sensor?.value,
                label: sensor.label,
                unit: sensor.unit,
                sizeDecimals: sensor.sizeDecimals
              }) : el))
        }
        break;

      default:
        break;
    }
    const dataToUpdate = props.data.map((el) => (el.key === data.key ? data : el))
    props.setRemoteIHMData(dataToUpdate)
  }

  const handleDeleteThruster = (key) => {
    const data = props.data.filter((el) => el.key !== key)
    props.setRemoteIHMData(data)
  }

  const handAddInfo = (thruster) => {
    const sensorInfoList = thruster.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.INFO)
    let lastIndex = 0
    if (sensorInfoList.length > 0)
      lastIndex = sensorInfoList.reduce((prev, current) => (prev && prev.index > current.index) ? prev : current).index
    let data = props.data.filter((el) => el.key === thruster.key)[0]
    data.sensors.push({
      typeSensor: IHM_SENSOR_TYPE.INFO,
      idSensor: 0,
      label: "vazio",
      unit: "vazio",
      index: lastIndex + 1
    })
    const dataToUpdate = props.data.map((el) => (el.key === thruster.key ? data : el))
    props.setRemoteIHMData(dataToUpdate)
  }

  const getThrusterStatus = (thruster) => {
    const statusSensor = thruster.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.STATUS)
    if (statusSensor.length > 0)
      return statusSensor[0].lastStateSensor?.value > 0;
    return false;
  }

  const getThrusterStatusBool = (thruster) => {
    const statusSensor = thruster.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.STATUS)

    if (statusSensor.length > 0)
      return statusSensor[0].lastStateSensor?.value > 0 ? (statusSensor[0].lastStateSensor?.value).toString() : '0';
    return '0';
  }

  return (
    <Container fluid>
      <ThrustersWrapper>

        <AddButtonWrapper isEditing={props.isEditing}>
          <Button
            size="Tiny"
            status="Info"
            className="flex-between ml-2 mb-4"
            onClick={props.addThruster}
          >
            <EvaIcon name="plus-outline" className='mr-1' />
            <FormattedMessage id="add.thruster" />
          </Button>
        </AddButtonWrapper>

        {Array.isArray(props.data) && props.data[0]?.typeIHM === TYPE_DIAGRAM.BOW_THRUSTER &&
          data?.map((t, i) => {
            return (
              <ThrusterWrapper
                breakPoint={{ md: 12, lg: 5 }}
                isEditing={props.isEditing}
                style={{ alignItems: (i % 2 !== 0) ? 'flex-start' : 'flex-end' }}
              >
                <DeleteButtonWrapper isEditing={props.isEditing}>
                  <Button size="Tiny" status="Danger" className="flex-between" onClick={() => handleDeleteThruster(t.key)}>
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </DeleteButtonWrapper>

                <Row>
                  <InfoStyleStatus
                    isEditing={props.isEditing}
                    onClick={() => handleChangeInfo(t.sensors.filter((s, indexSensor) => s.typeSensor === IHM_SENSOR_TYPE.STATUS)[0], t)}
                  >
                    {getThrusterStatus(t)
                      ? <span>{t.label} Running</span>
                      : <span style={{ color: 'red' }}>{t.label} Stopped</span>
                    }
                  </InfoStyleStatus>
                </Row>

                <Row>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: (i % 2 !== 0) ? 'row-reverse' : 'row',
                    }}
                  >
                    <InfoContainer reverse={i % 2 !== 0}>
                      <LabelNumber className='mb-1'>INFO</LabelNumber>

                      {t.sensors
                        .filter((s) => s.typeSensor === IHM_SENSOR_TYPE.INFO)
                        .sort((a, b) => a.index - b.index)
                        .map((x) =>
                          <InfoItem isEditing={props.isEditing} onClick={() => handleChangeInfo(x, t)}>
                            <span>{x.label}:</span>
                            <span>{floatToStringExtendDot(x.lastStateSensor?.value, x.sizeDecimals || 0)}</span>
                            <span>{x.unit}</span>
                          </InfoItem>
                        )
                      }

                      {props.isEditing &&
                        <Col>
                          <Row className="mt-2" around>
                            <ButtonClear
                              fullWidth
                              size="Tiny"
                              status="Control"
                              className="flex-between"
                              onClick={() => handAddInfo(t)}
                            >
                              <EvaIcon name="plus-outline" className='mr-1' />
                            </ButtonClear>
                          </Row>
                        </Col>
                      }

                    </InfoContainer>

                    <Engine
                      key={`i-engine-${i}`}
                      isEditing={false}
                      status={getThrusterStatusBool(t)}
                    />
                  </div>
                </Row>

                <Row>
                  <BowThrusterInfoContainer>
                    {t.sensors
                      .filter((s) => s.typeSensor === IHM_SENSOR_TYPE.BOW_THRUSTER_INFO)
                      .sort((a, b) => a.index - b.index)
                      .map((x) => (
                        <InfoItem
                          isEditing={props.isEditing}
                          onClick={() => handleChangeInfo(x, t)}
                        >
                          <span>{x.label}:</span>
                          <span>{floatToStringExtendDot(x.lastStateSensor?.value, x.sizeDecimals || 0)}</span>
                          <span>{x.unit}</span>
                        </InfoItem>
                      ))
                    }
                  </BowThrusterInfoContainer>
                </Row>

              </ThrusterWrapper>
            )
          })
        }

      </ThrustersWrapper>
      <ModalChangeSensor
        show={showModal}
        onClose={() => setShowModal(false)}
        onChange={(value) => handleOnConfirm(value)}
        itemSelected={sensorSelected}
        idMachine={props.filter.machine?.value}
        sensorList={props.sensorList}
        allowLabel={allows?.label}
        allowUnit={allows?.unit}
        allowSizeDecimals={allows?.sizeDecimal}
      />
    </Container>
  );
};

const mapStateToProps = (state) => ({
  data: state.remoteIHMState.dataIHM,
  sensorList: state.remoteIHMState.sensorList,
  isEditing: state.remoteIHMState.isEditing,
  filter: state.remoteIHMState.filterIHM,
});

const mapDispatchToProps = (dispatch) => ({
  fetchIHMData: () => {
    dispatch(fetchRemoteIHMData());
  },
  setIsEditing: (isEditing) => {
    dispatch(setIsEditingIHM(isEditing));
  },
  getSensorsIHM: () => {
    dispatch(getSensorsRemoteIHM());
  },
  setRemoteIHMData: (data) => {
    dispatch(setRemoteIHMData(data));
  },
  addThruster: () => {
    dispatch(addEmptyBowThruster());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(BowThrusterDiagram);
