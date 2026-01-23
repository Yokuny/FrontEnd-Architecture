import React, { useState } from 'react';
import styled from 'styled-components';
import ModalChangeSensor from '../ModalChangeSensor';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { addEmptyGenerator, fetchRemoteIHMData, getSensorsRemoteIHM, setIsEditingIHM, setRemoteIHMData } from '../../../actions/ihm.action';
import { IHM_SENSOR_TYPE, TYPE_DIAGRAM } from '../../../constants';
import { floatToStringExtendDot, isInt } from '../../../components/Utils';
import { Button, Col, EvaIcon, InputGroup, Row } from '@paljs/ui';
import { FormattedMessage, useIntl } from 'react-intl';

const DiagramWrapper = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
`
const DiagramContainer = styled.div`
  width: 410px;
  display: flex;
  align-items: center;
  flex-direction: column;
  position: relative;
  height: fit-content;
`
const InfoGroup = styled.div`
  position: relative;
  margin-top: 95px;
  display: grid;
  grid-template-columns: repeat(6, 1fr) 60px;
  grid-template-rows: 36px 28px 36px 30px 40px 1fr;
  grid-auto-flow: column;
  width: 360px;
  margin-left: 34px;
`
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  grid-column: 1/7;
  grid-row: 6;
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
  margin: 20px auto;
  -webkit-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  -moz-box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  box-shadow: 6px 7px 5px -2px rgba(0,0,0,0.75);
  ${({ isEditing }) => isEditing && `cursor: pointer; border: 2px dashed white;`}
`
const InfoContainerTemp = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  ${({ reverse }) => reverse && `flex-direction: column-reverse;`}
`
const Label = styled.span`
  color: white;
  font-weight: bolder;
  font-size: 20px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`
const LabelNumber = styled.span`
  color: white;
  font-weight: bolder;
  font-size: 12px;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`
const InfoStyle = styled.div`
  position: relative;
  background-color: #a6a6a6;
  height: 16px;
  padding: 2px 6px;
  border-radius: 6px;
  border: 1px solid black;
  display: flex;
  flex-direction: row;
  gap: 4px;
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
const ButtonClear = styled(Button)`
  background-color: transparent;
  border: none;
  justify-content: center;
  height: 20px;
`

const InfoStyleStatus = styled(InfoStyle)`
  grid-row: 4;
  grid-column: 1/7;
  margin: auto;
  font-size: 12px;
  height: 20px;
  color: lawngreen;
  padding: 2px 30px;
`

const InfoContainerAverage = styled(InfoContainerTemp)`
  grid-row: 2;
  grid-column: 7;
  align-self: center;
  margin-top: 20px;
`
const InfoContainerLoad = styled(InfoContainerTemp)`
  grid-row: 5;
  grid-column: 1/7;
  align-self: center;
`

const ExhaustTemp = styled.span`
  grid-column: 1/7;
  grid-row: 2;
  color: white;
  font-weight: bolder;
  align-self: center;
  text-align: center;
  font-size: 16px;
  line-height: 1;
  text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
`

