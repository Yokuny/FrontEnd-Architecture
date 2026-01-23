import React, { useEffect } from 'react';
import { useState } from 'react';
import switchOpen from '../../../assets/img/open.svg';
import switchClose from '../../../assets/img/close.svg';
import { styled } from 'styled-components';
import ModalChangeSensor from '../ModalChangeSensor';

const SensorContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  max-width: 0;
`

const SensorBoxStyle = styled.div`
  width: 30px;
  height: 40px;
  background-color: #a6a6a6;
  border-radius: 8px;
  border: 1px solid black;
  position: relative;
  transform: rotate(-90deg) scaleY(-1);
  top: 24px;
  ${({ index }) => index === 3 && `left: -80px;`}
  ${({ status }) => status === "1" && `background-color: #66c28c;`}
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
  img {
    filter: invert(21%) sepia(42%) saturate(11%) hue-rotate(318deg) brightness(102%) contrast(93%);
    ${({ status }) => status === "1" && `filter: invert(100%) sepia(5%) saturate(1139%) hue-rotate(153deg) brightness(117%) contrast(100%);`}
  }
`

const SensorBox = ({ data, isEditing, onChange, idMachine, sensorList }) => {
  const [status, setStatus] = useState(data.value?.toString())
  const [sensorSelected, setSensorSelected] = useState(undefined)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    setStatus(data.value?.toString())
  }, [data])

  const handleChangeSensor = (sensor) => {
    if (isEditing) {
      setSensorSelected({
        ...sensor,
        sensor: {
          label: sensor.sensor || sensor.sensorId,
          value: sensor.sensorId || sensor.sensorId
        }
      })
      setShowModal(true);
    }
  }

  const handleOnConfirm = (sensorNew) => {
    onChange(sensorNew)
  }

  return (
    <>
      <SensorContainer>
        <SensorBoxStyle
          index={data.index}
          title={data.sensor.sensorId}
          status={status}
          isEditing={isEditing}
          onClick={() => handleChangeSensor(data.sensor)}>
          {status === "1" ?
            <img src={switchClose} style={{ display: "inline-block", width: "30px", height: "38px" }} width="100%" />
            :
            <img src={switchOpen} style={{ display: "inline-block", width: "34px", height: "38px" }} width="100%" />
          }
        </SensorBoxStyle>
      </SensorContainer>
      <ModalChangeSensor
        show={showModal}
        onClose={() => setShowModal(false)}
        onChange={handleOnConfirm}
        itemSelected={sensorSelected}
        idMachine={idMachine}
        sensorList={sensorList}
      />
    </>
  );
};

export default SensorBox;
