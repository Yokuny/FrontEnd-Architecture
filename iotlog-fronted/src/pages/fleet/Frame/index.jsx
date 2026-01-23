import React from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  getPointsDetailsFleet,
  getStatusMachines,
  setMachines,
} from "../../../actions";
import { Fetch, SpinnerFull } from "../../../components";
import ForecastMap from "./ForecastMap";
import MapFrame from "./MapFrame";
import { useQueryFrame } from "./useQueryFrame";

const Container = styled.div`
  width: 100%;
  height: calc(100vh);
  display: flex;
`;

const FleetFrame = (props) => {
  const { token, mapType, idEnterprise } = useQueryFrame();

  const [isLoading, setIsLoading] = React.useState(false);

  const [tokenFinded, setTokenFinded] = React.useState("");
  const [mapTypeFiltered, setMapTypeFiltered] = React.useState(mapType);

  React.useLayoutEffect(() => {
    if (token) {
      localStorage.setItem("token", token);
      setTokenFinded(token);
      getVessels();
    }
  }, [token]);

  const getVessels = (search) => {
    let queryFilter = [];
    if (search) {
      queryFilter.push(`search=${search}`);
    }

    if (idEnterprise) queryFilter.push(`idEnterprise=${idEnterprise}`);

    let url = `/travel/machinelist?${queryFilter?.join("&")}`;

    Fetch.get(url)
      .then((response) => {
        setIsLoading(false);
        props.setMachines(response.data || []);
        if (response?.data?.length) {
          const idMachines = response?.data?.map((x) => x?.machine?.id);
          props.getPoints(idMachines);
          props.getStatusMachines(idMachines);
        }
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <Container>
        {tokenFinded && (
          <>
            {mapTypeFiltered == "wind" ? (
              <ForecastMap setMapTech={() => setMapTypeFiltered("")} />
            ) : (
              <MapFrame />
            )}
          </>
        )}
        <SpinnerFull isLoading={isLoading} />
      </Container>
    </>
  );
};

const mapDispatchToProps = (dispatch) => ({
  getPoints: (idMachines) => {
    dispatch(getPointsDetailsFleet(idMachines));
  },
  getStatusMachines: (idMachines) => {
    dispatch(getStatusMachines(idMachines));
  },
  setMachines: (machines) => {
    dispatch(setMachines(machines));
  },
});

export default connect(undefined, mapDispatchToProps)(FleetFrame);
