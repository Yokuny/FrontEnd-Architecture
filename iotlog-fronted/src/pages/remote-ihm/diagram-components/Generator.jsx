import React from 'react';
import { styled } from 'styled-components';
import switchOpen from '../../../assets/img/open.svg';
import switchClose from '../../../assets/img/close.svg';
import { useState } from 'react';
import ModalChangeSensor from '../ModalChangeSensor';
import ModalChangeInfo from '../ModalChangeInfo';
import { useLayoutEffect } from 'react';
import { isInt } from '../../../components/Utils';

const GeneratorContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex-grow: 4;
`

const ConnectionLine = styled.div`
    height: 140px;
    background-color: #a6a6a6;
    width: 8px;
    border-left: 1px solid black;
    border-right: 1px solid black;
    margin-bottom: -1px;
    margin-top: -1px;
    position: relative;
    display: flex;
    flex-direction: column;
    ${({ status }) => status === "1" && `background-color: #66c28c;`}
`

const ConnectionOutput = styled.div`
    height: 10px;
    background-color: #a6a6a6;
    width: 8px;
    border-left: 1px solid black;
    border-right: 1px solid black;
    margin-top: -1px;
    margin-bottom: -1px;
    ${({ status }) => status === "1" && `background-color: #66c28c;`}
`
const GeneratorStyle = styled.div`
    position: relative;
    background-color: #a6a6a6;
    border-radius: 50%;
    height: 80px;
    width: 80px;
    border: 1px solid black;
    ${({ status }) => status === "1" && `background-color: #66c28c;`}
    ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
`

const Label = styled.span`
    font-size: 12px;
    color: #424141;
    margin: auto;
    text-align: center;
    font-weight: bold;
    display: table-cell;
    vertical-align: middle;
    height: 80px;
    width: 80px;
    ${({ status }) => status === "1" && `color: white;`}
`

const GeneratorSwitcher = styled.div`
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
    height: 100px;
    margin-top: 15px;
    // margin-left: -30px;
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
  span:nth-child(2) {
    min-width: 35px;
  }
`


const Generator = ({ generatorData, isEditing, onChangeSensor, onChangeInfo, idMachine, sensorList }) => {
  const [status, setStatus] = useState(generatorData.lastStateSensor?.value.toString())
  const [switchStatus, setSwitchStatus] = useState(generatorData.lastStateSensorSwitch?.value.toString())
  const [label, setLabel] = useState(generatorData.label)
  const [showModalSensor, setShowModalSensor] = useState(false)
  const [showModalInfo, setShowModalInfo] = useState(false)
  const [sensorSelected, setSensorSelected] = useState()
  const [sensorType, setSensorType] = useState(undefined)
  const [allowLabel, setAllowLabel] = useState(false)

  useLayoutEffect(() => {
    setStatus(generatorData.lastStateSensor?.value.toString())
    setSwitchStatus(generatorData.lastStateSensorSwitch?.value.toString())
    setLabel(generatorData.label)
  })

  useLayoutEffect(() => {
    if (!!sensorSelected)
      setShowModalSensor(true);
  }, [sensorSelected])

  const handleChangeInfo = () => {
    if (isEditing) {
      setShowModalInfo(true);
    }
  }

  const handleChangeGeneratorSensor = (sensor, type) => {
    if (isEditing) {
      const selectedSensor = sensor.sensorId ? { label: sensor.sensor, value: sensor.sensorId } : undefined
      setSensorSelected({ label: generatorData.label, sensor: selectedSensor })
      setAllowLabel(type === "sensor")
      setSensorType(type)
    }
  }

  const handleOnConfirm = (sensorNew) => {
    onChangeSensor(sensorType, sensorNew)
  }

  const handleOnConfirmInfo = (infoList) => {
    onChangeInfo(infoList)
  }

  return (
    <GeneratorContainer>
      <GeneratorStyle status={status} isEditing={isEditing} onClick={() => handleChangeGeneratorSensor(generatorData.sensor, "sensor")}>
        <Label status={status}>{label}</Label>
      </GeneratorStyle>
      <ConnectionLine status={status} >
        <Info isEditing={isEditing} onClick={handleChangeInfo}>
          {generatorData.info?.length === 0 && <span>Info</span>}
          {generatorData.info?.map((info) => (
            <InfoStyle>
              <span>{isInt(info.value) ? info.value : info.value?.toFixed(2)}</span>
              <span>{info.unit}</span>
            </InfoStyle>
          ))}
        </Info>
      </ConnectionLine>
      <GeneratorSwitcher
        title={generatorData.sensorSwitch?.sensor}
        status={switchStatus}
        isEditing={isEditing}
        onClick={() => handleChangeGeneratorSensor(generatorData.sensorSwitch, "sensorSwitch")}
      >
        {switchStatus === "1" ?
          <img src={switchClose} style={{ display: "inline-block", width: "30px", height: "38px" }} width="100%" />
          :
          <img src={switchOpen} style={{ display: "inline-block", width: "34px", height: "38px" }} width="100%" />
        }
      </GeneratorSwitcher>
      <ConnectionOutput status={switchStatus} />
      {showModalSensor &&
        <ModalChangeSensor
          show={showModalSensor}
          onClose={() => setShowModalSensor(false)}
          onChange={handleOnConfirm}
          itemSelected={sensorSelected}
          label={label}
          idMachine={idMachine}
          allowLabel={allowLabel}
          sensorList={sensorList}
        />}
      <ModalChangeInfo
        show={showModalInfo}
        onClose={() => setShowModalInfo(false)}
        onChange={handleOnConfirmInfo}
        infoList={generatorData.info ?? []}
        idMachine={idMachine}
        sensorList={sensorList}
      />
    </GeneratorContainer>
  );
};

export default Generator;
