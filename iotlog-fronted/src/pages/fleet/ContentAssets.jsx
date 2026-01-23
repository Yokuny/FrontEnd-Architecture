import { List } from "@paljs/ui";
import React from "react";
import { connect } from "react-redux";
import { Buffer } from 'buffer';
import {
  clearPoints,
  getPointsDetailsFleet,
  setMachines,
} from "../../actions";
import { Fetch } from "../../components";
import { LoadingList } from "./LoadingList";
import ListAsset from "./ListAsset";
import { compareArray } from "../../components/Utils";

const AssetsContent = (props) => {
  const [isLoading, setIsLoading] = React.useState(false);
  const [isMachineSelected, setIsMachineSelected] = React.useState(false);

  const contentRef = React.useRef(false);

  const paramsQuery = new URL(window.location.href).searchParams;

  React.useEffect(() => {
    if (props.isReady) {
      getMachines(props.textFilter, props.filterFind);
      contentRef.current = true;
    }
    return () => {
      contentRef.current = false;
    }
  }, [props.enterprises, props.textFilter, props.filterFind]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      getVessels(props.textFilter, props.filterFind);
    }, 120000);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, []);

  React.useEffect(() => {
    if (contentRef.current)
      verifyGetLastPositions(!!props.machineDetailsSelected);
  }, [props.machineDetailsSelected]);

  const verifyGetLastPositions = (selectedNow) => {
    if (isMachineSelected && !selectedNow) {
      const idMachines = props?.machines?.map((x) => x?.machine?.id);
      props.getPoints(idMachines);
    }
    setIsMachineSelected(selectedNow)
  }

  const getMachines = (search, filter) => {
    setIsLoading(true);
    getVessels(search, filter);
  };

  const getVessels = (search, filter = undefined) => {
    props.clearPoints();
    let hasRequest;
    try {
      const request = paramsQuery.get("request");
      hasRequest = Buffer.from(request, "hex").toString()?.split("|")[0];
    } catch (e) {
    }

    let queryFilter = [];
    if (filter?.filteredModel?.length) {
      queryFilter = filter?.filteredModel?.map((x, i) => `idModel[]=${x.value}`);
    }

    if (filter?.filteredMachine?.length) {
      queryFilter = [
        ...queryFilter,
        ...filter?.filteredMachine?.map((x, i) => `idMachine[]=${x}`)
      ];
    }

    if (search) {
      queryFilter.push(`search=${search}`);
    }

    const idEnterpriseFilter = props.enterprises?.length
      ? props.enterprises[0].id
      : localStorage.getItem("id_enterprise_filter");
    if (idEnterpriseFilter) {
      queryFilter.push(`idEnterprise=${idEnterpriseFilter}`);
    }

    let url = hasRequest
      ? `/travel/machinelist?idMachine[]=${hasRequest}`
      : `/travel/machinelist?${queryFilter?.join("&")}`;

    Fetch.get(url)
      .then((response) => {
        if (!compareArray(response.data, props.machines)) {
          props.setMachines(response.data || []);
          if (response?.data?.length) {
            const idMachines = response?.data?.map((x) => x?.machine?.id);
            props.getPoints(idMachines);
          }
        }
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <List>
        {isLoading ? (
          <LoadingList
            showMoreThanOne={!props.textFilter || !props.filterFind}
          />
        ) : (
          <>
            <ListAsset />
          </>
        )}
      </List>
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  isShowList: state.fleet.isShowList,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  machines: state.fleet.machines,
});

const mapDispatchToProps = (dispatch) => ({
  getPoints: (idMachines) => {
    dispatch(getPointsDetailsFleet(idMachines));
  },
  clearPoints: () => {
    dispatch(clearPoints());
  },
  setMachines: (machines) => {
    dispatch(setMachines(machines));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(AssetsContent);
