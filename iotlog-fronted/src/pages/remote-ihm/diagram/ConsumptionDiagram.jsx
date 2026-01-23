import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { fetchRemoteIHMData, getSensorsRemoteIHM, setIsEditingIHM, setRemoteIHMData } from '../../../actions/ihm.action';
import { Button, Col, EvaIcon, Progress, Row } from '@paljs/ui';
import ModalChangeSensor from '../ModalChangeSensor';
import { IHM_SENSOR_TYPE } from '../../../constants';
import { isInt } from '../../../components/Utils';

const DiagramWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`
const DiagramContainer = styled(Col)`
  width: 410px;
  display: flex;
  align-items: center;
  flex-direction: row;
  position: relative;
  height: fit-content;
  justify-content: space-around;
`
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  position: relative;
  background-color: #a6a6a6;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid black;
  text-wrap: nowrap;
  width: fit-content;
  align-self: center;
  -webkit-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  -moz-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
`
const GaugeContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 30px;
  align-items: center;
  position: relative;
  background-color: #a6a6a6;
  padding: 16px;
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
`
const LabelInfo = styled.span`
  color: white;
  font-weight: bolder;
  font-size: 24px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`
const InfoItem = styled.div`
  position: relative;
  height: fit-content;
  padding: 2px 6px;
  display: flex;
  flex-direction: row;
  gap: 5px;
  font-size: 22px;
  font-weight: bold;
  line-height: 1;
  text-wrap: nowrap;
  width: fit-content;
  align-self: center;
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
`
const GaugeItem = styled.div`
  position: relative;
  height: fit-content;
  padding: 2px 6px;
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 22px;
  font-weight: bold;
  line-height: 1.5;
  text-wrap: nowrap;
  width: fit-content;
  align-items: center;
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
`

const ButtonClear = styled(Button)`
  background-color: transparent;
  border: none;
  justify-content: center;
  height: 20px;
`
const CustomProgress = styled(Progress)`
  height: 200px;
  .progress-container {
    transform: rotate(-90deg);
    height: 40px;
    width: 200px;
    position: relative;
    top: 80px;
  }
`

const ConsumptionDiagram = (props) => {
  const [data, setData] = useState(undefined)
  const [showModal, setShowModal] = useState(false)
  const [sensorSelected, setSensorSelected] = useState(undefined)
  const [allowMax, setAllowMax] = useState(false)

  const reload = React.useRef();

  useEffect(() => {
    setData(Array.isArray(props.data) ? props.data[0] : {})
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
    }(), 6000000);
  }

  const handleOnConfirm = (sensor) => {
    let dataToUpdate = data
    switch (sensor.typeSensor) {
      case IHM_SENSOR_TYPE.INFO:
        if (sensor.sensor?.value)
          dataToUpdate = {
            ...data,
            sensors: data.sensors.map(el => (el.index === sensor.index && el.typeSensor === sensor.typeSensor ? Object.assign({}, el, {
              idSensor: sensor.sensor?.value,
              label: sensor.label,
              unit: sensor.unit,
            }) : el))
          }
        else
          dataToUpdate = {
            ...data,
            sensors: data.sensors.filter(el => el.index !== sensor.index)
          }
        break;
      case IHM_SENSOR_TYPE.GAUGE:
        dataToUpdate = {
          ...data,
          sensors: data.sensors.map(el => (el.index === sensor.index && el.typeSensor === sensor.typeSensor ? Object.assign({}, el, {
            idSensor: sensor.sensor?.value,
            label: sensor.label,
            unit: sensor.unit,
            max: sensor.max,
          }) : el))
        }
        break;
      default:
        break;
    }
    props.setRemoteIHMData([dataToUpdate])
  }

  const handleChangeInfo = (sensor) => {
    if (props.isEditing) {
      let selected = { ...sensor, sensor: { label: sensor.sensor?.sensor || sensor.idSensor, value: sensor.sensor?.sensorId || sensor.idSensor } }
      if (sensor.typeSensor === IHM_SENSOR_TYPE.GAUGE)
        setAllowMax(true)
      else
        setAllowMax(false)
      setSensorSelected(selected)
      setShowModal(true);
    }
  }

  const handAddInfo = () => {
    const dataToUpdate = data;
    const sensorInfoList = dataToUpdate.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.INFO)
    let lastIndex = 0
    if (sensorInfoList.length > 0)
      lastIndex = sensorInfoList.reduce((prev, current) => (prev && prev.index > current.index) ? prev : current).index
    dataToUpdate.sensors.push({
      typeSensor: IHM_SENSOR_TYPE.INFO,
      idSensor: 0,
      label: "vazio",
      unit: "vazio",
      index: lastIndex + 1
    })
    props.setRemoteIHMData([dataToUpdate])
  }

  const getPercentage = (sensor) => {
    const percent = (100 * (sensor.lastStateSensor?.value || 0)) / (sensor.max || 1)
    return isInt(percent) ? percent : percent.toFixed(2)
  }

  return (
    <DiagramWrapper>
      {!!props.data && (
        <DiagramContainer breakPoint={{ md: 12 }} key={Math.random()}>
          {data?.sensors?.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.GAUGE).length > 0 &&
            (<GaugeContainer>
              {data?.sensors?.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.GAUGE).sort((a, b) => a.index - b.index).map((x) =>
              (
                <GaugeItem isEditing={props.isEditing} onClick={() => handleChangeInfo(x)}>
                  <span>{x.label}</span>
                  <CustomProgress value={getPercentage(x)} status='Success' />
                  <span>{getPercentage(x)}%</span>
                  <span>Max: {x.max} {x.unit}</span>
                </GaugeItem>
              ))}
            </GaugeContainer>
            )}
          <InfoContainer>
            <LabelInfo className='mb-1'>INFO</LabelInfo>
            {data?.sensors?.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.INFO).sort((a, b) => a.index - b.index).map((x) =>
              <InfoItem isEditing={props.isEditing} onClick={() => handleChangeInfo(x)}>
                <span>{x.label}:</span>
                <span>{x.lastStateSensor?.value || 0}</span>
                <span>{x.unit}</span>
              </InfoItem>
            )}
            {props.isEditing &&
              <Col>
                <Row className="mt-2" around>
                  <ButtonClear size="Tiny" status="Control" fullWidth className="flex-between" onClick={() => handAddInfo()}>
                    <EvaIcon name="plus-outline" className='mr-1' />
                  </ButtonClear>
                </Row>
              </Col>
            }
          </InfoContainer>
        </DiagramContainer>
      )}
      <ModalChangeSensor
        show={showModal}
        onClose={() => setShowModal(false)}
        onChange={(value) => handleOnConfirm(value)}
        itemSelected={sensorSelected}
        idMachine={props.filter.machine?.value}
        sensorList={props.sensorList}
        allowLabel={true}
        allowUnit={true}
        allowMax={allowMax}
        allowDelete={true}
      />
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
});

export default connect(mapStateToProps, mapDispatchToProps)(ConsumptionDiagram);