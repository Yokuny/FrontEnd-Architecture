import React from "react";
import { useMap } from "react-leaflet";
import { Fetch } from "../../../../components";
import { REGION_DEFAULT } from "../UrlQueryMap";

const CenterZoomInitial = (props) => {
  const map = useMap();

  React.useEffect(() => {
    const idEnterpriseFilter = localStorage.getItem("id_enterprise_filter");
    if (!idEnterpriseFilter) return;
    getDataCenterEnterprise(props.centerInitial, idEnterpriseFilter);
  }, [props.centerInitial]);

  const getDataCenterEnterprise = (centerInitial, idEnterpriseFilter) => {
    if (
      centerInitial?.length &&
      centerInitial[0] === REGION_DEFAULT[0] &&
      centerInitial[1] === REGION_DEFAULT[1]
    ) {
      Fetch.get(`/setupenterprise/fleet/map?idEnterprise=${idEnterpriseFilter}`).then((response) => {
        const center = response.data?.fleet?.center;
        
        if (center && Array.isArray(center) && center.length === 2 && 
            typeof center[0] === 'number' && typeof center[1] === 'number' &&
            !isNaN(center[0]) && !isNaN(center[1])) {
          map.setView(
            center,
            response.data?.fleet?.zoom || map.getZoom()
          );
        }
      });
    }
  };

  return <></>;
};

export default CenterZoomInitial;
