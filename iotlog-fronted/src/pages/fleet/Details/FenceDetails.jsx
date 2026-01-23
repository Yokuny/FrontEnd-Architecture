import { Button, Card, EvaIcon } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { TextSpan } from "../../../components";
import { getIconItemType } from "../../register/geofence/TypeGeofence";
import ListArrivals from "../Map/Fences/ListArrivals";
import WeatherPanel from "../Map/Weather/WeatherPanel";
import ActivitiesPort from "../Map/Fences/ActivitiesPort";

const Div = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DivCenter = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

const DivCol = styled.div`
  display: flex;
  flex-direction: column;
`;

const FenceDetails = ({ dataFence, showLink, showActivity = false }) => {
  return (
    <>
      <Card status="Basic" className="p-2">
        <Div className="ml-1">
          {getIconItemType(dataFence.type, null, dataFence.color)?.icon}
          <DivCol className="ml-2 pt-2 pb-2">
            <TextSpan apparence="s1">{dataFence.description}</TextSpan>
            <TextSpan apparence="c1" hint>{dataFence.code}</TextSpan>
          </DivCol>
        </Div>
        {showActivity && <ActivitiesPort fence={dataFence} />}
        {showLink && dataFence.link && (
          <>
            {/* <ListArrivals dataFence={dataFence} /> */}
            <DivCenter>
              <Button
                status="Basic"
                onClick={() => window.open(dataFence.link, '_blank')}
                size="Tiny"
                className="flex-between mt-2">
                <EvaIcon
                  className="mr-1"
                  name="external-link-outline"
                  options={{ height: 18 }}
                />
                <FormattedMessage id="site.pilotage" />
              </Button>
            </DivCenter>
          </>
        )}
        <WeatherPanel
          latitude={dataFence?.location?.coordinates[0][0][0]}
          longitude={dataFence?.location?.coordinates[0][0][1]}
        />
      </Card>
    </>
  );
};

export default FenceDetails;
