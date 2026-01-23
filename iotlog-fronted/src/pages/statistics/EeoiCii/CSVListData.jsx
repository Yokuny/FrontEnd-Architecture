import moment from "moment";
import React from "react";
import { CSVLink } from "react-csv";
import { getCIIRating } from "../CII/CIIRating";
import CiiService from "../../../services/CiiService";

const aroundFloat = (value, sizeDecimals = 1) => {
  if (!value) return value;
  return parseFloat(value?.toFixed(sizeDecimals));
}

export default function CSVListData(props) {
  const downloadRef = React.useRef();

  const { listData, isShowDetails } = props;

  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    setIsReady(true);
  }, []);

  React.useEffect(() => {
    if (isReady)
      onDowload();
  }, [isReady])

  const data = listData?.map((x) => {
    const ciiRequired = x.ciiRef * (1 - CiiService.getFactorByDate(x.dateTimeEnd));
    return {
    codeVoyage: x.code,
    ...(isShowDetails
      ? {
        sequence: x.sequence,
        activities: x.activities
    } : {}),
    loadWeight: aroundFloat(x.loadWeight, 2),
    distance: aroundFloat(x.distance, 2),
    unitDistance: 'nm',
    averageSpeedInVoyage: aroundFloat(x.distanceInVoyage ? (x.distanceInVoyage / x.timeInVoyage) : 0, 1),
    unitSpeed: 'kn',
    IFO: aroundFloat(x.consumption.IFO, 2),
    MDO: aroundFloat(x.consumption.MDO, 2),
    unitConsumption: 'Ton',
    // IFO_AverageInVoyage: aroundFloat((x.consumptionInVoyage.IFO ? (x.consumptionInVoyage.IFO / x.timeInVoyage) * 1000 : 0), 1),
    // MDO_AverageInVoyage: aroundFloat((x.consumptionInVoyage.MDO ? (x.consumptionInVoyage.MDO / x.timeInVoyage) * 1000 : 0), 1),
    // IFO_AverageInPort: aroundFloat((x.consumptionInPort.IFO ? (x.consumptionInPort.IFO / x.timeInPort) * 1000 : 0), 1),
    // MDO_AverageInPort: aroundFloat((x.consumptionInPort.MDO ? (x.consumptionInPort.MDO / x.timeInPort) * 1000 : 0), 1),
    // unitAverageComsuption: 'kg/h',
    cO2: aroundFloat(x.co2, 2),
    unitCO2: 'Ton',
    eeoi: aroundFloat(x.eeoi, 2),
    ciiReference: aroundFloat(x.ciiRef),
    ciiAttained: aroundFloat(x.ciiAttained),
    ciiRequired: aroundFloat(ciiRequired),
    ciiRating: getCIIRating(x?.dd, x.ciiAttained, ciiRequired)
  }}) || [];

  const onDowload = () => {
    if (downloadRef.current?.link) downloadRef.current.link.click();
  };

  return (
    <>
      <CSVLink
        filename={`eeoi_cii_${moment().format("YYYY-MM-DD-HHmmss")}`}
        data={data}
        separator={";"}
        enclosingCharacter=""
        ref={downloadRef}
        style={{ display: "none" }}
      />
    </>
  );
}
