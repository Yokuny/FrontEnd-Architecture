import { EvaIcon } from "@paljs/ui";
import {
  Anchor,
  RouteDP,
  Vessel,
  MapMarkerDistance,
  Crane
} from "../../../../../components/Icons";
import { TYPE_TRAVEL_STATUS } from "../../../../../constants";

export const ListStatusOrderedered = [
  "dp",
  "stand by",
  "stand_by",
  "standby",
  "stand by ready",
  "stand_by_ready",
  "standbyready",
  "underway using engine",
  "underway_using_engine",
  "underway",
  "under way",
  "under way using engine",
  "under_way_using_engine",
  "fast transit",
  "fasttransit",
  "fast_transit",
  "transit",
  "slow",
  "at anchor",
  "at_anchor",
  "moored",
  "port",
  "dock",
  "stopped",
  "other"
];

export const ListType = [
  {
    value: "dp",
    accept: ["dp", "dynamic_position", "dynamic position"],
  },
  {
    value: "standby",
    accept: ["stand by", "stand_by", "standby"],
  },
  {
    value: "standbyready",
    accept: ["stand by ready", "stand_by_ready", "standbyready"],
  },
  {
    value: "underway",
    accept: [
      "underway using engine",
      "underway_using_engine",
      "underway",
      "under way",
      "under way using engine",
      "under_way_using_engine",
      "transit"
    ],
  },
  {
    value: "fasttransit",
    accept: ["fast transit", "fasttransit", "fast_transit"],
  },
  {
    value: "slow",
    accept: ["slow"],
  },
  {
    value: "at_anchor",
    accept: ["at anchor", "at_anchor", "stopped", "anchorage"],
  },
  {
    value: "port",
    accept: ["moored", "port"],
  },
  {
    value: "dock",
    accept: ["dock"],
  },
  {
    value: "other",
    accept: ["other"],
  }
];