const PMSDiagram = (props) => {
  const [showModal, setShowModal] = useState(false)
  const [sensorSelected, setSensorSelected] = useState(undefined)
  const [generatorSelected, setGeneratorSelected] = useState(undefined)
  const [data, setData] = useState(undefined)

  const [allows, setAllows] = useState({
    label: false,
    unit: false,
    sizeDecimal: false,
    delete: false,
  })

  const intl = useIntl();
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

  const handleChangeInfo = (sensor, generator) => {
    if (props.isEditing) {
      setGeneratorSelected(generator)
      if (sensor.typeSensor === IHM_SENSOR_TYPE.INFO) {
        setAllows({
          label: true,
          unit: true,
          sizeDecimal: true,
          delete: true,
        })
      } else if (sensor.typeSensor === IHM_SENSOR_TYPE.STATUS) {
        setAllows({
          label: false,
          unit: false,
          sizeDecimal: false,
          delete: false,
        })
      } else {
        setAllows({
          label: false,
          unit: false,
          sizeDecimal: true,
          delete: false,
        })
      }
      setSensorSelected({ ...sensor, sensor: { label: sensor.sensor?.sensor || sensor.idSensor, value: sensor.sensor?.sensorId || sensor.idSensor } })
      setShowModal(true);
    }
  }

  const handleOnConfirm = (sensor) => {
    let data = props.data.filter((el) => el.key === generatorSelected.key)[0]
    switch (sensor.typeSensor) {
      case IHM_SENSOR_TYPE.TEMPERATURE:
        data = {
          ...data,
          sensors: data.sensors.map(el => (el.index === sensor.index && el.typeSensor === IHM_SENSOR_TYPE.TEMPERATURE ? Object.assign({}, el, { idSensor: sensor.sensor?.value, sizeDecimals: sensor?.sizeDecimals }) : el))
        }
        break;
      case IHM_SENSOR_TYPE.STATUS:
      case IHM_SENSOR_TYPE.LOAD:
        data = {
          ...data,
          sensors: data.sensors.map(el => (el.typeSensor === sensor.typeSensor ? Object.assign({}, el, { idSensor: sensor.sensor?.value, sizeDecimals: sensor?.sizeDecimals }) : el))
        }
        break;
      case IHM_SENSOR_TYPE.INFO:
        if (sensor.sensor?.value)
          data = {
            ...data,
            sensors: data.sensors.map(el => (el.index === sensor.index && el.typeSensor === IHM_SENSOR_TYPE.INFO ? Object.assign({}, el, {
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
      default:
        break;
    }
    const dataToUpdate = props.data.map((el) => (el.key === data.key ? data : el))
    props.setRemoteIHMData(dataToUpdate)
  }

  const handleChangeLabel = (generator, value) => {
    const data = props.data.map((el) => (el.key === generator.key ? Object.assign({}, el, { label: value }) : el))
    props.setRemoteIHMData(data)
  }

  const handleDeleteGenerator = (key) => {
    const data = props.data.filter((el) => el.key !== key)
    props.setRemoteIHMData(data)
  }

  const handAddInfo = (generator) => {
    const sensorInfoList = generator.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.INFO)
    let lastIndex = 0
    if (sensorInfoList.length > 0)
      lastIndex = sensorInfoList.reduce((prev, current) => (prev && prev.index > current.index) ? prev : current).index
    let data = props.data.filter((el) => el.key === generator.key)[0]
    data.sensors.push({
      typeSensor: IHM_SENSOR_TYPE.INFO,
      idSensor: 0,
      label: "vazio",
      unit: "vazio",
      index: lastIndex + 1
    })
    const dataToUpdate = props.data.map((el) => (el.key === generator.key ? data : el))
    props.setRemoteIHMData(dataToUpdate)
  }

  const getAverage = (data) => {
    const temps = data.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.TEMPERATURE)
    const average = temps.reduce((total, next) => total + next.lastStateSensor?.value, 0) / temps.length;
    const result = isInt(average) ? average : average?.toFixed(2)
    return isNaN(result) ? 0 : result
  }

  const idEnterprise = localStorage.getItem('id_enterprise_filter')
const PKC_ID = "02bad20d-039e-4abf-8aeb-5308c41ffee4"
  return (
    <DiagramWrapper>
      {props.isEditing &&
        <Col>
          <Row className="m-0" end>
            <Button size="Tiny" status="Info" className="flex-between ml-2" onClick={props.addGenerator}>
              <EvaIcon name="plus-outline" className='mr-1' />
              <FormattedMessage id="add.engine" />
            </Button>
          </Row>
        </Col>
      }
      {props.data && props.data[0]?.typeIHM === TYPE_DIAGRAM.PMS &&
        data?.map((d, i) => (<DiagramContainer key={d.key}>
          <img
            alt="enginev12"
            src={"https://s3.amazonaws.com/public.bykonz.com/engineV12.jpg"}
            style={{ display: "inline-block", width: '423px', height: '276px', position: 'absolute', top: '25px' }} width="100%" />
          {props.isEditing ?
            <Col>
              <Row className="m-0" between >
                <InputGroup fullWidth>
                  <input
                    value={d.label}
                    onChange={(e) => handleChangeLabel(d, e.target.value)}
                    type="text"
                    placeholder={intl.formatMessage({ id: "description" })}
                  />
                </InputGroup>
                <Col breakPoint={{ md: 2 }} style={{ justifyContent: "center" }}>
                  <Button size="Tiny" status="Danger" className="flex-between" onClick={() => handleDeleteGenerator(d.key)}>
                    <EvaIcon name="trash-2-outline" />
                  </Button>
                </Col>
              </Row>
            </Col>
            :
            <Label>{d.label}</Label>
          }
          <InfoGroup>
            {d.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.TEMPERATURE).sort((a, b) => a.index - b.index).toReversed().map((x, i) =>
            (<InfoContainerTemp reverse={x.index % 2 !== 0}>
              <LabelNumber>{x.index}</LabelNumber>
              <InfoStyle isEditing={props.isEditing} onClick={() => handleChangeInfo(x, d)}>
                <span
                  style={idEnterprise === PKC_ID ? {
                    fontSize: x.lastStateSensor?.value > 300 ? '12px' : '10px',
                    color: x.lastStateSensor?.value > 300 ? 'red' : 'black'
                  } : {}}
                >{floatToStringExtendDot(x.lastStateSensor?.value, x.sizeDecimals || 0)}</span>
                <span
                  style={idEnterprise === PKC_ID ? {
                    fontSize: x.lastStateSensor?.value > 300 ? '12px' : '10px',
                    color: x.lastStateSensor?.value > 300 ? 'red' : 'black'
                  } : {}}
                >ºC</span>
              </InfoStyle>
            </InfoContainerTemp>
            )
            )}
            <InfoContainerAverage>
              <InfoStyle>
                <span>{getAverage(d)}</span>
                <span>ºC</span>
              </InfoStyle>
              <LabelNumber>Average</LabelNumber>
            </InfoContainerAverage>
            <ExhaustTemp>Exhaust Temp</ExhaustTemp>
            {d.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.STATUS).map((x) =>
              <InfoStyleStatus isEditing={props.isEditing} onClick={() => handleChangeInfo(x, d)}>
                {x.lastStateSensor?.value > 0 ?
                  <span>Running</span>
                  :
                  <span style={{ color: 'red' }}>Stopped</span>
                }
              </InfoStyleStatus>
            )}
            {d.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.LOAD).map((x) =>
              <InfoContainerLoad>
                <LabelNumber>Generator Load</LabelNumber>
                <InfoStyle isEditing={props.isEditing} onClick={() => handleChangeInfo(x, d)}>
                  <span>{floatToStringExtendDot(x.lastStateSensor?.value, x.sizeDecimals || 0)}</span>
                  <span>%</span>
                </InfoStyle>
              </InfoContainerLoad>
            )}
            <InfoContainer>
              <LabelNumber className='mb-1'>INFO</LabelNumber>
              {d.sensors.filter((s) => s.typeSensor === IHM_SENSOR_TYPE.INFO).sort((a, b) => a.index - b.index).map((x) =>
                <InfoItem isEditing={props.isEditing} onClick={() => handleChangeInfo(x, d)}>
                  <span>{x.label}:</span>
                  <span>{floatToStringExtendDot(x.lastStateSensor?.value, x.sizeDecimals || 0)}</span>
                  <span>{x.unit}</span>
                </InfoItem>
              )}
              {props.isEditing &&
                <Col>
                  <Row className="mt-2" around>
                    <ButtonClear size="Tiny" status="Control" fullWidth className="flex-between" onClick={() => handAddInfo(d)}>
                      <EvaIcon name="plus-outline" className='mr-1' />
                    </ButtonClear>
                  </Row>
                </Col>
              }
            </InfoContainer>
          </InfoGroup>
        </DiagramContainer>
        ))}
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
      />
    </DiagramWrapper>
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
  addGenerator: () => {
    dispatch(addEmptyGenerator());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(PMSDiagram);
