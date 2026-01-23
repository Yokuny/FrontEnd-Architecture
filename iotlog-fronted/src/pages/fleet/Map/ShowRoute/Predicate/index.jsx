import React from "react";
import { Polyline } from "react-leaflet";
import { useTheme } from "styled-components";
import { Fetch } from "../../../../../components";
import { isPositionValid } from "../../../../../components/Utils";

const PredicateRoute = (props) => {
  const [data, setData] = React.useState([]);

  const theme = useTheme();

  React.useEffect(() => {
    getData(props.idMachine);
    return () => {
      setData([]);
    };
  }, [props.idMachine]);

  const getData = (idMachine) => {
    Fetch.get(`/fleet/predicate?idMachine=${idMachine}`)
      .then((response) => {
        setData(response?.data)
      })
      .catch((err) => {});
  };

  return (
    <>
      {!!data?.length && (
        <Polyline
          positions={data?.filter(x => isPositionValid(x))}
          color={theme.colorDanger600}
          dashArray={"10,10"}
          lineCap="square"
        />
      )}
    </>
  );
};

export default PredicateRoute;