export function getIcon(statusType, theme, colorStatus = false, styleIcon = {}) {
  switch (statusType?.toLowerCase()) {
    case "fast transit":
    case "fasttransit":
    case "fast_transit":
      return {
        bgColor: theme?.colorSuccess700,
        backgroundColor: theme?.colorSuccess100,
        text: "fast.transit",
        component: (
          <>
            <EvaIcon
              name={"trending-up-outline"}
              status="Basic"
              style={{
                height: 20,
                width: 20,
                fill: colorStatus ? theme?.colorSuccess700 : "#fff",
                ...styleIcon
              }}
            />
          </>
        ),
      };
    case "transit":
    case "underway using engine":
    case "underway_using_engine":
    case "underway":
    case "under way":
    case "under way using engine":
    case "under_way_using_engine":
      return {
        bgColor: theme?.colorSuccess500,
        backgroundColor: theme?.colorSuccess100,
        text: "in.travel",
        component: (
          <>
            <MapMarkerDistance
              style={{
                height: 20,
                width: 20,
                fill: colorStatus ? theme?.colorSuccess500 : "#fff",
                padding: 2,
                ...styleIcon
              }}
            />
          </>
        ),
      };
    case "slow":
      return {
        bgColor: theme?.colorWarning400,
        backgroundColor: theme?.colorSuccess100,
        text: "slow",
        component: (
          <>
            <EvaIcon
              name={"trending-down-outline"}
              status="Basic"
              style={{
                height: 20,
                width: 20,
                fill: colorStatus ? theme?.colorWarning400 : "#fff",
                ...styleIcon
              }}
            />
          </>
        ),
      };
    case "at anchor":
    case "at_anchor":
    case "stopped":
      return {
        bgColor: theme?.colorWarning500,
        backgroundColor: theme?.colorWarning100,
        text: "at.anchor",
        component: (
          <>
            <Anchor
              style={{
                height: 20,
                width: 20,
                fill: colorStatus ? theme?.colorWarning500 : "#fff",
                padding: 2,
                ...styleIcon
              }}
            />
          </>
        ),
      };
    case "moored":
    case "port":
      return {
        bgColor: theme?.colorPrimary500,
        backgroundColor: theme?.colorPrimary100,
        text: "moored",
        component: (
          <>
            <Crane
              style={{
                height: 20,
                width: 20,
                fill: colorStatus ? theme?.colorPrimary500 : "#fff",
                padding: 2,
                ...styleIcon
              }}
            />
          </>
        ),
      };
    case "dp":
      return {
        bgColor: theme?.colorInfo500,
        backgroundColor: theme?.colorInfo100,
        text: "dp",
        component: (
          <>
            <RouteDP
              style={{
                height: 20,
                width: 20,
                fill: colorStatus ? theme?.colorInfo500 : "#fff",
                padding: 2,
                ...styleIcon
              }}
            />
          </>
        ),
      };
    case "stand by":
    case "stand_by":
    case "standby":
      return {
        bgColor: '#ff8116',
        backgroundColor: '#FFEFD0',
        text: "stand.by",
        component: (
          <>
            <EvaIcon
              name={"radio-button-on-outline"}
              status="Basic"
              style={{
                height: 20,
                width: 20,
                fill: colorStatus ? '#ff8116' : "#fff",
                ...styleIcon
              }}
            />
          </>
        ),
      };
    case "stand by_ready":
    case "stand_by_ready":
    case "standbyready":
      return {
        bgColor: '#20C1FC',
        backgroundColor: '#D2FEFE',
        text: "stand.by.ready",
        component: (
          <>
            <EvaIcon
              name={"radio-button-on-outline"}
              status="Basic"
              style={{
                height: 20,
                width: 20,
                fill: colorStatus ? '#20C1FC' : "#fff",
                ...styleIcon
              }}
            />
          </>
        ),
      };
    case "dock":
      return {
        bgColor: theme?.colorWarning900,
        backgroundColor: '#F6EACB',
        text: "dock",
        component: (
          <>
            <EvaIcon
              status="Basic"
              name={"settings-outline"}
              options={{ width: 19 }}
            />
          </>
        ),
      };
    // case "stopped":
    // case "stop":
    //   return {
    //     bgColor: theme.colorBasic300,
    //     backgroundColor: theme?.colorDefault100,
    //     text: "stopped",
    //     component: (
    //       <Stopped
    //         style={{
    //           height: 20,
    //           width: 20,
    //           fill: theme.colorBasic600
    //         }}
    //       />
    //     ),
    //   };
    case "other":
      return {
        bgColor: theme?.colorWarning900,
        backgroundColor: '#F6EACB',
        text: "other",
        component: (
          <>
            <EvaIcon
              status="Basic"
              name={"settings-outline"}
              options={{ width: 19 }}
            />
          </>
        ),
      };
    default:
      return {
        bgColor: theme?.colorBasic300,
        backgroundColor: theme?.colorDefault100,
        text: "other",
        component: (
          <Vessel
            style={{
              height: 20,
              width: 20,
              color: theme?.textHintColor,
              padding: 2,
            }}
          />
        ),
      };
  }
}

export const getIconInRoute = (type, theme) => {
  if (type === TYPE_TRAVEL_STATUS.INIT_TRAVEL)
    return {
      backgroundColor: theme.colorPrimary100,
      bgColor: theme.colorPrimary500,
      text: "departure",
      component: (
        <EvaIcon
          name={"radio-button-on"}
          options={{ width: 20, fill: "#fff" }}
        />
      ),
    };

  if (type === TYPE_TRAVEL_STATUS.FINISH_TRAVEL)
    return {
      name: "flag",
      backgroundColor: theme.colorSuccess100,
      bgColor: theme.colorSuccess500,
      text: "arrival",
      component: (
        <EvaIcon name={"flag"} options={{ width: 20, fill: "#fff" }} />
      ),
    };
};
