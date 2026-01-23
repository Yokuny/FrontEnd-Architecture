import React from "react";
import { Polygon, Circle, Popup, Tooltip } from "react-leaflet";
import { connect } from "react-redux";
import { Fetch, SpinnerFull } from "../../../components";
import FenceDetails from "../Details/FenceDetails";
import FenceTooltip from "../Details/FenceTooltip";

const Fences = (props) => {
  const [data, setData] = React.useState();
  const [isLoading, setIsLoading] = React.useState(false);

  React.useEffect(() => {
    if (props.isReady || props.idEnterprise)
      getData(
        props.idEnterprise
          ? props.idEnterprise
          : props.enterprises?.length
            ? props.enterprises[0]?.id
            : undefined
      );
  }, [props.enterprises]);

  const getData = (idEnterpriseFilter) => {
    setIsLoading(true);
    let url = `/geofence/maplist`;
    if (idEnterpriseFilter) {
      url = `${url}?idEnterprise=${idEnterpriseFilter}`;
    }
    Fetch.get(url)
      .then((res) => {
        const data = res.data;
        setData(data);
        setIsLoading(false);
      })
      .catch((e) => {
        setIsLoading(false);
      });
  };

  const hasPermissionActivity = props.items?.some(
    (x) => x === "/port-activity"
  );

  return (
    <>
      {data
        ?.filter((x) => x.location?.coordinates?.length)
        ?.map((x, i) => {
          return (
            <Polygon
              key={`fence-${i}`}
              pane="tilePane"
              color={x.color}
              positions={x.location.coordinates}
              lineCap="square"
              weight={1}
              dashArray={"5,5"}
            >
              {props.showNameFence && !!x.location?.coordinates?.length && (
                <Tooltip permanent
                  position={x.location?.coordinates[0][0]}>
                  <FenceTooltip dataFence={x} showLink={false} />
                </Tooltip>
              )}
              <Tooltip position={x.location?.coordinates[0][0]}>
                <FenceTooltip dataFence={x} showLink={false} />
              </Tooltip>
              <Popup className="popup-adjust" minWidth={300} position={x.location.coordinates[0][0]}>
                <FenceDetails
                  showActivity={hasPermissionActivity}
                  dataFence={x} showLink={!props.showNameFence} />
              </Popup>
            </Polygon>
          );
        })}
      {data?.filter((x) => x.location?.properties?.radius)?.map((x, i) => {
        return (
          <Circle
            key={`fence-${i}`}
            color={x.color}
            weight={1}
            dashArray={"5,5"}
            center={x.location?.geometry.coordinates}
            radius={x.location?.properties.radius}>
            {props.showNameFence && !!x.location?.coordinates?.length && (
              <Tooltip permanent position={x.location?.geometry?.coordinates}>
                <FenceTooltip dataFence={x} showLink={false} />
              </Tooltip>
            )}
            <Tooltip position={x.location?.geometry?.coordinates}>
              <FenceTooltip dataFence={x} showLink={false} />
            </Tooltip>
            <Popup className="popup-adjust" minWidth={300} position={x.location?.geometry?.coordinates}>
              <FenceDetails
                showActivity={hasPermissionActivity}
                dataFence={x} showLink={!props.showNameFence} />
            </Popup>
          </Circle>
        )
      })}
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};

const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
  showNameFence: state.map.showNameFence,
  items: state.menu.items,
});

export default connect(mapStateToProps, undefined)(Fences);
