import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Button, Col, EvaIcon, Row } from '@paljs/ui';
import { FormattedMessage } from 'react-intl';
import { addEmptyThruster, fetchRemoteIHMData, getSensorsRemoteIHM, setIsEditingIHM, setRemoteIHMData } from '../../../actions/ihm.action';
import { IHM_SENSOR_TYPE, TYPE_DIAGRAM } from '../../../constants';
import thrusterImg from '../../../assets/img/azimuth.png';
import ModalChangeSensor from '../ModalChangeSensor';
import { floatToStringExtendDot } from '../../../components/Utils';

const DiagramWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`

const RowAround = styled.div`
  display: flex;
  ${({ reverse }) => reverse ? `flex-direction: row-reverse;` : `flex-direction: row;`}
  width: 100%;
  justify-content: space-around;
`

const DiagramContainer = styled(Col)`
  display: grid;
  grid-template-columns: 200px 200px 65px;
  grid-template-rows: 40px 1fr 80px;
  grid-auto-flow: column;
  position: relative;
  height: fit-content;
  justify-content: center;
`
const InfoContainer = styled.div`
  grid-row: 2;
  grid-column: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-self: center;
  position: relative;
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
  ${({ isReverse }) => isReverse && `grid-column: 1;`}
`
const AzimuthInfoContainer = styled.div`
  grid-column: 1;
  height: fit-content;
  width: fit-content;
  margin: 0 auto;
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
  ${({ isReverse = false }) => isReverse && `grid-column: 2;`}
`
const LabelNumber = styled.span`
  color: white;
  font-weight: bolder;
  font-size: 12px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`
const InfoItem = styled.div`
  position: relative;
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
const ColDelete = styled(Col)`
  grid-column: 3;
  width: fit-content;
  height: fit-content;
  margin: auto;
`
const ButtonClear = styled(Button)`
  background-color: transparent;
  border: none;
  justify-content: center;
  height: 20px;
`
const InfoStyleStatus = styled.div`
  grid-column: 1;
  margin: auto;
  font-size: 16px;
  height: 28px;
  color: lawngreen;
  padding: 2px 30px;
  font-weight: bold;
  line-height: 1;
  text-wrap: nowrap;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed #a6a6a6; position: relative;`}
  ${({ isReverse }) => isReverse && `grid-column: 2;`}
