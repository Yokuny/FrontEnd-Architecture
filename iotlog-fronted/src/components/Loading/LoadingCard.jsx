import React from "react";
import Col from "@paljs/ui/Col";
import Spinner from "@paljs/ui/Spinner";
import styled, { css } from "styled-components";

const SpinnerStyled = styled(Spinner)`
  ${({ theme }) => css`
    background-color: ${theme.backgroundBasicColor1};
  `}
`;


export const LoadingCard = ({ children, isLoading, size = "Medium" }) => (
  <>
    {isLoading ? (
      <Col style={{ minHeight: 50, height: '100%' }}>
        <SpinnerStyled status="Primary" size={size}/>
      </Col>
    )
  : children}
  </>
);
