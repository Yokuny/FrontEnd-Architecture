import React, { memo } from "react";
import ReactCountryFlag from "react-country-flag";
import { useGetProximity } from "../../../components/Hooks/FetchProximity";
import { SkeletonThemed } from "../../../components/Skeleton";

function Proximity({ latitude, longitude, id, showFlag }) {
  const { data, isLoading } = useGetProximity({ latitude, longitude, id });

  if (isLoading) {
    return (
      <>
        <SkeletonThemed width={100} />
      </>
    );
  }

  if (!data?.length) return <>-</>;

  const city = data[0];
  return (
    <>
      {`${city.name} - ${city.state?.code ?? ""}`}
      {showFlag && (
        <ReactCountryFlag
          countryCode={city.country.code}
          svg
          style={{ marginLeft: 3, marginTop: -3, fontSize: "1.4em", borderRadius: 4 }}
        />
      )}
    </>
  );
}

function areEqual(prevProps, nextProps) {
  return (
    prevProps.latitude === nextProps.latitude &&
    prevProps.longitude === nextProps.longitude &&
    prevProps.showFlag === nextProps.showFlag
  );
}

export default memo(Proximity, areEqual);
