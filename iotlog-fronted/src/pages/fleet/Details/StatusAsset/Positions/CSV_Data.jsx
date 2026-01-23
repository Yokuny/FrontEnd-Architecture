import moment from "moment";
import React from "react";
import { CSVLink } from "react-csv";
import { DmsCoordinates } from "../../../Map/Coordinates/DmsCoordinates";
import { isPositionValid } from "../../../../../components/Utils";

export default function CSV_Data(props) {
  const downloadRef = React.useRef();

  const { routeHistory, machineDetailsSelected } = props;

  React.useEffect(() => {
    setTimeout(() => {
      onDowload();
    }, 1000)
  }, [])

  const getDmsData = (coords) => {
    try {
      return !!coords?.length
        ? new DmsCoordinates(coords[0], coords[1])
        : undefined;
    } catch {
      return undefined;
    }
  };

  const data = routeHistory?.filter(x => isPositionValid(x.slice(1,3)))?.map((x) => {
    const itemDms = getDmsData(x.slice(1,3));
    return {
      datetime: new Date(x[0] * 1000),
      latitude: itemDms?.getLatitude()?.toString(),
      longitude: itemDms?.getLongitude()?.toString(),
      latitude_decimal: x[1],
      longitude_decimal: x[2],
      speed: x[3],
      course: x[4],
    };
  });

  const onDowload = () => {
    if (downloadRef.current?.link) downloadRef.current.link.click();
  };

  return (
    <>
      <CSVLink
        filename={`${machineDetailsSelected?.machine?.name?.replace(/ /g, '_')}_positions_${moment().format("YYYY-MM-DD-HHmmss")}`}
        data={data}
        separator={";"}
        enclosingCharacter=""
        ref={downloadRef}
        style={{ display: "none" }}
      />
    </>
  );
}
