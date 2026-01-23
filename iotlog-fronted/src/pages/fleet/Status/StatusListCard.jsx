import { useEffect, useState } from "react";
import { connect } from "react-redux";
import { setOperationMachines, setMachineDetailsSelected } from "../../../actions";
import { Fetch, SpinnerFull } from "../../../components";
import { ListType } from "../Details/StatusAsset/TimelineStatus/IconTimelineStatus";
import { StatusNavigation } from "./StatusNavigation";
import { StatusOperation } from "./StatusOperation";
import { RowContainer } from "./styles";
import { orderedStatus } from "./Utils";
import { MachinesList } from "./MachinesList";

function StatusListCard(props) {
  const [statusList, setStatusList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    if (!props.isReady) {
      return;
    }

    if (props.isNavigationIndicator) {
      getData("navigation");
    } else if (props.isOperationIndicator) {
      getData("operation");
    }

    return () => {
      setStatusList([]);
      setMachines([]);
    };
  }, [
    props.isNavigationIndicator,
    props.isOperationIndicator,
    props.enterprises,
    props.isReady,
  ]);

  const getData = (path) => {
    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0].id
      : "";
    setIsLoading(true);
    Fetch.get(`/status/${path}/enterprise/${idEnterpriseFilter}`)
      .then((response) => {
        setStatusList(response.data);

        if (path === "operation") {
          props.setOperationMachines(response.data);
        }

        setIsLoading(false);
      })
      .catch(() => {
        setStatusList([]);
        props.setOperationMachines(null);
        setIsLoading(false);
      });
  };

  if (!props.isNavigationIndicator && !props.isOperationIndicator) {
    return null;
  }

  function groupStatus(status) {
    const machinesPerStatus = status.reduce((acc, item) => {
      if (!acc[item.value]) {
        acc[item.value] = 1;
      } else {
        acc[item.value] += 1;
      }
      return acc;
    }, {});

    return machinesPerStatus;
  }

  function groupStatusNavigation(status) {
    const machinesPerStatus = status.reduce((acc, item) => {
      const listTypeItem = ListType.find((x) => x.accept.includes(item.value?.toLowerCase())) || { value: 'other' };

      if (!acc[listTypeItem.value]) {
        acc[listTypeItem.value] = 1;
      } else {
        acc[listTypeItem.value] += 1;
      }
      return acc;
    }, {});

    return machinesPerStatus;
  }

  const statusGrouped = props.isNavigationIndicator
    ? groupStatusNavigation(statusList)
    : groupStatus(statusList);
  const listDataCount = Object.keys(statusGrouped).map((key) => ({
    status: key,
    total: statusGrouped[key],
  }));

  const handleClick = (item) => {
    setMachines(statusList.filter((status) => status.value === item || item?.accept?.includes(status.value.toLowerCase())));
  };

  const onClear = () => {
    setMachines([]);
  };

  return (
    <>
      <RowContainer
        style={{
          marginTop: '4.8rem'
        }}
      >
        {!isLoading && (
          <>
            {props.isNavigationIndicator &&
              ListType.map((item, index) => (
                <StatusNavigation
                  key={`n${index}`}
                  data={listDataCount}
                  item={item}
                  onClick={() => handleClick(item)}
                />
              ))}
            {props.isOperationIndicator &&
              orderedStatus.map((item, index) => (
                <StatusOperation
                  key={`o${index}`}
                  data={listDataCount}
                  item={item}
                  onClick={() => handleClick(item)}
                />
              ))}
            {!!machines.length && (
              <MachinesList
                data={machines}
                onClear={onClear}
                openMachine={(item) => {
                  const machineData = props.machines.find(m => m.machine.id === item.machine.id);
                  if (machineData) {
                    props.setMachineDetailsSelected(machineData);
                  }
                }}
              />
            )}
          </>
        )}
      </RowContainer>

      <SpinnerFull isLoading={isLoading} />
    </>
  );
}

const mapStateToProps = (state) => ({
  isNavigationIndicator: state.map.isNavigationIndicator,
  isOperationIndicator: state.map.isOperationIndicator,
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  machines: state.fleet.machines,
});

const mapDispatchToProps = (dispatch) => ({
  setOperationMachines: (operations) => {
    dispatch(setOperationMachines(operations));
  },
  setMachineDetailsSelected: (machine) => {
    dispatch(setMachineDetailsSelected(machine));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(StatusListCard);
