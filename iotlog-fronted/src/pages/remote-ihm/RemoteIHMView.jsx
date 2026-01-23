import { Button, Card, CardBody, CardHeader, Col, EvaIcon, Row, Select } from '@paljs/ui';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { connect } from 'react-redux';
import { fetchRemoteIHMData, resetFirstFetch, saveRemoteIHM, setFilterIHM, setIsEditingIHM } from '../../actions/ihm.action';
import { SpinnerFull } from '../../components';
import { TYPE_DIAGRAM } from '../../constants';
import SelectMachineFiltered from './bravante/SelectMachineFiltered';
import AzimuthDiagram from './diagram/AzimuthDiagram';
import BowThrusterDiagram from './diagram/BowThrusterDiagram';
import ConsumptionDiagram from './diagram/ConsumptionDiagram';
import EnginesDiagram from './diagram/EnginesDiagram';
import EnginesV16Diagram from './diagram/EnginesV16Diagram';
import SingleLineDiagram from './diagram/SingleLineDiagram';
import SingleLineDiagram4DG from './diagram/SingleLineDiagram4DG';
import { useSearchParams } from 'react-router-dom';
import { SkeletonThemed } from '../../components/Skeleton';

const vesselsBravantes = ['710027230', '710031280']

const RemoteIHMView = (props) => {

  const intl = useIntl();
  const hasPermissionEdit = props.items?.some((x) => x === "/remote-ihm-edit");
  const [isReady, setIsReady] = React.useState(false);
  const [searchParams] = useSearchParams();

  React.useEffect(() => {
    return () => {
      resetFirstFetch();
    };
  }, [resetFirstFetch]);

  React.useEffect(() => {
    let timeOut;
    const idAsset = searchParams.get("idAsset");
    const nameAsset = searchParams.get("name");
    if (idAsset) {
      timeOut = setTimeout(() => {
        props.setFilter({
          machine: { value: idAsset, label: nameAsset },
          diagram: { value: TYPE_DIAGRAM.PMS, label: `DGs` }
        })
        setIsReady(true);
      }, 3000);
    }
    else {
      setIsReady(true);
    }
    return () => {
      if (timeOut)
        clearTimeout(timeOut);
      setIsReady(false);
    }
  }, []);

  let diagramType = []

  // hardcode need refactor
  if (vesselsBravantes.includes(props.filter?.machine?.value)) {
    diagramType = [
      { value: TYPE_DIAGRAM.UNIFILAR_4DG, label: intl.formatMessage({ id: "pms_4dg" }) },
      { value: TYPE_DIAGRAM.ENGINEV16, label: `DGs V16` },
      { value: TYPE_DIAGRAM.AZIMUTAL, label: intl.formatMessage({ id: "azimuth" }) },
      { value: TYPE_DIAGRAM.BOW_THRUSTER, label: intl.formatMessage({ id: "bow.thruster" }) }
    ]
  } else {
    diagramType = [
      { value: TYPE_DIAGRAM.UNIFILAR, label: intl.formatMessage({ id: "pms" }) },
      { value: TYPE_DIAGRAM.PMS, label: `DGs` },
      { value: TYPE_DIAGRAM.AZIMUTAL, label: intl.formatMessage({ id: "azimuth" }) },
      //{ value: TYPE_DIAGRAM.CONSUMO, label: intl.formatMessage({ id: "consumption" }) },
      { value: TYPE_DIAGRAM.BOW_THRUSTER, label: intl.formatMessage({ id: "bow.thruster" }) }
    ]
  }

  const onCancel = () => {
    props.setIsEditing(!props.isEditing)
    props.fetchIHMData()
  }

  const onSave = () => {
    props.saveIHM()
  }

  return (
    <>
      <Card className="mb-0">
        <CardHeader>
          <Col>
            <Row between="xs" middle="xs">
              <FormattedMessage id="remote.ihm" />
              <Col breakPoint={{ md: 6 }}>
                <Row>
                  <Col breakPoint={{ md: 6 }}>
                    <SelectMachineFiltered
                      idEnterprise={props.enterprises?.length ? props.enterprises[0].id : ""}
                      onChange={(value) => {
                        resetFirstFetch();
                        props.setFilter({ machine: value });
                      }}
                      placeholder="machine.placeholder"
                      value={props.filter.machine}
                      renderLastActivity
                    />
                  </Col>
                  <Col breakPoint={{ md: 6 }}>
                    <Select
                      options={diagramType}
                      noOptionsMessage={() => intl.formatMessage({ id: "nooptions.message" })}
                      placeholder={intl.formatMessage({ id: "diagram-type" })}
                      onChange={(value) => {
                        resetFirstFetch();
                        props.setFilter({ diagram: value });
                      }}
                      value={props.filter.diagram}
                      menuPosition="fixed"
                      isClearable
                    />
                  </Col>
                </Row>
              </Col>
              {hasPermissionEdit && !props.isEditing && (
                <Button size="Tiny" status="Info" className="flex-between" onClick={() => props.setIsEditing(!props.isEditing)}>
                  <EvaIcon name="edit-outline" className='mr-1' />
                  <FormattedMessage id="edit" />
                </Button>
              )}
              {hasPermissionEdit && props.isEditing && (
                <Row className="m-0">
                  <Button size="Tiny"
                    appearance="ghost"
                    status="Danger" className="flex-between" onClick={onCancel}>
                    <EvaIcon name="close-outline" className='mr-2' />
                    <FormattedMessage id="cancel" />
                  </Button>
                  <Button size="Tiny" status="Success" className="flex-between ml-2" onClick={onSave}>
                    <EvaIcon name="save-outline" className='mr-1' />
                    <FormattedMessage id="save" />
                  </Button>
                </Row>
              )}
            </Row>
          </Col>
        </CardHeader>
        <CardBody style={{ overflowY: 'hidden' }}>
          {isReady ? <>
            {props.filter.diagram?.value === TYPE_DIAGRAM.UNIFILAR && <SingleLineDiagram />}
            {props.filter.diagram?.value === TYPE_DIAGRAM.UNIFILAR_4DG && <SingleLineDiagram4DG />}
            {props.filter.diagram?.value === TYPE_DIAGRAM.PMS && <EnginesDiagram />}
            {props.filter.diagram?.value === TYPE_DIAGRAM.ENGINEV16 && <EnginesV16Diagram />}
            {props.filter.diagram?.value === TYPE_DIAGRAM.AZIMUTAL && <AzimuthDiagram />}
            {props.filter.diagram?.value === TYPE_DIAGRAM.CONSUMO && <ConsumptionDiagram />}
            {props.filter.diagram?.value === TYPE_DIAGRAM.BOW_THRUSTER && <BowThrusterDiagram />}
          </> :
          <>
            <SkeletonThemed height="350px" />
          </>
          }
        </CardBody >
        <SpinnerFull isLoading={props.isLoading} />
      </Card >
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  items: state.menu.items,
  itemsByEnterprise: state.menu.itemsByEnterprise,
  isEditing: state.remoteIHMState.isEditing,
  filter: state.remoteIHMState.filterIHM,
  isLoading: state.remoteIHMState.isLoading,
});

const mapDispatchToProps = (dispatch) => ({
  setFilter: (filter) => {
    dispatch(setFilterIHM(filter));
  },
  setIsEditing: (isEditing) => {
    dispatch(setIsEditingIHM(isEditing));
  },
  fetchIHMData: () => {
    dispatch(fetchRemoteIHMData());
  },
  saveIHM: () => {
    dispatch(saveRemoteIHM());
  },
  resetFirstFetch: () => {
    dispatch(resetFirstFetch());
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(RemoteIHMView);
