import { Marker, Popup } from "react-leaflet";
import { DivIcon } from "leaflet";
import { TextSpan } from "../../../components";
import { FormattedMessage } from "react-intl";

export default function MyLocation({ lat, lon }) {

  if (lat === null || lat === undefined || lon === null || lon === undefined)
    return <></>

  return (<>
    <Marker
      position={[lat,lon]}
      icon={new DivIcon({
        className: 'css-icon',
        html: '<div class="gps_ring"></div>'
      })}
    >
      <Popup position={[lat,lon]}>
        <TextSpan apparence="s2">
          <FormattedMessage id="you" />
        </TextSpan>
      </Popup>
    </Marker>
  </>)
}
