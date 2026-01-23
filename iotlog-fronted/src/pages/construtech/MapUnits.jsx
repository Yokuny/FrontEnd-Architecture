import { DivIcon } from "leaflet";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import styled from "styled-components";
import { SpinnerFull } from "../../components";
import { useFetchSupport } from "../../components/Fetch/FetchSupport";

const Container = styled.div`
  width: 106.85%;
  height: 112%;
  margin-left: -2.25rem;
  margin-top: -2.25rem;
`;

const MapUnits = (props) => {
  const { isLoading, data } = useFetchSupport(`/unit/findmany`, {
    method: "get",
  });

  return (
    <>
      <Container className="map flex-row">
        <MapContainer
          style={{ width: "100%", height: "100%" }}
          center={[-12.595596, -42.55955]}
          zoom={4}
          scrollWheelZoom={true}
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; IoTLog powered <a href="https://www.bykonz.com">Bykonz</a>'
            url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          />
          {data
            ?.filter((x) => x.latitude && x.longitude)
            ?.map((x) => (
              <Marker
                icon={
                  new DivIcon({
                    className: "leaflet-div-icon-img",
                    iconSize: [25,25],
                    html: `<div><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#fff"><g data-name="Layer 2"><g data-name="home"><rect width="24" height="24" opacity="0"/><path d="M20.42 10.18L12.71 2.3a1 1 0 0 0-1.42 0l-7.71 7.89A2 2 0 0 0 3 11.62V20a2 2 0 0 0 1.89 2h14.22A2 2 0 0 0 21 20v-8.38a2.07 2.07 0 0 0-.58-1.44zM10 20v-6h4v6zm9 0h-3v-7a1 1 0 0 0-1-1H9a1 1 0 0 0-1 1v7H5v-8.42l7-7.15 7 7.19z"/></g></g></svg></div>`,
                  })
                }
                key={x.id}
                position={[x.latitude, x.longitude]}
              >
                <Popup>
                  A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
              </Marker>
            ))}
        </MapContainer>
      </Container>
      <SpinnerFull isLoading={isLoading} />
    </>
  );
};
export default MapUnits;
