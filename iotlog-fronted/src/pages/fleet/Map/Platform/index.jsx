import React from "react";
import { connect } from "react-redux";
import { useMap } from "react-leaflet";
import { Fetch } from "../../../../components";
import { GetZoom } from "../Utils";
import TypesPlatform from "./types";

const Platform = (props) => {
  const [data, setData] = React.useState();
  const [zoom, setZoom] = React.useState();

  const map = useMap()

  React.useEffect(() => {
    if (props.isReady || props.idEnterprise)
      setZoom(map.getZoom())
      getData(
        props.idEnterprise
          ? props.idEnterprise
          : props.enterprises?.length
          ? props.enterprises[0]?.id
          : undefined
      );
  }, [props.isReady, props.enterprises, props.idEnterprise]);

  const getData = (idEnterprise) => {
    let url = `/platform/maplist`;
    if (idEnterprise) {
      url = `${url}?idEnterprise=${idEnterprise}`;
    }
    Fetch.get(url)
      .then((response) => {
        setData(response.data?.length ? response.data : []);
      })
      .catch(() => {});
  };

  return (
    <>
      <GetZoom onChangeZoom={(e) => setZoom(e)} />
      {data
        ?.filter(
          (x) =>
            x.position?.length === 2 &&
            x.position[0] !== null &&
            x.position[1] !== null
        )
        ?.map((x) => {
          return (
            <>
              <TypesPlatform key={x.code} data={x} zoom={zoom} />
            </>
          );
        })}
    </>
  );
};
const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(Platform);
