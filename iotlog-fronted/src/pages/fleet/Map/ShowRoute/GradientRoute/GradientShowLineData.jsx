import moment from "moment";
import React from "react";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { TextSpan } from "../../../../../components";
import { isValueValid, sortByDistanceArray } from "../../../../../components/Utils";

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
`;

const ContentDiv = styled.div`
  ${({ theme, x, y }) => css`
    background: ${theme.backgroundBasicColor1};
    padding: 5px;
    position: fixed;
    z-index: 1020;
    top: ${y - 80}px;
    left: ${x}px;
    border-radius: 4px;
  `}
`;

export const GradientShowLineData = (props) => {
  const { gradientRef, dataList } = props;

  const [itemDetails, setItemDetails] = React.useState(undefined);

  React.useEffect(() => {
    if (gradientRef.current) {
      const zIndex = document.querySelector('.leaflet-map-pane svg');
      gradientRef.current.on("mouseover", function (e) {
        if (isValueValid(e?.latlng?.lat) && isValueValid(e?.latlng?.lng)) {
          zIndex.style.zIndex = 0;
          setItemDetails({
            mousePoint: e.containerPoint,
            data: sortByDistanceArray(dataList, e.latlng)[0]
          });
        }
      });
      gradientRef.current.on("mousemove", function (e) {
        if (isValueValid(e?.latlng?.lat) && isValueValid(e?.latlng?.lng)) {
          setItemDetails({
            mousePoint: e.containerPoint,
            data: sortByDistanceArray(dataList, e.latlng)[0]
          });
        }
      });
      gradientRef.current.on("mouseout", function (e) {
        zIndex.style.zIndex = 200;
        setItemDetails(undefined);
      });
    }
  }, [gradientRef]);

  return (
    <>
      {!!itemDetails && (
        <ContentDiv x={itemDetails.mousePoint.x} y={itemDetails.mousePoint.y}>
          <Row>
            <TextSpan apparence="s1">
              {(itemDetails?.data[3] ?? 0)?.toFixed(1)?.replace(".", ",") || " - "}
            </TextSpan>
            <TextSpan apparence="c3" className="mt-1">
              <FormattedMessage id="kn" />
            </TextSpan>
          </Row>
          <Row>
            <TextSpan apparence="c3">
              {moment(itemDetails.data[0] * 1000).format("DD MMM YYYY")}
            </TextSpan>
          </Row>
          <Row>
            <TextSpan apparence="s3">
              {moment(itemDetails.data[0] * 1000).format("HH:mm")}
            </TextSpan>
          </Row>
        </ContentDiv>
      )}
    </>
  );
};
