import { Accordion, AccordionItem, Card, CardBody, Row, Container, Spinner } from "@paljs/ui";
import styled, { useTheme } from 'styled-components';
import HeatmapAlertForm from "./HeatmapAlertForm";
import React, { useLayoutEffect, useState } from 'react';
import { Fetch } from "../../../components";

const AccordionTitle = styled.span`
  font-weight: 700;
`;

const Separator = styled.div`
  height: 1px;
  width: 100%;
  background-color: ${props => props.theme.backgroundBasicColor3};
  margin-top: 12px;
  margin-bottom: 12px;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

export default function HeatmapAccordionItem(props) {

  const [equipment, setEquipment] = React.useState()

  const {
    sensorsBase,
    equipmentIndex,
    updateHeatmapAlerts,
    heatmapAlerts
  } = props;

  React.useEffect(() => {
    if (props.equipment) setEquipment(props.equipment)
  }, [props.equipment])

  if (!equipment) return <Spinner />;

  return (
    <AccordionItem uniqueKey={`i-equipment-${equipmentIndex}`} title={equipment.equipmentName}>
      {equipment.equipmentSubGroup.map((subGroup, subGroupIndex) => {

        const isLastCard = equipment.equipmentSubGroup.length == (subGroupIndex + 1);

        return (
          <Card
            key={`i-subgroup-${subGroupIndex}`}
            style={{ marginBottom: isLastCard ? 0 : '1rem' }}
          >
            <CardBody style={{ overflow: 'visible' }}>

              <AccordionTitle>{subGroup.subgroupName}</AccordionTitle>

              <Separator />

              <FormWrapper style={{ gap: 18 }}>
                <Container
                 style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12
                }}>
                  {subGroup.sensors.map((sensor, sensorIndex) => {

                    const sensorData = sensorsBase?.find(_sensor => _sensor.sensorId === sensor.key);

                    const alertFormProps = {
                      sensor,
                      sensorData,
                      updateHeatmapAlerts,
                      heatmapAlerts
                    };

                    if (sensorData) return (<HeatmapAlertForm key={`sensor-${sensorIndex}`} {...alertFormProps} />)
                  })}
                </Container>
              </FormWrapper>
            </CardBody>
          </Card>
        )
      })}
    </AccordionItem>
  )
}