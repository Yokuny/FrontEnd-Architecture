import { DivIcon, Icon } from "leaflet";
import moment from 'moment';
import { useIntl } from "react-intl";
import { Marker, Popup } from "react-leaflet";
import TextSpan from "../../../Text/TextSpan";

export default function MarkerMap(props) {
  const { machine, headTransform, coordinate, lastDate } = props;
  const intl = useIntl();

  const iconMarker =
    headTransform !== undefined
      ? new DivIcon({
          className: "leaflet-div-icon-img",
          iconSize: [25,25],
          html: `<svg aria-hidden="true" style="transform:rotate(${
            headTransform || 0
          }deg)" focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><g class="fa-group"><path fill="${
            machine?.colorPin || "currentColor"
          }" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`,
        })
      : new Icon({
          iconUrl: require("../../../../assets/img/cargo-ship.png"),
          iconSize: [40,40],
          className: "leaflet-div-icon-img adjust-pin",
        });

  return (
    <Marker position={coordinate} icon={iconMarker}>
      <Popup>
        <TextSpan apparence="s2">{machine?.machine?.label}</TextSpan>
        <br />
        <br />
        <TextSpan apparence="s3">Lat:</TextSpan>
        <TextSpan apparence="c1">{` ${coordinate[0]}`}</TextSpan>
        <br />
        <TextSpan apparence="s3">Lon:</TextSpan>
        <TextSpan apparence="c1">{` ${coordinate[1]}`}</TextSpan>
        <br />
        <TextSpan apparence="s3">
          {intl.formatMessage({ id: "last.date.acronym" })}:
        </TextSpan>
        <TextSpan apparence="c1">
          {" "}
          {lastDate
            ? moment(lastDate).format(
                intl.formatMessage({ id: "format.datetime" })
              )
            : "-"}
        </TextSpan>
      </Popup>
    </Marker>
  );
}
