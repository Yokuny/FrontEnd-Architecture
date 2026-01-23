import React from "react";
import ReactDOMServer from "react-dom/server";
import { connect } from "react-redux";
import { Fetch, SpinnerFull } from "../../../../components";
import FenceDetails from "../../Details/FenceDetails";

var fences = [];

const FenceWind = (props) => {
  React.useLayoutEffect(() => {
    if (props.isReady || props.idEnterprise)
      getData(
        props.idEnterprise
          ? props.idEnterprise
          : props.enterprises?.length
          ? props.enterprises[0]?.id
          : undefined
      );
    return () => {
      clearFences();
    };
  }, [props.enterprises]);

  const [isLoading, setIsLoading] = React.useState(false);

  const getData = (idEnterpriseFilter) => {
    let url = `/geofence/maplist`;
    if (idEnterpriseFilter) {
      url = `${url}?idEnterprise=${idEnterpriseFilter}`;
    }
    setIsLoading(true);
    Fetch.get(url)
      .then((res) => {
        mountFences(res.data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const mountFences = (dataFences) => {
    if (!window._lmap || !dataFences?.length) return;
    for (const dataFence of dataFences) {
      const polygonFence = window.L.polygon(dataFence.location.coordinates, {
        color: dataFence.color,
      }).addTo(window._lmap);
      fences.push(polygonFence);
      if (props.showNameFence) {
        polygonFence.bindTooltip(
          `${ReactDOMServer.renderToStaticMarkup(
            <FenceDetails dataFence={dataFence} />
          )}`,
          {
            permanent: true,
            direction: "top",
            opacity: 1,
          }
        );
      }
      polygonFence.bindPopup(
        `${ReactDOMServer.renderToStaticMarkup(
          <FenceDetails dataFence={dataFence} />
        )}`
      );
    }
  };

  const clearFences = () => {
    if (window._lmap && fences?.length) {
      for (let i = 0; i < fences.length; i++) {
        window._lmap.removeLayer(fences[i]);
      }
      fences = [];
    }
  };

  return (
    <>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  showNameFence: state.map.showNameFence,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(FenceWind);
