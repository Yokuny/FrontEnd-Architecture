import { Accordion } from "@paljs/ui";
import React, { useLayoutEffect } from 'react';
import HeatmapAccordionItem from "./HeatmapAccordionItem";

export default function HeatmapAccordion({ equipmentList, sensorsBase, updateHeatmapAlerts, heatmapAlerts }) {

  const [availableEquipments, setAvailableEquipments] = React.useState([]);

  function filterSensors(subGroup) {
    let sensors = [];

    if (subGroup.idSensorOnOff) {
      sensors.push({
        idSensor: subGroup.idSensorOnOff,
        key: subGroup.idSensorOnOff,
        onOff: true
      })
    }

    if (subGroup.sensors.length > 0) {

      subGroup.sensors.forEach((sensor) => {
        sensors.push({
          idSensor: sensor._id,
          key: sensor.sensorKey || '',
          onOff: false
        })
      })
    }

    return sensors;
  }

  function orderSensorsByEquipment() {

    let equipments = [];

    equipmentList.forEach((equipment, equipmentIndex) => {

      equipments.push({
        _id: equipment._id,
        equipmentIndex,
        equipmentName: equipment.name,
        equipmentCode: equipment.code,
        equipmentSubGroup: []
      })

      equipment.subgroups.forEach((subGroup, subGroupIndex) => {

        if (subGroup.idSensorOnOff || subGroup.sensors?.length > 0) {

          const newSubGroup = {
            _id: subGroup._id,
            subGroupIndex,
            subgroupName: subGroup.subgroupName,
            sensors: filterSensors(subGroup)
          }

          equipments[equipmentIndex].equipmentSubGroup.push(newSubGroup);
        }
      })

    })

    setAvailableEquipments(equipments);
  }

  useLayoutEffect(() => {
    if (equipmentList?.length > 0) {
      orderSensorsByEquipment();
    }
  }, [equipmentList]);

  return (
    <Accordion>
      {availableEquipments.map((equipment, equipmentIndex) => {
        if (equipment.equipmentSubGroup.length > 0) {

          const itemProps = {
            equipment,
            equipmentIndex,
            sensorsBase,
            updateHeatmapAlerts,
            heatmapAlerts
          }

          return <HeatmapAccordionItem key={`i-equipment-${equipmentIndex}`} {...itemProps} />
        }
      })}
    </Accordion>
  )
}