import React from "react"
import { Card, CardBody } from "@paljs/ui/Card";
import { EvaIcon } from "@paljs/ui/Icon";
import moment from "moment";
import { useIntl } from "react-intl";
import { Popup } from "react-leaflet";
import styled, { useTheme } from "styled-components";
import { TextSpan } from "../../../../components";
import { Tacometer } from "../../../../components/Icons";
import {
  floatToStringBrazilian,
  formatDateDiff,
} from "../../../../components/Utils";
import { DmsCoordinates } from "../Coordinates/DmsCoordinates";

const RowRead = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
`;

const ColDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

export default function PopUpItemShowRouteDetails(props) {
  const intl = useIntl();
  const theme = useTheme();

  const { item } = props;

  const getDmsData = (coords) => {
    try {
      return !!coords?.length
        ? new DmsCoordinates(coords[0], coords[1])
        : undefined;
    } catch {
      return undefined;
    }
  };

  const itemDms = getDmsData(item?.slice(1, 3));

  return (
    <>
      <Popup>
        <Card>
          <CardBody>
            <TextSpan apparence="s2">
              {!!item.length
                ? formatDateDiff(item[0] * 1000, intl)
                : "-"}
            </TextSpan>
            <br />


            <RowRead>
              <EvaIcon
                name="compass-outline"
                className="mt-1 mr-1"
                options={{ height: 18, width: 16, fill: theme.textHintColor }}
              />
              <TextSpan apparence="s3">
                {`${floatToStringBrazilian(item[4], 1)}º`}
              </TextSpan>
            </RowRead>

            <RowRead>
              <Tacometer
                style={{
                  height: 14,
                  width: 14,
                  color: theme.textHintColor,
                  marginTop: 2,
                  marginRight: 1,
                }}
              />
              <TextSpan className="ml-2" style={{ marginTop: 2 }} apparence="s3">
                {`${floatToStringBrazilian(item[3], 1)} kn`}
              </TextSpan>
            </RowRead>

            <RowRead className="mt-1">
              <EvaIcon
                name="pin-outline"
                className="mt-1 mr-1"
                options={{ height: 18, width: 16, fill: theme.textHintColor }}
              />
              <ColDiv>
                <TextSpan style={{ marginTop: 2, marginBottom: -4 }} apparence="s3">
                  {`${itemDms?.getLatitude()?.toString()}`}
                </TextSpan>
                <TextSpan apparence="s3">
                  {`${itemDms?.getLongitude()?.toString()}`}
                </TextSpan>
              </ColDiv>
            </RowRead>

            <RowRead className="mt-1">
              <EvaIcon
                name="pin"
                className="mt-1 mr-1"
                options={{ height: 18, width: 16, fill: theme.textHintColor }}
              />
              <ColDiv>
                <TextSpan style={{ marginTop: 2, marginBottom: -4 }} apparence="s3">
                  {floatToStringBrazilian(item[1], 7)}
                </TextSpan>
                <TextSpan apparence="s3">
                  {floatToStringBrazilian(item[2], 7)}
                </TextSpan>
              </ColDiv>
            </RowRead>

            <RowRead className="mt-1">
              <EvaIcon
                name="clock-outline"
                className="mt-1 mr-1"
                options={{ height: 18, width: 16, fill: theme.textHintColor }}
              />
              <ColDiv>
                <TextSpan style={{ marginTop: 2, marginBottom: -4 }} apparence="s3">
                  {moment(item[0] * 1000).format("DD MMM YYYY")}
                </TextSpan>
                <TextSpan apparence="s3">
                  {moment(item[0] * 1000).format("HH:mm")}
                </TextSpan>
              </ColDiv>
            </RowRead>
          </CardBody>
        </Card>
      </Popup>
    </>
  );
}
