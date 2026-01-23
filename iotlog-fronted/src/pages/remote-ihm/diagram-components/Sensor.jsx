import React, { useState } from 'react';
import { styled } from 'styled-components';
import Engine from './Engine';
import switchOpen from '../../../assets/img/open.svg';
import switchClose from '../../../assets/img/close.svg';
import { useEffect } from 'react';
import ModalChangeSensor from '../ModalChangeSensor';
import { isInt } from '../../../components/Utils';

const SensorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 180px;
    flex-grow: 1;
`

const ConnectionLine = styled.div`
    height: 10px;
    background-color: #66c28c;
    width: 8px;
    border-left: 1px solid black;
    border-right: 1px solid black;
    margin-top: -1px;
    margin-bottom: -1px;
    position: relative;
`

const ConnectionOutput = styled.div`
    height: 60px;
    background-color: #a6a6a6;
    width: 8px;
    border-left: 1px solid black;
    border-right: 1px solid black;
    margin-top: -1px;
    margin-bottom: -1px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: center;
    ${({ status }) => status === "1" && `background-color: #66c28c;`}
`

const SensorBox = styled.div`
    width: 30px;
    height: 40px;
    background-color: #a6a6a6;
    border-radius: 8px;
    border: 1px solid black;
    ${({ status }) => status === "1" && `background-color: #66c28c;`}
    ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
    img {
      filter: invert(21%) sepia(42%) saturate(11%) hue-rotate(318deg) brightness(102%) contrast(93%);
      ${({ status }) => status === "1" && `filter: invert(100%) sepia(5%) saturate(1139%) hue-rotate(153deg) brightness(117%) contrast(100%);`}
    }
`

const Info = styled.div`
    position: relative;
    background-color: #a6a6a6;
    width: 70px;
    height: 20px;
    padding: 2px 6px;
    border-radius: 6px;
    border: 1px solid black;
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-weight: bold;
    line-height: 1.2;
    text-wrap: nowrap;
    width: fit-content;
    align-self: center;
    -webkit-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
    -moz-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
    box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
    ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
`

const InfoStyle = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 4px;
`

const Sensor = ({ thrusterData, isEditing, onChange, onChangeInfo, idMachine, sensorList }) => {
  const [status, setStatus] = useState(thrusterData.lastStateSensor?.value.toString())
  const [switchStatus, setSwitchStatus] = useState(thrusterData.lastStateSensorSwitch?.value.toString())
  const [label, setLabel] = useState(thrusterData.label)
  const [showModal, setShowModal] = useState(false)
  const [sensorSelected, setSensorSelected] = useState(undefined)
  const [sensorType, setSensorType] = useState(undefined)
  const [allowUnit, setAllowUnit] = useState(false)
  const [allowLabel, setAllowLabel] = useState(false)

  useEffect(() => {
    setStatus(thrusterData.lastStateSensor?.value.toString())
    setSwitchStatus(thrusterData.lastStateSensorSwitch?.value.toString())
    setLabel(thrusterData.label)
  })

  const handleChangeThrusterSensor = (sensor, type) => {
    if (isEditing) {
      setSensorSelected({ label: thrusterData.label, sensor: { label: sensor.sensor, value: sensor.sensorId } })
      setSensorType(type)
      setAllowUnit(false)
      setAllowLabel(type === "sensor")
      setShowModal(true);
    }
  }

  const handleChangeInfo = () => {
    if (isEditing) {
      setSensorSelected({ unit: thrusterData.info?.unit, sensor: { label: thrusterData.info?.sensor?.sensor, value: thrusterData.info?.sensor?.sensorId } })
      setSensorType("info")
      setAllowLabel(false)
      setAllowUnit(true)
      setShowModal(true);
    }
  }

  const handleOnConfirm = (sensorNew) => {
    onChange(sensorType, sensorNew)
  }

  return (
    <SensorContainer>
      <ConnectionLine />
      <SensorBox
        title={thrusterData.sensorSwitch.sensor}
        status={switchStatus}
        isEditing={isEditing}
        onClick={() => handleChangeThrusterSensor(thrusterData.sensorSwitch, "sensorSwitch")}>
        {switchStatus === "1" ?
          <img src={switchClose} style={{ display: "inline-block", width: "30px", height: "38px" }} width="100%" />
          :
          <img src={switchOpen} style={{ display: "inline-block", width: "34px", height: "38px" }} width="100%" />
        }
      </SensorBox>
      <ConnectionOutput status={switchStatus}>
        <Info isEditing={isEditing} onClick={() => handleChangeInfo()}>
          {!thrusterData.info && <span>Info</span>}
          {thrusterData.info && (
            <InfoStyle>
              <span>{isInt(thrusterData.info.value) ? thrusterData.info.value : (thrusterData.info.value?.toFixed(2) || 0)}</span>
              <span>{thrusterData.info.unit}</span>
            </InfoStyle>
          )}
        </Info>
      </ConnectionOutput>
      <Engine
        label={label}
        status={status}
        isEditing={isEditing}
        onClick={() => handleChangeThrusterSensor(thrusterData.sensor, "sensor")} />
      <ModalChangeSensor
        show={showModal}
        onClose={() => setShowModal(false)}
        onChange={handleOnConfirm}
        itemSelected={sensorSelected}
        idMachine={idMachine}
        allowUnit={allowUnit}
        allowLabel={allowLabel}
        sensorList={sensorList}
      />
    </SensorContainer>
  );
};

export default Sensor;
