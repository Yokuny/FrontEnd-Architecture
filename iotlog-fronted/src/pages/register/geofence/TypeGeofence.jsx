import React from "react";
import { EvaIcon } from "@paljs/ui";
import {
  Anchor,
  Crane,
  Ocean,
  Pier,
  Polygon,
  RepeatQuad,
  RouteDestiny,
} from "../../../components/Icons";
import { TYPE_GEOFENCE } from "./Constants";

export const getIconItemType = (type, theme, color = "") => {
  switch (type?.value) {
    case TYPE_GEOFENCE.PIER:
      return {
        icon: (
          <>
            <Pier
              style={{
                height: 30,
                width: 30,
                fill: color || theme?.colorInfo500,
                paddingLeft: 2,
              }}
            />
          </>
        ),
        bgColor: theme?.colorInfo100,
        color: theme?.colorInfo500,
      };
    case TYPE_GEOFENCE.SHIPYARD:
      return {
        icon: (
          <>
            <Pier
              style={{
                height: 30,
                width: 30,
                fill: color || theme?.colorWarning700,
                paddingLeft: 2,
              }}
            />
          </>
        ),
        bgColor: theme?.colorWarning300,
        color: theme?.colorWarning600,
      };
    case TYPE_GEOFENCE.PORT:
      return {
        icon: (
          <>
            <Crane
              style={{
                height: 25,
                width: 25,
                fill: color || theme?.colorSuccess500,
                marginLeft: 4,
                marginTop: 5,
              }}
            />
          </>
        ),
        bgColor: theme?.colorSuccess100,
        color: theme?.colorSuccess500,
      };
    case TYPE_GEOFENCE.ANCHORAGE:
      return {
        icon: (
          <>
            <Anchor
              style={{
                height: 25,
                width: 25,
                fill: color || theme?.colorWarning500,
                marginLeft: 4,
                marginTop: 5,
              }}
            />
          </>
        ),

        bgColor: theme?.colorWarning100,
        color: theme?.colorWarning500,
      };
    case TYPE_GEOFENCE.ROUTE:
      return {
        icon: (
          <>
            <RouteDestiny
              style={{
                height: 25,
                width: 25,
                fill: color || theme?.colorDanger500,
                marginLeft: 3,
                marginTop: 3,
              }}
            />
          </>
        ),
        bgColor: theme?.colorDanger100,
        color: theme?.colorDanger500,
      };
    case TYPE_GEOFENCE.BAR:
      return {
        icon: (
          <>
            <Ocean
              style={{
                height: 25,
                width: 25,
                fill: color || theme?.colorPrimary500,
                marginLeft: 4,
                marginTop: 3,
              }}
            />
          </>
        ),
        bgColor: theme?.colorPrimary100,
        color: theme?.colorPrimary500,
      };
    case TYPE_GEOFENCE.DANGER_NAVIGATION:
      return {
        icon: (
          <>
            <EvaIcon
              name="alert-triangle-outline"
              options={{
                height: 28,
                width: 26,
                fill: color || theme?.colorPrimary600,
              }}
            />
          </>
        ),
        bgColor: theme?.colorPrimary100,
        color: theme?.colorPrimary600,
      };
    case TYPE_GEOFENCE.WARN_NAVIGATION:
      return {
        icon: (
          <>
            <EvaIcon
              name="info-outline"
              options={{
                height: 28,
                width: 26,
                fill: color || theme?.colorPrimary600,
              }}
            />
          </>
        ),
        bgColor: theme?.colorPrimary100,
        color: theme?.colorPrimary600,
      };
    case TYPE_GEOFENCE.MONITORING:
      return {
        icon: (
          <>
            <EvaIcon
              name="eye-outline"
              options={{
                height: 28,
                width: 26,
                fill: color || theme?.colorPrimary600,
              }}
            />
          </>
        ),
        bgColor: theme?.colorPrimary100,
        color: theme?.colorPrimary600,
      };
    case TYPE_GEOFENCE.FIELD:
    case TYPE_GEOFENCE.BASIN:
      return {
        icon: (
          <>
            <RepeatQuad
              style={{
                height: 30,
                width: 30,
                fill: color || theme?.colorInfo500,
                paddingLeft: 2,
              }}
            />
          </>
        ),
        bgColor: theme?.colorInfo100,
        color: theme?.colorInfo500,
      };
    case TYPE_GEOFENCE.OTHER:
      return {
        icon: (
          <>
            <Polygon
              style={{
                height: 30,
                width: 30,
                fill: color || theme?.colorPrimary600,
                paddingLeft: 2,
              }}
            />
          </>
        ),
        bgColor: theme?.colorPrimary100,
        color: theme?.colorPrimary600,
      };
    default:
      return {
        icon: undefined,
      };
  }
};
