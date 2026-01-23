import React from "react";
import { connect } from "react-redux";
import { Circle, Marker, Popup } from "react-leaflet";
import { DivIcon, Icon } from "leaflet";
import { Fetch, TextSpan } from "../../../../components";
import BouyPopUp from "./BouyPopUp";
import ReactCountryFlag from "react-country-flag";
import { FormattedMessage } from "react-intl";
import moment from "moment";


const ListBouys = (props) => {
  const [data, setData] = React.useState();
  const [vesselsListNear, setVesselsNear] = React.useState([]);


  React.useLayoutEffect(() => {
    if (props.isReady || props.idEnterprise)
      getData(
        props.idEnterprise
          ? props.idEnterprise
          : props.enterprises?.length
            ? props.enterprises[0]?.id
            : undefined
      );

  }, [props.isReady, props.enterprises, props.idEnterprise]);

  React.useLayoutEffect(() => {
    if (data?.length && props.isShowVesselsNear) {
      getVesselsNear();
    }
    else {
      setVesselsNear([]);
    }
  }, [data, props.isShowVesselsNear]);

  const getData = (idEnterprise) => {
    let url = `/buoy/maplist`;
    if (idEnterprise) {
      url = `${url}?idEnterprise=${idEnterprise}`;
    }
    Fetch.get(url)
      .then((response) => {
        setData(response.data?.length ? response.data : []);
      })
      .catch(() => {
      });
  };

  const getVesselsNear = () => {

    const near = data?.map(x => ({
      "latitude": x.location.geometry.coordinates[1],
      "longitude": x.location.geometry.coordinates[0],
      "radius": x.location.properties.radius + 1000,
      "lookbackMinutes": 60
    }))
    Fetch.post(`/integrationthird/vesselsnear`, near)
      .then((response) => {
        setVesselsNear(response.data?.length ? response.data : []);
      })
      .catch(() => {
        setVesselsNear([]);
      });
  }

  return (
    <>
      {data?.filter(x => x.location?.length)?.map((x, i) => {
        const positionCenter = { lat: x.location[0].geometry.coordinates[1], lng: x.location[0].geometry.coordinates[0] }
        return (
          <Marker
            key={`mBouy-${i}`}
            position={positionCenter}
            icon={
              new Icon({
                iconUrl: require("../../../../assets/img/bouy.png"),
                iconSize: [20, 15],
                className: "",
              })
            }
          >
            <BouyPopUp item={x} />
            <Circle
              center={positionCenter}
              radius={x.location[0].properties.radius}
              color={x.location[0].color}
            />
          </Marker>
        )
      })}
      {vesselsListNear?.map((vesselsNear, i) => {
        return <>
          {vesselsNear
            ?.filter(x => x?.vessel?.datasheet?.vesselClass !== "ATON" && x?.vessel?.navigationalInformation?.location)
            ?.map((vesselItem, j) => <Marker
              key={`${i}-${j}-near`}
              position={{
                lat: vesselItem.vessel.navigationalInformation.location.latitude,
                lng: vesselItem.vessel.navigationalInformation.location.longitude
              }}
              icon={
                new DivIcon({
                  className: "leaflet-div-icon-img",
                  iconSize: [25, 25],
                  html: `<svg aria-hidden="true" style="transform:rotate(${!isNaN(vesselItem?.vessel?.navigationalInformation?.courseOverGround) ? vesselItem.vessel.navigationalInformation.courseOverGround - 45 : -45
                    }deg)" focusable="false" data-prefix="fad" data-icon="location-arrow" role="img" viewBox="0 0 512 512"><g class="fa-group"><path fill="#41454F" d="M461.91 0a45 45 0 0 0-17.4 3.52L28.73 195.42c-48 22.39-32 92.75 19.19 92.75h175.91v175.91c0 30 24.21 47.94 48.74 47.94 17.3 0 34.76-8.91 44-28.75L508.48 67.49C522.06 34.89 494.14 0 461.91 0zM303.83 320V208.17H192l207.67-95.85z" class="fa-secondary"></path><path fill="#ffffff" d="M399.68 112.32L303.83 320V208.17H192l207.67-95.85" class="fa-primary"></path></g></svg>`,
                })
              }
            >
              <Popup>
                <TextSpan apparence="s2">
                  {!!vesselItem?.vessel?.datasheet?.flagCountryCode && <ReactCountryFlag
                    countryCode={vesselItem.vessel.datasheet.flagCountryCode}
                    svg
                    style={{ marginLeft: 5, marginRight: 3, marginTop: -3, fontSize: "1.4em", borderRadius: 4 }} />
                  }
                  {vesselItem?.vessel?.identity?.name}</TextSpan>
                <br />
                <br />
                <TextSpan apparence="p3">MMSI:</TextSpan>
                <TextSpan apparence="c2">{`  ${vesselItem?.vessel?.identity?.mmsi}`}</TextSpan>
                <br />
                <TextSpan apparence="p3">Class:</TextSpan>
                <TextSpan apparence="c2">{`  ${vesselItem?.vessel?.datasheet?.vesselClass}`}</TextSpan>
                <br />
                <br />
                <TextSpan apparence="p3">
                  <FormattedMessage id="speed" />:
                </TextSpan>
                <TextSpan apparence="c2">{`  ${vesselItem?.vessel?.navigationalInformation?.speed || 0} nós`}</TextSpan>
                <br />
                <TextSpan apparence="p3">
                  COG:
                </TextSpan>
                <TextSpan apparence="c2">{`  ${vesselItem?.vessel?.navigationalInformation?.courseOverGround || 0}º`}</TextSpan>
                <br />
                <TextSpan apparence="p3">
                  Heading:
                </TextSpan>
                <TextSpan apparence="c2">{`  ${vesselItem?.vessel?.navigationalInformation?.heading || 0}º`}</TextSpan>
                <br />
                <TextSpan apparence="p3">
                  <FormattedMessage id="last.date.acronym" />:
                </TextSpan>
                <TextSpan apparence="c2">
                  {"  "}
                  {vesselItem?.vessel?.navigationalInformation?.timestamp
                    ? moment(vesselItem?.vessel?.navigationalInformation?.timestamp * 1000).format(
                      "DD MMM YYYY HH:mm:ss"
                    )
                    : "-"}
                </TextSpan>
                <br />
                <br />
                <TextSpan apparence="p3">
                  <FormattedMessage id="distance.buoy" />:
                </TextSpan>
                <TextSpan apparence="c2">{`  ${vesselItem?.distance?.toFixed(1)} m`}</TextSpan>
              </Popup>
            </Marker>)}
        </>
      })
      }
    </>
  );
};
const mapStateToProps = (state) => ({
  enterprises: state.enterpriseFilter.enterprises,
  isReady: state.enterpriseFilter.isReady,
});

export default connect(mapStateToProps, undefined)(ListBouys);
