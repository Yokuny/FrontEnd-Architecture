import { Card } from "@paljs/ui";
import { Popup } from "react-leaflet";
import { TextSpan } from "../../../../components";
import { DmsCoordinates } from "../Coordinates/DmsCoordinates";
import WeatherPanel from "../Weather/WeatherPanel";

export default function BouyPopUp(props) {

  const getDmsData = (coords) => {
    try {
      return !!coords?.length
        ? new DmsCoordinates(coords[1], coords[0])
        : undefined;
    } catch {
      return undefined;
    }
  }

  const itemDms = getDmsData(props.item?.location[0]?.geometry?.coordinates);

  return <Popup minWidth={300} className="popup-adjust">
    <Card className="p-3">

      <TextSpan apparence="s2">
        {props.item?.name}
      </TextSpan>

      <TextSpan apparence="c2" hint>
        {props.item?.proximity}
      </TextSpan>
      <br />
      <TextSpan apparence="c2">
        <TextSpan apparence="p2" hint className="mr-2">Lat.:</TextSpan>
        {itemDms.getLatitude()?.toString()}
        <TextSpan apparence="p3" className="ml-2">{props.item?.location[0]?.geometry?.coordinates[1]}</TextSpan>
      </TextSpan>

      <TextSpan apparence="c2">
        <TextSpan apparence="p2" hint className="mr-2">Lon.:</TextSpan>
        {itemDms.getLongitude()?.toString()}
        <TextSpan apparence="p3" className="ml-2">{props.item?.location[0]?.geometry?.coordinates[0]}</TextSpan>
      </TextSpan>

      {!!props.item?.location[0]?.geometry?.coordinates?.length &&
        <WeatherPanel
          latitude={props.item?.location[0]?.geometry?.coordinates[1]}
          longitude={props.item?.location[0]?.geometry?.coordinates[0]}
        />}
    </Card>
  </Popup>
}
