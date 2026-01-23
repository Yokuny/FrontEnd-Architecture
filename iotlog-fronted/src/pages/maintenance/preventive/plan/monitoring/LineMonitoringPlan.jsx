import Row from "@paljs/ui/Row";
import React from "react";
import { UserImage } from "../../../../../components";
import ItemMonitoringPlan from "./ItemMonitoringPlan";
import { CreateSocket } from "../../../../../components/Socket";
import { TYPE_MAINTENANCE } from "../../../../../constants";

export default function LineMonitoringPlan({ item, onSelectItem }) {
  const [listItens, setListItens] = React.useState([]);

  React.useLayoutEffect(() => {
    setListItens(item?.monitoringPlan || []);
  }, [item?.monitoringPlan]);

  React.useLayoutEffect(() => {
    let socket;

    const updateData = (newStates) => {
        if (newStates?.length) {
          let plansToUpdate = item.monitoringPlan;
          for (const newState of newStates) {
            const planUpdateIndex = plansToUpdate.findIndex(
              (z) => z.idMaintenancePlan === newState.idMaintenancePlan
            );
            if (planUpdateIndex >= 0) {
              plansToUpdate = [
                ...plansToUpdate.slice(0, planUpdateIndex),
                newState,
                ...plansToUpdate.slice(planUpdateIndex + 1),
              ];
            }
          }
          setListItens(plansToUpdate);
        }
      };

    if (
      item?.idMachine &&
      item?.monitoringPlan?.some(
        (y) =>
          y?.typeMaintenance === TYPE_MAINTENANCE.DATE_OR_WEAR ||
          y?.typeMaintenance === TYPE_MAINTENANCE.WEAR
      )
    ) {
      //socket = CreateSocket();
     // socket.on(`wear_plan_machine_${item?.idMachine}`, updateData);
    }

    return () => {
      socket?.disconnect();
      socket = undefined;
    };
  }, [item?.idMachine, item?.monitoringPlan]);

  function handleSelectItem(monitoringItem) {
    onSelectItem({
      idMachine: item.idMachine,
      idMaintenancePlan: monitoringItem.idMaintenancePlan,
      dateWindowEnd: monitoringItem.dateWindowEnd,
    });
  }

  return (
    <>
      <UserImage
        size="Large"
        image={item?.image?.url}
        name={item?.name}
        title={item?.enterprise?.name}
      />
      <Row end top className="mr-1">
        {listItens?.map((monitorItem, index) => {
          return (
            <ItemMonitoringPlan
              key={`${monitorItem.idMaintenancePlan}-${index}`}
              monitorItem={monitorItem}
              idMachine={item.idMachine}
              onClick={() => handleSelectItem(monitorItem)}
            />
          );
        })}
      </Row>
    </>
  );
}
