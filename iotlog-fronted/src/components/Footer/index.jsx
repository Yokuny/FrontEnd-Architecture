import React from "react";
import { LayoutFooter } from "@paljs/ui/Layout";
import styled from "styled-components";
import TextSpan from "../Text/TextSpan";
import Row from "@paljs/ui/Row";

const FooterContainer = styled(LayoutFooter)`
  border-radius: 12px;
  box-shadow: none;

  nav {
      border-radius: 12px;
  }
`;

export default function Footer(props) {
  return (
    <FooterContainer>
      <Row end="xs" style={{ width: "100%" }}>
        <TextSpan apparence="s3" hint>{`${new Date().getFullYear()} © IoTLog powered Bykonz`}</TextSpan>
      </Row>
    </FooterContainer>
  );
}
