import React from "react";
import { useTheme } from "styled-components";
export default function TextSpan({
  children,
  className,
  style,
  apparence = "",
  hint = false,
  status = "",
  onClick= ()=> {}
}) {
  const theme = useTheme();
  const getStyle = () => {
    switch (apparence) {
      case "h1":
        return {
          fontWeight: "800",
          fontSize: 36,
        };
      case "h2":
        return {
          fontWeight: "800",
          fontSize: 30,
        };
      case "h3":
        return {
          fontWeight: "800",
          fontSize: 32,
        };
      case "h4":
        return {
          fontWeight: "800",
          fontSize: 26,
        };
      case "h5":
        return {
          fontWeight: "800",
          fontSize: 22,
        };
      case "h6":
        return {
          fontWeight: "800",
          fontSize: 18,
        };
      case "h7":
        return {
          fontWeight: "800",
          fontSize: 15,
        };
      case "s1":
        return {
          fontWeight: "600",
          fontSize: "0.9rem",
        };
      case "s2":
        return {
          fontWeight: "600",
          fontSize: "0.8rem",
        };
      case "s3": {
        return {
          fontWeight: "600",
          fontSize: "0.7rem",
        };
      }
      case "s4": {
        return {
          fontWeight: "600",
          fontSize: "0.6rem",
        };
      }
      case "c1":
        return {
          fontWeight: "400",
          fontSize: 12,
        };
      case "c2":
        return {
          fontWeight: "600",
          fontSize: 12,
        };
      case "c3":
        return {
          fontWeight: "500",
          fontSize: 10,
        };
      case "p1":
        return {
          fontWeight: "400",
          fontSize: 15,
        };
      case "p2":
        return {
          fontWeight: "400",
          fontSize: 13,
        };
      case "p3":
        return {
          fontWeight: "400",
          fontSize: 11,
        };
      case "p4":
        return {
          fontWeight: "400",
          fontSize: 9,
        };
      case "p5":
        return {
          fontWeight: "400",
          fontSize: 7,
        };
      case "label":
        return {
          fontWeight: "800",
          fontSize: 12,
        };
      default:
        return {};
    }
  };

  const styleParams = getStyle();
  hint && (styleParams.color = theme.colorBasic600);
  status && (styleParams.color = theme[`color${status}500`]);
  return (
    <span className={className} style={{ ...styleParams, ...style }} onClick={onClick}>
      {children}
    </span>
  );
}
