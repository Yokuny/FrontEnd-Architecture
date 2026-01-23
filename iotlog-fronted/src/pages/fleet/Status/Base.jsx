import { ListItem } from "@paljs/ui";
import { FormattedMessage } from "react-intl";
import styled, { css } from "styled-components";
import { TextSpan } from "../../../components";
import {
  Anchor,
  ArrowCircle,
  RepeatQuad,
  Route,
  RouteDP,
  Stopped,
  Vessel,
} from "../../../components/Icons";

export const ContentBadge = styled.div`
  display: flex;
  align-items: center;
`;

export const ListItemStyle = styled(ListItem)`
  ${({ theme, isSelected }) => css`
    width: 100%;
    cursor: pointer;

    ${isSelected &&
    `background-color: ${theme.colorBasicHover};
    span:first-child {
      color: ${theme.colorPrimaryFocus};
    }
    `}

    &:hover {
      background-color: ${theme.colorBasicHover};
      span:first-child {
        color: ${theme.colorPrimaryFocus};
      }

      .focus-in-hover {
        color: ${theme.colorPrimaryFocus};
      }

      .focus-in-hover .user-name {
        color: ${theme.colorPrimaryFocus};
      }
    }
  `}
`;

export const getStatusIcon = (status, theme) => {
  switch (status?.toString()?.toLowerCase()) {
    case "underway using engine":
    case "underway_using_engine":
    case "underway":
    case "under way":
    case "under way using engine":
    case "under_way_using_engine":
    case "transit":
      return {
        bgColor: theme.colorSuccess500,
        component: (
          <>
            <Route
              style={{
                height: 12,
                width: 12,
                fill: "#fff",
                marginRight: 3,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              <FormattedMessage id="in.travel" />
            </TextSpan>
          </>
        ),
      };
    case "at anchor":
    case "at_anchor":
    case "stopped":
    case "stop":
      return {
        bgColor: theme.colorWarning500,
        component: (
          <>
            <Anchor
              style={{
                height: 12,
                width: 12,
                fill: "#fff",
                marginRight: 3,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              <FormattedMessage id="at.anchor" />
            </TextSpan>
          </>
        ),
      };
    case "moored":
    case "port":
      return {
        bgColor: theme.colorPrimary500,
        component: (
          <>
            <Anchor
              style={{
                height: 12,
                width: 12,
                fill: "#fff",
                marginRight: 3,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              <FormattedMessage id="moored" />
            </TextSpan>
          </>
        ),
      };
    case "dock":
      return {
        bgColor: theme.colorWarning900,
        component: (
          <>
            <Vessel
              style={{
                height: 12,
                width: 12,
                color: "#fff",
                marginRight: 3
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              <FormattedMessage id="dock" />
            </TextSpan>
          </>
        ),
      };
    case "dp":
      return {
        bgColor: theme.colorInfo500,
        component: (
          <>
            <RouteDP
              style={{
                height: 13,
                width: 14,
                fill: "#fff",
                marginRight: 3,
                color: theme.colorInfo500,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              DP
            </TextSpan>
          </>
        ),
      };
    case "stand by":
    case "stand_by":
    case "standby":
      return {
        bgColor: '#ff8116',
        component: (
          <>
            <RouteDP
              style={{
                height: 12,
                width: 13,
                fill: "#fff",
                marginRight: 3,
                color: theme.colorWarning600,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              Stand by
            </TextSpan>
          </>
        ),
      };
    case "fast transit":
    case "fasttransit":
    case "fast_transit":
      return {
        bgColor: theme?.colorSuccess700,
        component: (
          <>
            <Route
              style={{
                height: 12,
                width: 12,
                fill: "#fff",
                marginRight: 3,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              Fast transit
            </TextSpan>
          </>
        ),
      };
    case "slow":
      return {
        bgColor: theme?.colorSuccess400,
        component: (
          <>
            <Route
              style={{
                height: 12,
                width: 12,
                fill: "#fff",
                marginRight: 3,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              Slow
            </TextSpan>
          </>
        ),
      };
    case "restricted manoeuvrability":
      return {
        bgColor: theme.colorWarning600,
        component: (
          <>
            <RepeatQuad
              style={{
                height: 13,
                width: 13,
                fill: "#fff",
                marginRight: 2,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              <FormattedMessage id="restricted.manoeuvrabilitys" />
            </TextSpan>
          </>
        ),
      };
    case "underway by sail":
      return {
        bgColor: theme.colorInfo500,
        component: (
          <>
            <ArrowCircle
              style={{
                height: 12,
                width: 12,
                fill: "#fff",
                marginRight: 2,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              <FormattedMessage id="underway.sail" />
            </TextSpan>
          </>
        ),
      };
    case "other":
      return {
        bgColor: theme.colorBasic600,
        component: (
          <>
            <Vessel
              style={{
                height: 12,
                width: 12,
                color: "#fff",
                marginRight: 2,
              }}
            />
            <TextSpan apparence="c2" style={{ color: "#fff" }}>
              <FormattedMessage id="other" />
            </TextSpan>
          </>
        ),
      };
    default:
      return null
  }
};
