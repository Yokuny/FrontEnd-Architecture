import { Button, Card, CardBody, CardFooter, CardHeader, Row } from "@paljs/ui";
import React, { useLayoutEffect, useRef } from 'react';
import { FormattedMessage } from "react-intl";
import { connect } from "react-redux";
import { useNavigate } from "react-router-dom";
import styled, { useTheme } from "styled-components";
import { toast } from 'react-toastify';
import { useIntl } from "react-intl";
import { Fetch, Modal, SpinnerFull, TextSpan } from "../../../components";
import { BellCheck } from "../../../components/Icons";
import HeatmapAccordion from "./HeatmapAccordion";


const JustifyBetween = styled.div`
  display: flex;
  justify-content: space-between;
`;

const HeatmapAlerts = (props) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const intl = useIntl();

  const heatmapAlertsRef = useRef(null)

  const [isLoading, setIsLoading] = React.useState(false);
  const [machine, setMachine] = React.useState();
  const [sensorsBase, setSensorsBase] = React.useState([]);
  const [equipmentList, setEquipmentList] = React.useState([]);
  const [enterprise, setEnterprise] = React.useState();
  const [heatmapAlerts, setHeatmapAlerts] = React.useState(undefined);
  const [heatmapAlertsInitial, setHeatmapAlertsInitial] = React.useState(undefined);
  const [modalVisibility, setModalVisibility] = React.useState(false)

  const idHeatmap = new URL(window.location.href).searchParams.get("id");

  function fetchMachineHeatmapAlerts(id) {

    heatmapAlertsRef.current = {}

    Fetch.get(`/heatmap-alerts/${id}`, { defaultTakeCareError: false })
      .then((response) => {

        if (response.data === null) return generateHeatmapAlerts(id);

        heatmapAlertsRef.current = { ...response.data, idMachine: id }
        setHeatmapAlerts({ ...response.data, idMachine: id });
        setHeatmapAlertsInitial({ ...response.data, idMachine: id });
      })
      .catch((e) => {
        toast.error(intl.formatMessage({ id: "error.get" }))
      })
  }

  function handleOnSave() {

    if (heatmapAlertsInitial.alerts.length === 0) {

      Fetch.post('/heatmap-alerts/', heatmapAlerts)
        .then((response) => {
          toast.success(intl.formatMessage({ id: "save.successfull" }))
          navigate(-1)
        })
        .catch((e) => {
          toast.error(intl.formatMessage({ id: "error.save" }))

        })
    } else {

      Fetch.put('/heatmap-alerts/', heatmapAlerts)
        .then((response) => {
          toast.success(intl.formatMessage({ id: "save.successfull" }))
          navigate(-1)
        })
        .catch((e) => {
          toast.error(intl.formatMessage({ id: "error.update" }))
        })
    }
  }

  function fetchSensors(id) {
    setIsLoading(true)
    Fetch.get(`/machine/sensors?id=${id}`, { defaultTakeCareError: false })
      .then((response) => {
        setSensorsBase(response.data || []);
        setIsLoading(false)
      })
      .catch((e) => {
        toast.error(intl.formatMessage({ id: "error.get" }))
      });
  }

  function fetchMachineHeatmap() {
    setIsLoading(true);
    Fetch.get(`/machineheatmap/find?id=${idHeatmap}`)
      .then((response) => {
        if (response.data) {

          const fleet = response.data;

          if (fleet.enterprise) {
            setEnterprise({
              label: fleet.enterprise.name,
              value: fleet.enterprise.id,
            });
          }
          if (fleet?.machine)
            setMachine({
              label: fleet.machine.name,
              value: fleet.machine.id,
            });

          if (fleet.equipments?.length) {
            setEquipmentList(fleet.equipments || [])
          }
          setIsLoading(false);
        }
        else {
          setIsLoading(false);
        }

      })
      .catch((e) => {
        setIsLoading(false);
      });
  }

  function resetAlerts() {

    const newHeatmapAlerts = {
      idMachine: machine.value,
      alerts: []
    }

    Fetch.put('/heatmap-alerts/', newHeatmapAlerts)
      .then((_) => {
        toast.info(intl.formatMessage({ id: "deactivate.successfull" }))
        navigate(-1)
      })
      .catch((e) => {
        toast.error(intl.formatMessage({ id: "error.deactivate" }))
      })
  }

  function generateHeatmapAlerts(idMachine) {
    setHeatmapAlertsInitial({ idMachine, alerts: [] });
    setHeatmapAlerts({ idMachine, alerts: [] });
  }

  function addHeatmapAlert(alert) {
    let updatedHeatmapAlerts = { ...heatmapAlerts }
    updatedHeatmapAlerts.alerts.push(alert)
    setHeatmapAlerts(updatedHeatmapAlerts)
  }

  function updateHeatmapAlert(i, alert) {
    let updatedHeatmapAlerts = { ...heatmapAlerts }
    updatedHeatmapAlerts.alerts[i] = alert
    setHeatmapAlerts(updatedHeatmapAlerts)
  }

  function updateHeatmapAlerts(alert) {
    const alertIndex = heatmapAlerts.alerts.findIndex((_alert) => _alert.idAlert === alert.idAlert);

    if (alertIndex > -1) {
      updateHeatmapAlert(alertIndex, alert)
    } else {
      addHeatmapAlert(alert)
    }
  }

  useLayoutEffect(() => {
    if (idHeatmap) { fetchMachineHeatmap(); }
  }, []);

  useLayoutEffect(() => {
    if (machine?.value) {
      fetchSensors(machine?.value);
      fetchMachineHeatmapAlerts(machine?.value);
    }
  }, [machine?.value]);

  if (isLoading) return <SpinnerFull />

  return (
    <Card fullWidth>
      <CardHeader>
        <TextSpan appearance="s1">{machine?.label} - <FormattedMessage id="settings.heatmap.alerts" /></TextSpan>
      </CardHeader>
      <CardBody>

        {equipmentList && sensorsBase && (
          <HeatmapAccordion
            equipmentList={equipmentList}
            sensorsBase={sensorsBase}
            updateHeatmapAlerts={updateHeatmapAlerts}
            heatmapAlerts={heatmapAlerts}
          />
        )}
      </CardBody>

      <CardFooter>
        <Row between="xs" className="m-0">
          <Row className="m-0">
            <Button
              size="Small"
              status="Basic"
              appearance="ghost"
              onClick={() => navigate(-1)}
              disabled={!enterprise?.value || !machine?.value}
            >
              <FormattedMessage id="cancel" />
            </Button>

            <Button
              status="Danger"
              appearance="ghost"
              disabled={!enterprise?.value || !machine?.value || heatmapAlertsInitial?.alerts?.length === 0}
              style={{ cursor: (heatmapAlertsInitial?.alerts?.length === 0) ? 'default' : 'pointer' }}
              onClick={() => setModalVisibility(true)}
            >
              <FormattedMessage id="delete" />
            </Button>
          </Row>

          <Button
            size="Small"
            status="Success"
            onClick={() => handleOnSave()}
            className="flex-between"
            disabled={!enterprise?.value || !machine?.value}
          >
            <BellCheck
              style={{
                height: '1rem',
                width: '1rem',
                marginRight: '0.3rem',
                fill: theme.textControlColor
              }}
            />
            <FormattedMessage id="save" />

          </Button>
        </Row>
      </CardFooter>

      <Modal
        hideOnBlur
        onClose={() => setModalVisibility(false)}
        size="Small"
        show={modalVisibility}
        textTitle={<TextSpan apparence="s2"><FormattedMessage id="caution" />!</TextSpan>}
        styleContent={{ userSelect: 'none' }}
        renderFooter={() => (
          <CardFooter>
            <JustifyBetween>
              <Button onClick={() => setModalVisibility(false)}>
                <FormattedMessage id='not' />
              </Button>

              <Button status="Danger" appearance="ghost" onClick={() => resetAlerts()}>
                <FormattedMessage id='yes' />
              </Button>
            </JustifyBetween>
          </CardFooter>
        )}
      >
        <TextSpan apparence="p1" className="p-2">
          <FormattedMessage id="settings.heatmap.alerts.remove" />
        </TextSpan>
      </Modal>
    </Card>
  )
}

const mapStateToProps = (state) => ({
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(HeatmapAlerts);
