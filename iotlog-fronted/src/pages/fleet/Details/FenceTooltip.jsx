import { Button, Card, EvaIcon } from "@paljs/ui";
import React from "react";
import { FormattedMessage } from "react-intl";
import styled from "styled-components";
import { TextSpan } from "../../../components";
import { getIconItemType } from "../../register/geofence/TypeGeofence";
import ListArrivals from "../Map/Fences/ListArrivals";

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

const FenceTooltip = ({ dataFence, showLink }) => {
  return (
    <>
        <Div>
          {getIconItemType(dataFence.type, null, dataFence.color)?.icon}
          <DivCol className="ml-2">
            <TextSpan apparence="s2">{dataFence.description}</TextSpan>
            <TextSpan apparence="c1">{dataFence.code}</TextSpan>
          </DivCol>
        </Div>
        {showLink && dataFence.link && (
          <>
            <DivCenter>
              <Button onClick={() => window.open(dataFence.link, '_blank')} size="Tiny" className="flex-between mt-2" appearance="ghost">
                <FormattedMessage id="site.pilotage" />
                <EvaIcon
                  className="ml-1"
                  name="external-link-outline"
                  options={{ height: 18 }}
                />
              </Button>
            </DivCenter>
          </>
        )}
    </>
  );
};

export default FenceTooltip;
