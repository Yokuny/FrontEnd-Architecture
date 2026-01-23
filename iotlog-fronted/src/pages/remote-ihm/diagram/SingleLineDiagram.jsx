import React from 'react';
import { connect } from 'react-redux';
import Line from '../diagram-components/Line';
import Generator from '../diagram-components/Generator';
import Sensor from '../diagram-components/Sensor';
import IHMInfo from '../diagram-components/IHMInfo';
import SensorBox from '../diagram-components/SensorBox';
import styled from 'styled-components';
import { useEffect } from 'react';
import { fetchRemoteIHMData, getSensorsRemoteIHM, setIsEditingIHM, setRemoteIHMData } from '../../../actions/ihm.action';
import { TYPE_DIAGRAM } from '../../../constants';

const DiagramContainer = styled.div`
  height: '800px';
  width: '1000px';
  margin: '150px';
  display: 'flex';
  align-items: 'center';
  flex-direction: 'column';
`

const GeneratorContainer = styled.div`
  display: flex;
  justify-content: space-around;
`

const SensorContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`

const SingleLineDiagram = (props) => {
  const { data, isEditing, sensorList } = props;
  const reload = React.useRef();

  useEffect(() => {
    if (reload.current && props.isEditing)
      clearInterval(reload.current)
    else
      refreshIHM()

    if (props.filter.machine && props.isEditing) {
      props.getSensorsIHM(props.filter.machine.value)
    }
    return () => {
      clearInterval(reload.current)
    }
  }, [props.isEditing])

  useEffect(() => {
    if (reload.current)
      clearTimeout(reload.current)
    props.setIsEditing(false)
    refreshIHM()
  }, [props.filter])

  const refreshIHM = () => {
    reload.current = setInterval(function fetchData() {
      props.fetchIHMData();
      return fetchData
    }(), 60000);
  }

  const onChangeIHMInfo = (infoList) => {
    const remoteIHMDataNew = { ...data };
    remoteIHMDataNew.info = infoList;
    props.setData(remoteIHMDataNew)
  }
  const onChangeIHMInfo2 = (infoList) => {
    const remoteIHMDataNew = { ...data };
    remoteIHMDataNew.info2.list = infoList;
    props.setData(remoteIHMDataNew)
  }

  const onChangeIHMInfoLabel = (label) => {
    const remoteIHMDataNew = { ...data };
    remoteIHMDataNew.info2.label = label;
    props.setData(remoteIHMDataNew)
  }

  const onChangeGeneratorInfo = (level, index, infoList) => {
    const remoteIHMDataNew = { ...data };
    remoteIHMDataNew[level][index].info = infoList;
    props.setData(remoteIHMDataNew)
  }

  const onChangeSensor = (level, index, type, sensorNew) => {
    const remoteIHMDataNew = { ...data };
    if (level === "bus") {
      let busList = remoteIHMDataNew.generators ?? []
      busList = busList.filter((b) => b.index !== index)
      busList.push({
        index: index,
        sensor: {
          sensorId: sensorNew.sensor?.value,
          sensor: sensorNew.sensor?.title ?? sensorNew.sensor?.label
        }
      })
      remoteIHMDataNew.generators = busList
    } else if (level === "thrusters" && type === "info") {
      remoteIHMDataNew[level][index].info = {
        unit: sensorNew.unit,
        sensor: {
          idSensor: sensorNew.sensor?.value,
          sensor: sensorNew.sensor?.title ?? sensorNew.sensor?.label
        }
      }
    } else {
      remoteIHMDataNew[level][index][type].sensorId = sensorNew.sensor?.value
      remoteIHMDataNew[level][index][type].sensor = sensorNew.sensor?.title ?? sensorNew.sensor?.label
      remoteIHMDataNew[level][index].label = sensorNew.label
      if (type === "info")
        remoteIHMDataNew[level][index][type].unit = sensorNew.unit
    }

    props.setData(remoteIHMDataNew)
  }

  return (
    <DiagramContainer>
      {props.data?.typeIHM === TYPE_DIAGRAM.UNIFILAR &&
        <>
          <GeneratorContainer>
            <IHMInfo
              infoList={data.info}
              isEditing={isEditing}
              idMachine={props.filter.machine?.value}
              onChange={(infoList) => { onChangeIHMInfo(infoList) }}
              sensorList={sensorList}
            />
            {data.generators?.sort((a, b) => a.index - b.index).map((generator) => {
              if (generator.index === 1 || generator.index === 3)
                return (
                  <SensorBox
                    idMachine={props.filter.machine?.value}
                    data={{ ...generator, value: generator.lastStateSensor?.value }}
                    isEditing={isEditing}
                    onChange={(sensorNew) => { onChangeSensor("bus", generator.index, "", sensorNew) }}
                    sensorList={sensorList}
                  />
                )
              return (<Generator
                idMachine={props.filter.machine?.value}
                generatorData={generator}
                isEditing={isEditing}
                onChangeSensor={(type, sensorNew) => { onChangeSensor("generators", generator.index, type, sensorNew) }}
                onChangeInfo={(infoList) => { onChangeGeneratorInfo("generators", generator.index, infoList) }}
                sensorList={sensorList}
              />)
            })}
            <IHMInfo
              infoList={data.info2.list}
              label={data.info2.label}
              isEditing={isEditing}
              labelEditable={true}
              idMachine={props.filter.machine?.value}
              onChange={(infoList) => { onChangeIHMInfo2(infoList) }}
              onChangeLabel={(value) => { onChangeIHMInfoLabel(value) }}
              sensorList={sensorList}
            />
          </GeneratorContainer>
          <Line />
          <SensorContainer>
            {data.thrusters?.sort((a, b) => a.index - b.index).map((thruster) => {
              if (thruster.index === 2)
                return (<>
                  <div style={{ flexGrow: 1, maxWidth: '220px' }}></div>
                  <Sensor
                    idMachine={props.filter.machine?.value}
                    thrusterData={thruster}
                    isEditing={isEditing}
                    onChange={(type, sensorNew) => { onChangeSensor("thrusters", thruster.index, type, sensorNew) }}
                    sensorList={sensorList}
                  />
                </>)
              return (<Sensor
                idMachine={props.filter.machine?.value}
                thrusterData={thruster}
                isEditing={isEditing}
                onChange={(type, sensorNew) => { onChangeSensor("thrusters", thruster.index, type, sensorNew) }}
                sensorList={sensorList}
              />)
            }
            )}
          </SensorContainer>
        </>
      }
    </DiagramContainer>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  data: state.remoteIHMState.dataIHM,
  sensorList: state.remoteIHMState.sensorList,
  isEditing: state.remoteIHMState.isEditing,
  filter: state.remoteIHMState.filterIHM,
});

const mapDispatchToProps = (dispatch) => ({
  setData: (ihmData) => {
    dispatch(setRemoteIHMData(ihmData));
  },
  setIsEditing: (isEditing) => {
    dispatch(setIsEditingIHM(isEditing));
  },
  fetchIHMData: () => {
    dispatch(fetchRemoteIHMData());
  },
  getSensorsIHM: () => {
    dispatch(getSensorsRemoteIHM());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(SingleLineDiagram);