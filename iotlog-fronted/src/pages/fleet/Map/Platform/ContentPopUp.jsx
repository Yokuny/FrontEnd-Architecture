import { Popup } from "react-leaflet";
import { TextSpan } from "../../../../components";
import { DmsCoordinates } from "../Coordinates/DmsCoordinates";

const ContentPopUp = ({ data }) => {

  const dmsData = new DmsCoordinates(data?.position[0], data?.position[1])

  return (
    <>
    <Popup>
      <TextSpan apparence="s2">{data?.name}</TextSpan>
      <br />
      <TextSpan apparence="c3">{data?.modelType}</TextSpan>
      <br />
      <br />
      <TextSpan apparence="c3">{data?.position[0]} / {data?.position[1]}</TextSpan>
      <br />
      <TextSpan apparence="c3"><strong>{dmsData.getLatitude()?.toString()} / {dmsData.getLongitude()?.toString()}</strong></TextSpan>
    </Popup>
    </>
  );
};

export default ContentPopUp;