`

const AzimuthDiagram = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [sensorSelected, setSensorSelected] = useState(undefined)
  const [thrusterSelected, setThrusterSelected] = useState(undefined)
  const [data, setData] = useState(undefined)

  const [allows, setAllows] = useState({
    label: false,
    unit: false,
    sizeDecimal: false,
    delete: false,
    valueType: false,
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

      if (sensor.typeSensor === IHM_SENSOR_TYPE.AZIMUTH_INFO || sensor.typeSensor === IHM_SENSOR_TYPE.INFO) {
        setAllows({
          label: true,
          unit: true,
          sizeDecimal: true,
          delete: sensor.typeSensor === IHM_SENSOR_TYPE.INFO,
          valueType: sensor.typeSensor === IHM_SENSOR_TYPE.INFO,
        })
      } else if (sensor.typeSensor === IHM_SENSOR_TYPE.STATUS) {
        setAllows({
          label: true,
          unit: false,
          sizeDecimal: false,
          delete: false,
          valueType: false,
        })
        selected = { ...selected, label: thruster.label }
      } else {
        setAllows({
          label: false,
          unit: false,
          sizeDecimal: true,
          delete: false,
          valueType: false,
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
          sensors: data.sensors.map(el => (el.typeSensor === sensor.typeSensor ? Object.assign({}, el, { idSensor: sensor.sensor?.value }) : el))
        }
        break;
      case IHM_SENSOR_TYPE.INFO:
        if (sensor.sensor?.value)
          data = {
            ...data,
            sensors: data.sensors.map(el => (el.index === sensor.index && el.typeSensor === sensor.typeSensor ? Object.assign({}, el, {
              idSensor: sensor.sensor?.value,
              label: sensor.label,
              unit: sensor.unit,
              sizeDecimals: sensor.sizeDecimals,
              valueType: sensor.valueType,
              valueZero: sensor.valueZero,
              valueOne: sensor.valueOne,
            }) : el))
          }
        else
          data = {
            ...data,
            sensors: data.sensors.filter(el => el.index !== sensor.index)
          }
        break;
      case IHM_SENSOR_TYPE.AZIMUTH_INFO:
        data = {
          ...data,
          sensors: data.sensors.map(el => (el.index === sensor.index && el.typeSensor === sensor.typeSensor ? Object.assign({}, el, {
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

  const getInfoValue = (info) => {
    if(info.valueType?.value === "DIGITAL") {
      return info.lastStateSensor?.value >= 1 ? info.valueOne : info.valueZero
    }
    return floatToStringExtendDot(info.lastStateSensor?.value, info.sizeDecimals || 0)
  }

  return (
    <DiagramWrapper>
      {Array.isArray(props.data) && props.data[0]?.typeIHM === TYPE_DIAGRAM.AZIMUTAL &&
        <>
          {props.isEditing &&
            <Col>
              <Row className="m-0" end>
                <Button size="Tiny" status="Info" className="flex-between ml-2" onClick={props.addThruster}>
                  <EvaIcon name="plus-outline" className='mr-1' />
                  <FormattedMessage id="add.thruster" />
                </Button>
              </Row>
            </Col>
          }
          {data?.map((t, i) => (<DiagramContainer
            isReverse={!!(i % 2 === 0)}
            breakPoint={{ md: 6 }} key={Math.random()}>

            {props.isEditing &&
              <ColDelete>
                <Button size="Tiny" status="Danger" className="flex-between" onClick={() => handleDeleteThruster(t.key)}>
                  <EvaIcon name="trash-2-outline" />
                </Button>
              </ColDelete>
            }
            <InfoStyleStatus isReverse={!!(i % 2 === 0)} isEditing={props.isEditing} onClick={() => handleChangeInfo(t.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.STATUS)[0], t)}>
              {getThrusterStatus(t) ?
                <span>{t.label} Running</span>
                :
                <span style={{ color: 'red' }}>{t.label} Stopped</span>
              }
            </InfoStyleStatus>
            <InfoContainer isReverse={!!(i % 2 === 0)}>
              <LabelNumber className='mb-1'>INFO</LabelNumber>
              {t.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.INFO).sort((a, b) => a.index - b.index).map((x) =>
                <InfoItem isEditing={props.isEditing} onClick={() => handleChangeInfo(x, t)}>
                  <span>{x.label}:</span>
                  <span>{getInfoValue(x)}</span>
                  <span>{x.valueType?.value === "DIGITAL" ? '' : x.unit}</span>
                </InfoItem>
              )}
              {props.isEditing &&
                <Col>
                  <Row className="mt-2" around>
                    <ButtonClear size="Tiny" status="Control" fullWidth className="flex-between" onClick={() => handAddInfo(t)}>
                      <EvaIcon name="plus-outline" className='mr-1' />
                    </ButtonClear>
                  </Row>
                </Col>
              }

            </InfoContainer>
            <img src={thrusterImg}
              className="mt-4"
              style={{
                width: '100%',
                height: '240px',
                objectFit: 'contain',
                margin: 'auto',
                gridColumn: i % 2 !== 0 ? 1 : 2
              }}
              alt={`thruster-${i + 1}`} />
            <AzimuthInfoContainer isReverse={!!(i % 2 === 0)}>
              {t.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.AZIMUTH_INFO).sort((a, b) => a.index - b.index).map((x) =>
              (
                <InfoItem isEditing={props.isEditing} onClick={() => handleChangeInfo(x, t)}>
                  <span>{x.label}:</span>
                  <span>{floatToStringExtendDot(x.lastStateSensor?.value, x.sizeDecimals || 0)}</span>
                  <span>{x.unit}</span>
                </InfoItem>
              ))}
            </AzimuthInfoContainer>
          </DiagramContainer>
          ))}
          {showModal &&
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
              allowDelete={allows?.delete}
              allowValueType={allows?.valueType}
            />}
        </>
      }
    </DiagramWrapper >
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
    dispatch(addEmptyThruster());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(AzimuthDiagram);
