import React from "react";
import { Badge, Col } from "@paljs/ui";
import moment from "moment";
import { connect } from "react-redux";
import styled, { css, useTheme } from "styled-components";
import { useIntl } from "react-intl";
import { LabelIcon, TextSpan } from "../../../components";
import { ArrowLocationBordered, Tacometer } from "../../../components/Icons";
import { IconBorder } from "../../../components/Icons/IconRounded";
import Proximity from "../Proximity";
import { SkeletonThemed } from "../../../components/Skeleton";
import { ContentBadge, getStatusIcon, ListItemStyle } from "./Base";
import { useFormatDecimal } from "../../../components/Formatter";
import { getLatLonNormalize } from "../../../components/Utils";

const RowContent = styled.div`
  display: flex;
  flex-direction: row;
`;

const ItemStatusMachine = (props) => {
  const intl = useIntl();
  const { format } = useFormatDecimal();
  const { item, isLoading } = props;
  const theme = useTheme();

  const showValue = (value) => {
    return isLoading ? <SkeletonThemed width={100} /> : <>{value}</>;
  };

  const details = item?.lastState;
  const eta = details?.eta;
  const destiny = details?.destiny;
  const status = details?.statusNavigation;
  const position = details?.coordinate;
  const speed = details?.speed;
  const unitySpeed = details?.unitySpeed;


  const getStatusColor = (status) => {
    if (!status || !props.isNavigationIndicator){
      return item?.modelMachine?.color
    }

    return getStatusIcon(status, theme)?.bgColor;
  }

  const statusToShow = getStatusIcon(status, theme);

  const isSelected =
    props.machineDetailsSelected?.machine?.id === item?.machine?.id;

  const color = getStatusColor(status);

  return (
    <>
      <ListItemStyle isSelected={isSelected} onClick={props.onClick}>
        <Col breakPoint={{ md: 1 }} className="col-flex-center">
          {item?.modelMachine?.icon?.url ? (
            <img
              style={{ width: 23, height: 23 }}
              src={item?.modelMachine?.icon?.url}
              alt={`${item?.modelMachine?.name}`}
            />
          ) : (
            <IconBorder
              color={theme.backgroundColorBasic1}
              style={{
                transform: "rotate(225deg)",
                padding: 5,
              }}
            >
              <ArrowLocationBordered
                style={{
                  height: 21,
                  width: 21,
                  color: color,
                }}
              />
            </IconBorder>
          )}
        </Col>
        <Col breakPoint={{ md: 8 }} className="pl-4 col-flex">
          <TextSpan apparence="s2">
            {item?.machine?.code ? `${item?.machine?.code} - ` : ""}
            {item?.machine?.name}
          </TextSpan>
          <RowContent>
            <LabelIcon
              iconName="flag-outline"
              title={showValue(
                `ETA: ${
                  eta && moment(eta).isAfter(moment())
                    ? moment(eta).format("DD MMM HH:mm")
                    : "-"
                }`
              )}
            />
          </RowContent>
          <RowContent>
            <LabelIcon
              iconName="navigation-2-outline"
              title={showValue(
                eta && moment(eta).isAfter(moment()) && destiny ? destiny : "-"
              )}
            />
          </RowContent>
          <RowContent style={{ justifyContent: "space-between" }}>
            <LabelIcon
              iconName="pin-outline"
              title={showValue(
                position && (
                  <Proximity
                    id={item?.machine?.id}
                    latitude={getLatLonNormalize(position)[0]}
                    longitude={getLatLonNormalize(position)[1]}
                  />
                )
              )}
            />
          </RowContent>
          <RowContent>
            <LabelIcon
              iconName="navigation-2-outline"
              renderIcon={() => (
                <Tacometer
                  style={{
                    height: 15,
                    width: 15,
                    color: theme.textHintColor,
                    marginRight: 5,
                    marginTop: 2,
                  }}
                />
              )}
              title={showValue(
                `${
                  speed !== undefined
                    ? `${format(speed, 1)} ${
                        unitySpeed ?? intl.formatMessage({ id: "kn" })
                      }`
                    : "-"
                }` || "-"
              )}
            />
          </RowContent>
        </Col>
        <Col breakPoint={{ md: 3 }} className="col-flex-center">
          <ContentBadge className="mr-1">
            {isLoading ? (
              <SkeletonThemed width={30} />
            ) : (
              <>
                {statusToShow?.bgColor && (
                  <Badge
                    position=""
                    style={{
                      position: "inherit",
                      backgroundColor: statusToShow.bgColor,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      {statusToShow.component}
                    </div>
                  </Badge>
                )}
              </>
            )}
          </ContentBadge>
        </Col>
      </ListItemStyle>
    </>
  );
};

const mapStateToProps = (state) => ({
  isLoading: state.fleet.isLoadingStatus,
  machineDetailsSelected: state.fleet.machineDetailsSelected,
  isNavigationIndicator: state.map.isNavigationIndicator,
});

export default connect(mapStateToProps, undefined)(ItemStatusMachine);
